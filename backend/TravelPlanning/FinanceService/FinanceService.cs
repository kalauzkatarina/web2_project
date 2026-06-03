using Common.DTOs.finance;
using Common.Enums;
using Common.Interfaces;
using Common.Models;
using FinanceService.Context;
using FinanceService.Helpers;
using FinanceService.Interfaces;
using FinanceService.QueueModels;
using FinanceService.Repositories;
using FinanceService.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using static System.Formats.Asn1.AsnWriter;

namespace FinanceService
{
    /// <summary>
    /// An instance of this class is created for each service replica by the Service Fabric runtime.
    /// 
    /// Reliable Dictinary (_budgetCache) sluzi za brzinu. U njemu se cuvaju samo PlanId i TotalAmount. 
    /// Kada korisnik udje u aplikaciju, ne zelimo da SQL baza racuna Sum(amount) svaki put, vec to odmah citamo iz memorije (Dictionary)
    /// azurira se kod AddExpense(dodaj iznos na kes), UpdateExpense(ukloni stari, dodaj novi iznos), DeleteExpense(oduzmi iznos)
    /// 
    /// Reliable Queue (_sqlQueue) - mi trosak upisemo u Queue, i odmah odgovorimo korisniku uspesno
    /// dok u pozadini QueueProcessorHelper lagano uzima jedan po jedan zahtev iz reda i upisuje u SQL. To osigurava da aplikacija nikada ne koci zbog baze.
    /// 
    /// </summary>
    internal sealed class FinanceService : StatefulService, IFinanceService
    {
        private readonly ServiceProvider _serviceProvider;
        private readonly ILogger<FinanceService> _logger;

        private IReliableDictionary<Guid, double> _budgetCache; //kljuc je planId, vrednost je ukupni troskovi
        private IReliableQueue<ExpenseQueueItem> _sqlQueue;

        private BudgetCacheHelper _cacheHelper;
        private QueueProcessorHelper _queueHelper;

        private const string BudgetCacheName = "budgetCache";
        private const string SqlQueueName = "sqlQueue";

        public FinanceService(StatefulServiceContext context)
            : base(context)
        {
            _serviceProvider = ConfigureServices(context);
            _logger = _serviceProvider.GetRequiredService<ILogger<FinanceService>>();
        }

        private ServiceProvider ConfigureServices(StatefulServiceContext context)
        {
            var config = context.CodePackageActivationContext.GetConfigurationPackageObject("Config").Settings;
            var sqlConn = config.Sections["DbConfig"].Parameters["FinanceDbConnectionString"].Value;

            var services = new ServiceCollection();
            services.AddDbContext<FinanceDbContext>(options => options.UseSqlServer(sqlConn));
            services.AddScoped<IExpenseRepository, ExpenseRepository>();
            services.AddScoped<IExpenseService, ExpenseService>();
            services.AddLogging();

            return services.BuildServiceProvider();
        }

        public async Task<Result<ExpenseDto>> AddExpenseAsync(AddExpenseDto dto, Guid userId)
        {
            using (var tx = StateManager.CreateTransaction())
            {
                await _sqlQueue.EnqueueAsync(tx, new ExpenseQueueItem
                {
                    OperationType = ExpenseOperationType.Add,
                    Payload = JsonSerializer.Serialize(dto),
                    UserId = userId
                });

                await _budgetCache.AddOrUpdateAsync(
                    tx, dto.PlanId, dto.Amount, (id, old) => old + dto.Amount);

                await tx.CommitAsync();
                _logger.LogInformation("Podatak uspešno stavljen u Queue.");
            }

            return Result<ExpenseDto>.Success(new ExpenseDto
            {
                Id = Guid.NewGuid(),
                PlanId = dto.PlanId,
                Title = dto.Title,
                Amount = dto.Amount,
                Category = dto.Category,
                Date = dto.Date,
                Description = dto.Description,
                CreatedAt = DateTime.Now
            });
        }

        public async Task<Result<bool>> DeleteExpenseAsync(Guid expenseId, Guid userId)
        {
            using(var checkScope = _serviceProvider.CreateScope())
            {
                var service = checkScope.ServiceProvider.GetRequiredService<IExpenseService>();
                var existing = await service.GetByIdAsync(expenseId, userId);
                if(!existing.IsSuccess)
                    return Result<bool>.Failure(existing.ErrorMessage);

                using(var tx = StateManager.CreateTransaction())
                {
                    await _sqlQueue.EnqueueAsync(tx, new ExpenseQueueItem
                    {
                        OperationType = ExpenseOperationType.Delete,
                        Payload = JsonSerializer.Serialize(expenseId),
                        UserId = userId,
                    });

                    await _budgetCache.AddOrUpdateAsync(
                        tx, existing.Data.PlanId, 0, (id, old) => old - existing.Data.Amount);

                    await tx.CommitAsync();
                }

                return Result<bool>.Success(true);
            }
        }

        public async Task<Result<bool>> DeleteExpensesByPlanAsync(Guid planId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var repo = scope.ServiceProvider.GetRequiredService<IExpenseRepository>();
                var success = await repo.DeleteByPlanIdAsync(planId);

                if (success)
                    await _cacheHelper.RemoveAsync(planId);

                return success
                    ? Result<bool>.Success(true)
                    : Result<bool>.Failure("Failed to delete expenses.");
            }
        }

        public async Task<Result<BudgetSummaryDto>> GetBudgetSummaryAsync(Guid planId, Guid userId)
        {
            //dohvati plannedBudget iz TravelPlanService
            double plannedBudget = 0;
            try
            {
                var travelPlanProxy = ServiceProxy.Create<ITravelPlanService>(
                    new Uri("fabric:/TravelPlanning/TravelPlanService"));

                var planResult = await travelPlanProxy.GetPlanByIdAsync(planId, userId);
                if (!planResult.IsSuccess)
                    return Result<BudgetSummaryDto>.Failure("Travel plan not found.");

                plannedBudget = planResult.Data.PlannedBudget;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error communicating with TravelPlanService.");
                return Result<BudgetSummaryDto>.Failure("TravelPlanService is unavailable.");
            }

            //dohvati totalExpenses iz kesa
            using(var tx = StateManager.CreateTransaction())
            {
                var cached = await _budgetCache.TryGetValueAsync(tx, planId);
                double totalExpenses = cached.HasValue ? cached.Value : 0;

                return Result<BudgetSummaryDto>.Success(new BudgetSummaryDto
                {
                    PlanId = planId,
                    PlannedBudget = plannedBudget,
                    TotalExpenses = totalExpenses,
                    RemainingBudget = plannedBudget - totalExpenses
                });
            }
        }

        public async Task<Result<ExpenseDto>> GetExpenseByIdAsync(Guid expenseId, Guid userId)
        {
            using(var scope = _serviceProvider.CreateScope())
            {
                var service = scope.ServiceProvider.GetRequiredService<IExpenseService>();
                return await service.GetByIdAsync(expenseId, userId);
            }
        }

        public async Task<Result<List<ExpenseDto>>> GetExpensesByPlanAsync(Guid planId, Guid userId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var service = scope.ServiceProvider.GetRequiredService<IExpenseService>();
                return await service.GetByPlanAsync(planId, userId);
            }
        }

        public async Task<Result<bool>> UpdateExpenseAsync(Guid expenseId, Guid userId, UpdateExpenseDto dto)
        {
            using(var checkScope = _serviceProvider.CreateScope())
            {
                var service = checkScope.ServiceProvider.GetRequiredService<IExpenseService>();
                var existing = await service.GetByIdAsync(expenseId, userId);
                if(!existing.IsSuccess)
                    return Result<bool>.Failure(existing.ErrorMessage);

                using(var tx = StateManager.CreateTransaction())
                {
                    await _sqlQueue.EnqueueAsync(tx, new ExpenseQueueItem
                    {
                        OperationType = ExpenseOperationType.Update,
                        Payload = JsonSerializer.Serialize(new UpdateQueuePayload
                        {
                            ExpenseId = expenseId,
                            Dto = dto
                        }),
                        UserId = userId
                    });

                    await _budgetCache.AddOrUpdateAsync(
                        tx, existing.Data.PlanId,
                        dto.Amount,
                        (id, old) => old - existing.Data.Amount + dto.Amount);

                    await tx.CommitAsync();
                }

                return Result<bool>.Success(true);
            }
        }

        public async Task<Result<bool>> SyncActivityCostAsync(Guid userId, Guid planId, Guid activityId, double newTotalAmount, string title, string operation, ExpenseCategory category)
        {
            _logger.LogInformation("SYNC POZVAN ZA ACTIVITY {0}", activityId);
            using (var scope = _serviceProvider.CreateScope())
            {
                var repo = scope.ServiceProvider.GetRequiredService<IExpenseRepository>();
                var existing = await repo.GetByActivityIdAsync(activityId);

                if (existing != null)
                {
                    existing.Title = title;
                    existing.Category = category;
                    await repo.UpdateAsync(existing);
                }

                double oldAmount = existing?.Amount ?? 0;
                double delta = (operation == "ADD") ? newTotalAmount : (newTotalAmount - oldAmount);

                if (Math.Abs(delta) < 0.01 && operation != "ADD") return Result<bool>.Success(true);

                var dto = new AddExpenseDto
                {
                    PlanId = planId,
                    Title = title,
                    Amount = newTotalAmount,
                    Category = category,
                    ActivityId = activityId,
                    Date = DateTime.UtcNow
                };

                using (var tx = StateManager.CreateTransaction())
                {
                    //Ažuriranje keš sa izračunatom deltom
                    await _budgetCache.AddOrUpdateAsync(tx, planId, delta, (id, old) => old + delta);

                    await _sqlQueue.EnqueueAsync(tx, new ExpenseQueueItem
                    {
                        OperationType = operation switch 
                        { 
                            "DELETE" => ExpenseOperationType.Delete, 
                            "UPDATE" => ExpenseOperationType.Update, 
                            _ => ExpenseOperationType.Add },
                            Payload = JsonSerializer.Serialize(dto),
                            UserId = userId
                    });
                    await tx.CommitAsync();
                    return Result<bool>.Success(true);
                }
            }
        }

        /// <summary>
        /// Optional override to create listeners (e.g., HTTP, Service Remoting, WCF, etc.) for this service replica to handle client or user requests.
        /// </summary>
        /// <remarks>
        /// For more information on service communication, see https://aka.ms/servicefabricservicecommunication
        /// </remarks>
        /// <returns>A collection of listeners.</returns>
        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            return this.CreateServiceRemotingReplicaListeners();
        }

        /// <summary>
        /// This is the main entry point for your service replica.
        /// This method executes when this replica of your service becomes primary and has write status.
        /// </summary>
        /// <param name="cancellationToken">Canceled when Service Fabric needs to shut down this service replica.</param>
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            // TODO: Replace the following sample code with your own logic 
            //       or remove this RunAsync override if it's not needed in your service.

            _budgetCache = await StateManager.GetOrAddAsync<IReliableDictionary<Guid, double>>(BudgetCacheName);
            _sqlQueue = await StateManager.GetOrAddAsync<IReliableQueue<ExpenseQueueItem>>(SqlQueueName);

            //inicijalizacija helpera
            _cacheHelper = new BudgetCacheHelper(StateManager, _serviceProvider, _logger, BudgetCacheName);
            _queueHelper = new QueueProcessorHelper(StateManager, _serviceProvider, _logger, SqlQueueName, _cacheHelper);

            //ucitaj kes iz Sql pri startu
            await _cacheHelper.PreloadCacheAsync(cancellationToken);

            //procesiraj Queue
            while(!cancellationToken.IsCancellationRequested)
            {
                //await _queueHelper.ProcessAsync(cancellationToken);
                try
                {
                    await _queueHelper.ProcessAsync(cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Greška u glavnoj petlji procesora!");
                }
                await Task.Delay(TimeSpan.FromMilliseconds(500), cancellationToken);
            }
             
        }
    }
}
