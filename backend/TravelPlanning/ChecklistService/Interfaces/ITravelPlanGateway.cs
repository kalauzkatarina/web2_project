using Common.DTOs.travelPlan;
using Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChecklistService.Interfaces
{
    public interface ITravelPlanGateway
    {
        Task<Result<TravelPlanDto>> GetPlanAsync(Guid planId, Guid userId);
    }
}
