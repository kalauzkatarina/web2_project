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
                                await HandleAddAsync(command.Payload, command.UserId);
                                break;
                            case ExpenseOperationType.Update:
                                await HandleUpdateAsync(command.Payload, command.UserId);
                                break;

                            case ExpenseOperationType.Delete:
                                await HandleDeleteAsync(command.Payload, command.UserId);
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

        private async Task HandleAddAsync(string payload, Guid userId)
        {

            using var scope = _serviceProvider.CreateScope();
            var expenseService = scope.ServiceProvider.GetRequiredService<IExpenseService>();

            // Svi šalju AddExpenseDto, nema potrebe za ručnim parsiranjem property-a
            try
            {
                var dto = JsonSerializer.Deserialize<AddExpenseDto>(payload);
                if (dto.ActivityId.HasValue)
                {
                    // Ovo je sistemski poziv
                    await expenseService.SyncActivityAddAsync(dto.ActivityId.Value, dto.PlanId, dto.Amount, dto.Title, dto.Category);
                }
                else
                {
                    // Ovo je ručni unos
                    await expenseService.AddAsync(dto, userId);
                    await _cacheHelper.RefreshAsync(dto.PlanId);
                }

            }
            catch (JsonException ex)
            {
                _logger.LogError("JSON DESERIJALIZACIJA PUKLA ZA PAYLOAD: {0}. Greška: {1}", payload, ex.Message);
            }
        }

        private async Task HandleUpdateAsync(string payload, Guid userId)
        {
            using var scope = _serviceProvider.CreateScope();
            var service = scope.ServiceProvider.GetRequiredService<IExpenseService>();

            // Provera da li je sistemski Update
            var json = JsonDocument.Parse(payload).RootElement;

            // Ako sadrži property "activityId", znači da je sistemski Update
            if (json.TryGetProperty("ActivityId", out var activityIdProp))
            {
                Guid activityId = Guid.Parse(activityIdProp.ToString());
                double amount = json.GetProperty("Amount").GetDouble();
                string title = json.GetProperty("Title").GetString();
                var category = (ExpenseCategory)json.GetProperty("Category").GetInt32();

                await service.SyncActivityUpdateAsync(activityId, amount, title, category);
                _logger.LogInformation("SQL: Automatski ažuriran trošak za ActivityId: {0}", activityId);
                return;
            }

            // Ručni Update
            var updatePayload = JsonSerializer.Deserialize<UpdateQueuePayload>(payload);
            var result = await service.UpdateAsync(updatePayload.ExpenseId, userId, updatePayload.Dto);

            if (!result.IsSuccess) _logger.LogError("Greška pri update-u: {0}", result.ErrorMessage);
        }

        private async Task HandleDeleteAsync(string payload, Guid userId)
        {
            using var scope = _serviceProvider.CreateScope();
            var service = scope.ServiceProvider.GetRequiredService<IExpenseService>();

            var cleanPayload = payload.Replace("\"", "");

            if (Guid.TryParse(cleanPayload, out Guid expenseId))
            {
                var result = await service.DeleteAsync(expenseId, userId);

                if (result.IsSuccess)
                    _logger.LogInformation("SQL: Ručno obrisan trošak {0}", expenseId);

                return;
            }

            try
            {
                var json = JsonDocument.Parse(payload).RootElement;

                if (json.TryGetProperty("ActivityId", out var activityIdProp))
                {
                    //Automatska sinhronizacija
                    Guid activityId = Guid.Parse(activityIdProp.ToString());
                    var expense = await service.GetByActivityIdAsync(activityId);

                    var result = await service.SyncActivityDeleteAsync(activityId);

                    if (result.IsSuccess && expense != null)
                    {
                        await _cacheHelper.RefreshAsync(expense.PlanId);
                        _logger.LogInformation("SQL: Automatski obrisan trosak za ActivityId: {0} i ozvezen kes za Plan {1}", activityId, expense.PlanId);
                    }
                    else
                        _logger.LogError("Greška pri automatskom brisanju: {0}", result.ErrorMessage);

                    return;
                }
            }
            catch (JsonException)
            {
                // Ako parsiranje JSON-a ne uspe, znači da je payload običan Guid (ručno brisanje)
            }
        }
    }
}
