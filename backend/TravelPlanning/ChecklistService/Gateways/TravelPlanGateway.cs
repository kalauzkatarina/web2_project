using ChecklistService.Interfaces;
using Common.DTOs.travelPlan;
using Common.Interfaces;
using Common.Models;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChecklistService.Gateways
{
    public class TravelPlanGateway : ITravelPlanGateway
    {
        public async Task<Result<TravelPlanDto>> GetPlanAsync(Guid planId, Guid userId, string role)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                        new Uri("fabric:/TravelPlanning/TravelPlanService"));

            return await proxy.GetPlanByIdAsync(planId, userId, role);
        }
    }
}
