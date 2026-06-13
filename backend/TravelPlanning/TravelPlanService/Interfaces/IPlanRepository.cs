using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelPlanService.Models;

namespace TravelPlanService.Interfaces
{
    public interface IPlanRepository
    {
        Task<TravelPlan> CreateAsync(TravelPlan travelPlan);
        Task<List<TravelPlan>> GetAllByUserIdAsync(Guid userId);
        Task<List<TravelPlan>> GetAllAsync();
        Task<TravelPlan?> GetByIdAsync(Guid planId);
        Task<TravelPlan?> GetByShareTokenAsync(string token);
        Task<bool> UpdateAsync(TravelPlan plan);
        Task<bool> DeleteAsync(Guid planId);
        Task<int> DeleteAllByUserIdAsync(Guid userId);
    }
}
