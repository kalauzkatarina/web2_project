using ChecklistService.Context;
using ChecklistService.Gateways;
using ChecklistService.Interfaces;
using ChecklistService.Repositories;
using ChecklistService.Services;
using Common.DTOs.checklist;
using Common.Interfaces;
using Common.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Numerics;
using System.Threading;
using System.Threading.Tasks;

namespace ChecklistService
{
    /// <summary>
    /// An instance of this class is created for each service instance by the Service Fabric runtime.
    /// </summary>
    internal sealed class ChecklistService : StatelessService, IChecklistService
    {
        private readonly ServiceProvider _serviceProvider;
        public ChecklistService(StatelessServiceContext context)
            : base(context)
        {
            var config = context.CodePackageActivationContext
               .GetConfigurationPackageObject("Config").Settings;

            var sqlConn = config.Sections["DbConfig"]
                .Parameters["ChecklistDbConnectionString"].Value;

            var services = new ServiceCollection();
            services.AddDbContext<ChecklistDbContext>(options => options.UseSqlServer(sqlConn));
            services.AddScoped<IChecklistRepository, ChecklistRepository>();
            services.AddScoped<ITravelPlanGateway, TravelPlanGateway>();
            services.AddScoped<IChecklistDomainService, ChecklistDomainService>();
            
            _serviceProvider = services.BuildServiceProvider();
        }

        public async Task<Result<ChecklistItemDto>> AddItemAsync(Guid userId, AddChecklistItemDto dto)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var service = scope.ServiceProvider.GetRequiredService<IChecklistDomainService>();
                return await service.AddItemAsync(userId, dto);
            }
        }

        public async Task<Result<bool>> DeleteByPlanAsync(Guid planId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var service = scope.ServiceProvider.GetRequiredService<IChecklistDomainService>();
                return await service.DeleteByPlanAsync(planId);
            }
        }

        public async Task<Result<bool>> DeleteItemAsync(Guid itemId, Guid userId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var service = scope.ServiceProvider.GetRequiredService<IChecklistDomainService>();
                return await service.DeleteItemAsync(itemId, userId);
            }
        }

        public async Task<Result<List<ChecklistItemDto>>> GetByPlanAsync(Guid planId, Guid userId)
        {
            using(var scope = _serviceProvider.CreateScope())
            {
                var service = scope.ServiceProvider.GetRequiredService<IChecklistDomainService>();
                return await service.GetByPlanAsync(planId, userId);
            }
        }

        public async Task<Result<ChecklistItemDto>> ToggleItemAsync(Guid itemId, Guid userId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var service = scope.ServiceProvider.GetRequiredService<IChecklistDomainService>();
                return await service.ToggleItemAsync(itemId, userId);
            }
        }

        public async Task<Result<bool>> UpdateItemAsync(Guid itemId, Guid userId, UpdateChecklistItemDto dto)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var service = scope.ServiceProvider.GetRequiredService<IChecklistDomainService>();
                return await service.UpdateItemAsync(itemId, userId, dto);
            }
        }

        /// <summary>
        /// Optional override to create listeners (e.g., TCP, HTTP) for this service replica to handle client or user requests.
        /// </summary>
        /// <returns>A collection of listeners.</returns>
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return this.CreateServiceRemotingInstanceListeners();
        }

        /// <summary>
        /// This is the main entry point for your service instance.
        /// </summary>
        /// <param name="cancellationToken">Canceled when Service Fabric needs to shut down this service instance.</param>
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            // TODO: Replace the following sample code with your own logic 
            //       or remove this RunAsync override if it's not needed in your service.

            long iterations = 0;

            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();

                ServiceEventSource.Current.ServiceMessage(this.Context, "Working-{0}", ++iterations);

                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }
    }
}
