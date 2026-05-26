using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelPlanService.Models;

namespace TravelPlanService.Interfaces
{
    public interface IActivityRepository
    {
        Task<Activity> AddAsync(Activity activity);
        Task<List<Activity>> GetByDestinationIdAsync(Guid destinationId);
        Task<List<Activity>> GetByDateAsync(Guid planId, DateTime date); //za calendar view
        Task<Activity?> GetByIdAsync(Guid activityId);
        Task<List<Activity>> GetByPlanIdAsync(Guid planId);
        Task<bool> UpdateAsync(Activity activity);
        Task<bool> DeleteAsync(Guid activityId);
    }
}
