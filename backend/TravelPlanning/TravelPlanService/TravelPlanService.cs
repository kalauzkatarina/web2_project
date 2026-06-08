using Common.DTOs.travelPlan;
using Common.Interfaces;
using Common.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Numerics;
using System.Threading;
using System.Threading.Tasks;
using TravelPlanService.Context;
using TravelPlanService.Interfaces;
using TravelPlanService.Models;
using TravelPlanService.Repositories;
using TravelPlanService.Services;
using static System.Runtime.InteropServices.JavaScript.JSType;



namespace TravelPlanService
{
    /// <summary>
    /// An instance of this class is created for each service instance by the Service Fabric runtime.
    /// </summary>
    internal sealed class TravelPlanService : StatelessService, ITravelPlanService
    {
        private readonly ServiceProvider _serviceProvider;
        public TravelPlanService(StatelessServiceContext context)
            : base(context)
        {
            var config = context.CodePackageActivationContext
                .GetConfigurationPackageObject("Config").Settings;

            var sqlConn = config.Sections["DbConfig"]
                .Parameters["TravelDbConnectionString"].Value;

            var services = new ServiceCollection();

            services.AddDbContext<TravelDbContext>(options => options.UseSqlServer(sqlConn));
            services.AddScoped<IPlanRepository, PlanRepository>();
            services.AddScoped<IDestinationRepository, DestinationRepository>();
            services.AddScoped<IActivityRepository, ActivityRepository>();
            services.AddScoped<IShareTokenRepository, ShareTokenRepository>();
            services.AddScoped<IPlanService, PlanService>();
            services.AddScoped<IDestinationService, DestinationService>();
            services.AddScoped<IActivityService, ActivityService>();
            services.AddScoped<IShareTokenService, ShareTokenService>();

            _serviceProvider = services.BuildServiceProvider();
        }

        #region Travel Plans
        public async Task<Result<TravelPlanDto>> CreatePlanAsync(Guid userId, CreateTravelPlanDto dto)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var travelPlanService = scope.ServiceProvider.GetRequiredService<IPlanService>();
                return await travelPlanService.CreateAsync(userId, dto);
            }
        }

        public async Task<Result<List<TravelPlanDto>>> GetAllPlansByUserAsync(Guid userId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var travelPlanService = scope.ServiceProvider.GetRequiredService<IPlanService>();
                return await travelPlanService.GetAllByUserAsync(userId);
            }
        }

        public async Task<Result<TravelPlanDto>> GetPlanByIdAsync(Guid planId, Guid userId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var travelPlanService = scope.ServiceProvider.GetRequiredService<IPlanService>();
                return await travelPlanService.GetByIdAsync(planId, userId);
            }
        }

        public async Task<Result<bool>> UpdatePlanAsync(Guid planId, Guid userId, UpdateTravelPlanDto dto)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var travelPlanService = scope.ServiceProvider.GetRequiredService<IPlanService>();
                return await travelPlanService.UpdateAsync(planId, userId, dto);
            }
        }

        public async Task<Result<bool>> DeletePlanAsync(Guid planId, Guid userId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var travelPlanService = scope.ServiceProvider.GetRequiredService<IPlanService>();

                var result = await travelPlanService.DeleteAsync(planId, userId);

                if (result.IsSuccess)
                {
                    try
                    {
                        var checklistProxy = ServiceProxy.Create<IChecklistService>(
                            new Uri("fabric:/TravelPlanning/ChecklistService"));

                        await checklistProxy.DeleteByPlanAsync(planId);
                    }
                    catch (Exception ex)
                    {
                        //logovanje greske
                        ServiceEventSource.Current.ServiceMessage(this.Context,
                            "Greška pri kaskadnom brisanju checkliste za plan {0}: {1}", planId, ex.Message);
                    }
                }

                return result;
            }
        }

        #endregion

        #region Destinations

        public async Task<Result<DestinationDto>> AddDestinationAsync(Guid userId, AddDestinationDto dto)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var destinationService = scope.ServiceProvider.GetRequiredService<IDestinationService>();
                return await destinationService.AddAsync(userId, dto);
            }
        }

        public async Task<Result<List<DestinationDto>>> GetDestinationsByPlanAsync(Guid planId, Guid userId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var destinationService = scope.ServiceProvider.GetRequiredService<IDestinationService>();
                return await destinationService.GetByPlanAsync(planId, userId);
            }
        }

        public async Task<Result<bool>> UpdateDestinationAsync(Guid destinationId, Guid userId, UpdateDestionationDto dto)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var destinationService = scope.ServiceProvider.GetRequiredService<IDestinationService>();
                return await destinationService.UpdateAsync(destinationId, userId, dto);
            }
        }

        public async Task<Result<bool>> DeleteDestinationAsync(Guid destinationId, Guid userId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var destinationService = scope.ServiceProvider.GetRequiredService<IDestinationService>();
                return await destinationService.DeleteAsync(destinationId, userId);
            }
        }

        #endregion

        #region Activities
        public async Task<Result<ActivityDto>> AddActivityAsync(Guid userId, AddActivityDto dto)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var activityService = scope.ServiceProvider.GetRequiredService<IActivityService>();
                return await activityService.AddAsync(userId, dto);
            }
        }

        public async Task<Result<List<ActivityDto>>> GetActivitiesByDestinationAsync(Guid destinationId, Guid userId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var activityService = scope.ServiceProvider.GetRequiredService<IActivityService>();
                return await activityService.GetByDestinationAsync(destinationId, userId);
            }
        }

        public async Task<Result<List<ActivityDto>>> GetActivitiesByDateAsync(Guid planId, Guid userId, DateTime date)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var activityService = scope.ServiceProvider.GetRequiredService<IActivityService>();
                return await activityService.GetByDateAsync(planId, userId, date);
            }
        }

        public async Task<Result<bool>> UpdateActivityAsync(Guid activityId, Guid userId, UpdateActivityDto dto)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var activityService = scope.ServiceProvider.GetRequiredService<IActivityService>();
                return await activityService.UpdateAsync(activityId, userId, dto);
            }
        }

        public async Task<Result<bool>> DeleteActivityAsync(Guid activityId, Guid userId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var activityService = scope.ServiceProvider.GetRequiredService<IActivityService>();
                return await activityService.DeleteAsync(activityId, userId);
            }
        }

        #endregion

        #region Share Token

        public async Task<Result<ShareTokenDto>> CreateShareTokenAsync(Guid userId, CreateShareTokenDto dto)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var shareTokenService = scope.ServiceProvider.GetRequiredService<IShareTokenService>();
                return await shareTokenService.CreateAsync(userId, dto);
            }
        }

        public async Task<Result<ShareTokenDto>> CreateAndSendShareTokenAsync(Guid userId, CreateShareTokenDto dto, string toEmail)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var shareTokenService = scope.ServiceProvider.GetRequiredService<IShareTokenService>();

                return await shareTokenService.CreateAndSendAsync(userId, dto, toEmail);
            }
        }

        public async Task<Result<TravelPlanDto>> GetPlanByShareTokenAsync(string token)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var shareTokenService = scope.ServiceProvider.GetRequiredService<IShareTokenService>();
                return await shareTokenService.GetPlanByTokenAsync(token);
            }
        }

        #endregion

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
