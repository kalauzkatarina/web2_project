using FinanceService.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.ServiceFabric.Data;
using Microsoft.ServiceFabric.Data.Collections;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceService.Helpers
{
    public class BudgetCacheHelper
    {
        private readonly IReliableStateManager _stateManager;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger _logger;
        private readonly string _cacheName;

        public BudgetCacheHelper(IReliableStateManager stateManager, IServiceProvider serviceProvider, ILogger logger, string cacheName)
        {
            _stateManager = stateManager;
            _serviceProvider = serviceProvider;
            _logger = logger;
            _cacheName = cacheName;
        }

        public async Task PreloadCacheAsync(CancellationToken ct)
        {
            var loaded = false;
            while(!loaded && !ct.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var repo = scope.ServiceProvider.GetRequiredService<IExpenseRepository>();

                    var allExpense = await repo.GetAllAsync();
                    var cache = await _stateManager.GetOrAddAsync<IReliableDictionary<Guid, double>>(_cacheName);

                    if (allExpense.Any())
                    {
                        using(var tx = _stateManager.CreateTransaction())
                        {
                            foreach(var group in allExpense.GroupBy(e => e.PlanId))
                            {
                                await cache.SetAsync(tx, group.Key, group.Sum(x => x.Amount));
                            }
                            await tx.CommitAsync();
                        }
                    }

                    loaded = true;
                    _logger.LogInformation("Budget cache loaded from SQL.");
                }
                catch(Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to load cache, retrying...");
                    await Task.Delay(TimeSpan.FromSeconds(5), ct);
                }
            }
        }
    
        public async Task RefreshAsync(Guid planId)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var repo = scope.ServiceProvider.GetRequiredService<IExpenseRepository>();
                var total = await repo.GetTotalByPlanIdAsync(planId);

                var cache = await _stateManager.GetOrAddAsync<IReliableDictionary<Guid, double>>(_cacheName);

                using (var tx = _stateManager.CreateTransaction())
                {
                    await cache.SetAsync(tx, planId, total);
                    await tx.CommitAsync();
                }
            } catch(Exception ex)
            {
                _logger.LogError(ex, $"Failed to refresh cache for plan {planId}.");
            }
        }

        public async Task RemoveAsync(Guid planId)
        {
            try
            {
                var cache = await _stateManager.GetOrAddAsync<IReliableDictionary<Guid, double>>(_cacheName);

                using (var tx = _stateManager.CreateTransaction())
                {
                    await cache.TryRemoveAsync(tx, planId);
                    await tx.CommitAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to remove cache for plan {planId}");
            }
        }
    }
}
