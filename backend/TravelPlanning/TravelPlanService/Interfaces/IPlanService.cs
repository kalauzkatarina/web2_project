using Common.DTOs.travelPlan;
using Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPlanService.Interfaces
{
    public interface IPlanService
    {
        Task<Result<TravelPlanDto>> CreateAsync(Guid userId, CreateTravelPlanDto dto);
        Task<Result<List<TravelPlanDto>>> GetAllByUserAsync(Guid userId);
        Task<Result<List<TravelPlanDto>>> GetAllAsync(string role);
        Task<Result<TravelPlanDto>> GetByIdAsync(Guid planId, Guid userId, string role);
        Task<Result<bool>> UpdateAsync(Guid planId, Guid userId, UpdateTravelPlanDto dto, string role);
        Task<Result<bool>> DeleteAsync(Guid planId, Guid userId, string role);
    }
}
