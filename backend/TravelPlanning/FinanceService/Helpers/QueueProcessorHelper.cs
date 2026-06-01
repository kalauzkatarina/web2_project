using Common.DTOs.finance;
using Common.Enums;
using FinanceService.Interfaces;
using FinanceService.Models;
using FinanceService.QueueModels;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.ServiceFabric.Data;
using Microsoft.ServiceFabric.Data.Collections;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace FinanceService.Helpers
{
    public class QueueProcessorHelper
    {
        private readonly IReliableStateManager _stateManager;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger _logger;
        private readonly string _queueName;
        private readonly BudgetCacheHelper _cacheHelper; 

        public QueueProcessorHelper(IReliableStateManager stateManager, IServiceProvider serviceProvider, ILogger logger, string queueName, BudgetCacheHelper cacheHelper)
        {
            _stateManager = stateManager;
            _serviceProvider = serviceProvider;
            _logger = logger;
            _queueName = queueName;
            _cacheHelper = cacheHelper;
        }

        public async Task ProcessAsync(CancellationToken ct)
        {
            var queue = await _stateManager.GetOrAddAsync<IReliableQueue<ExpenseQueueItem>>(_queueName);

            using (var tx = _stateManager.CreateTransaction())
            {
                var item = await queue.TryDequeueAsync(tx);

                if (item.HasValue)
                {
                    _logger.LogInformation("Procesor je pronašao stavku u redu! Tip: {0}", item.Value.OperationType);
                    try
                    {
                        var command = item.Value;
                        switch (command.OperationType)
                        {
                            case ExpenseOperationType.Add:
                                await HandleAddAsync(command.Payload);
                                var data = JsonSerializer.Deserialize<AddExpenseDto>(command.Payload);
                                await _cacheHelper.RefreshAsync(data.PlanId);
                                break;
                            case ExpenseOperationType.Update:
                                await HandleUpdateAsync(command.Payload);
                                break;

                            case ExpenseOperationType.Delete:
                                await HandleDeleteAsync(command.Payload);
                                break;
                        }

                        await tx.CommitAsync();
                    }catch (Exception ex)
                    {
                        _logger.LogError(ex, "Queue processing failed.");
                        await Task.Delay(TimeSpan.FromSeconds(5), ct);
                    }
                }
            }
        }

        private async Task HandleAddAsync(string payload)
        {
            var addDto = JsonSerializer.Deserialize<AddExpenseDto>(payload);
            using var scope = _serviceProvider.CreateScope();
            var repo = scope.ServiceProvider.GetRequiredService<IExpenseRepository>();

            var expense = new Expense(
                Guid.NewGuid(),
                addDto.PlanId,
                addDto.Title,
                addDto.Amount,
                addDto.Category,
                addDto.Date,
                addDto.Description);

            _logger.LogInformation("Pokušavam SQL upis za plan: {0}", expense.PlanId);
            await repo.AddAsync(expense);
            _logger.LogInformation("SQL upis završen bez greške.");
        }

        private async Task HandleUpdateAsync(string payload)
        {
            using var scope = _serviceProvider.CreateScope();
            var repo = scope.ServiceProvider.GetRequiredService<IExpenseRepository>();

            // 1. Provera da li je sistemski Update (SyncActivityCostAsync)
            if (payload.Contains("Automatic activity synchronization (UPDATE)"))
            {
                var dto = JsonSerializer.Deserialize<AddExpenseDto>(payload);

                // Ista logika kao kod brisanja - nađi trošak po imenu
                string activityName = dto.Title.Replace("Update: ", "").Replace("Activity: ", "");
                var allExpenses = await repo.GetByPlanIdAsync(dto.PlanId);
                var toUpdate = allExpenses.FirstOrDefault(e => e.Title.Contains(activityName));

                if (toUpdate != null)
                {
                    toUpdate.Amount = dto.Amount; // Ažuriraj iznos
                    await repo.UpdateAsync(toUpdate);
                    _logger.LogInformation($"SQL: Automatski ažuriran trošak '{toUpdate.Title}'");
                }
                return;
            }

            // 2. Ručni Update (Standardni tok)
            try
            {
                var updatePayload = JsonSerializer.Deserialize<UpdateQueuePayload>(payload);
                var expense = await repo.GetByIdAsync(updatePayload.ExpenseId);

                if (expense != null)
                {
                    expense.Title = updatePayload.Dto.Title;
                    expense.Amount = updatePayload.Dto.Amount;
                    expense.Category = updatePayload.Dto.Category;
                    expense.Date = updatePayload.Dto.Date;
                    expense.Description = updatePayload.Dto.Description;
                    await repo.UpdateAsync(expense);
                    _logger.LogInformation($"SQL: Ručno ažuriran trošak: {updatePayload.ExpenseId}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Greška pri obradi ručnog update-a.");
            }
        }

        //private async Task HandleDeleteAsync(string payload)
        //{
        //    var expenseId = JsonSerializer.Deserialize<Guid>(payload);
        //    using var scope = _serviceProvider.CreateScope();
        //    var repo = scope.ServiceProvider.GetRequiredService<IExpenseRepository>();
        //    await repo.DeleteAsync(expenseId);
        //    _logger.LogInformation($"Expense deleted from SQL: {expenseId}");
        //}

        private async Task HandleDeleteAsync(string payload)
        {
            using var scope = _serviceProvider.CreateScope();
            var repo = scope.ServiceProvider.GetRequiredService<IExpenseRepository>();

            // 1. Probaj Guid (ostaje isto)
            if (Guid.TryParse(payload.Replace("\"", ""), out Guid expenseId))
            {
                await repo.DeleteAsync(expenseId);
                return;
            }

            // 2. Automatsko brisanje (OVDE JE PROMENA)
            try
            {
                var dto = JsonSerializer.Deserialize<AddExpenseDto>(payload);

                // Uzmi samo ime aktivnosti (skini "Delete: " prefix)
                string activityName = dto.Title.Replace("Delete: ", "").Replace("Activity: ", "");

                var allExpenses = await repo.GetByPlanIdAsync(dto.PlanId);

                // Tražimo trošak koji sadrži ime te aktivnosti
                var toDelete = allExpenses.FirstOrDefault(e => e.Title.Contains(activityName));

                if (toDelete != null)
                {
                    await repo.DeleteAsync(toDelete.Id);
                    _logger.LogInformation($"SQL: Uspešno obrisan trošak '{toDelete.Title}' za aktivnost '{activityName}'");
                }
                else
                {
                    _logger.LogWarning($"SQL: Nije pronađen trošak koji sadrži '{activityName}' u planu {dto.PlanId}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Greška pri parsiranju payload-a za brisanje.");
            }
        }
    }
}
