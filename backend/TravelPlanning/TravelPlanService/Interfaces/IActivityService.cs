using Common.DTOs.travelPlan;
using Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPlanService.Interfaces
{
    public interface IActivityService
    {
        Task<Result<ActivityDto>> AddAsync(Guid userId, AddActivityDto dto);
        Task<Result<List<ActivityDto>>> GetByDestinationAsync(Guid destinationId, Guid userId);
        Task<Result<List<ActivityDto>>> GetByDateAsync(Guid planId, Guid userId, DateTime date);
        Task<Result<bool>> UpdateAsync(Guid activityId, Guid userId, UpdateActivityDto dto);
        Task<Result<bool>> DeleteAsync(Guid activityId, Guid userId);
    }
}
