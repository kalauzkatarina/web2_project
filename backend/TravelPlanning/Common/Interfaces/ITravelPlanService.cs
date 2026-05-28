using Common.DTOs.travelPlan;
using Common.Models;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface ITravelPlanService : IService
    {
        //Travel plans
        Task<Result<TravelPlanDto>> CreatePlanAsync(Guid userId, CreateTravelPlanDto dto);
        Task<Result<List<TravelPlanDto>>> GetAllPlansByUserAsync(Guid userId);
        Task<Result<TravelPlanDto>> GetPlanByIdAsync(Guid planId, Guid userId);
        Task<Result<bool>> UpdatePlanAsync(Guid planId, Guid userId, UpdateTravelPlanDto dto);
        Task<Result<bool>> DeletePlanAsync(Guid planId, Guid userId);

        //Destinations
        Task<Result<DestinationDto>> AddDestinationAsync(Guid userId, AddDestinationDto dto);
        Task<Result<List<DestinationDto>>> GetDestinationsByPlanAsync(Guid planId, Guid userId);
        Task<Result<bool>> UpdateDestinationAsync(Guid destinationId, Guid userId, UpdateDestionationDto dto);
        Task<Result<bool>> DeleteDestinationAsync(Guid destinationId, Guid userId);

        //Activities
        Task<Result<ActivityDto>> AddActivityAsync(Guid userId, AddActivityDto dto);
        Task<Result<List<ActivityDto>>> GetActivitiesByDestinationAsync(Guid destinationId, Guid userId);
        Task<Result<List<ActivityDto>>> GetActivitiesByDateAsync(Guid planId, Guid userId, DateTime date);
        Task<Result<bool>> UpdateActivityAsync(Guid activityId, Guid userId, UpdateActivityDto dto);
        Task<Result<bool>> DeleteActivityAsync(Guid activityId, Guid userId);

        //Share tokens
        Task<Result<ShareTokenDto>> CreateShareTokenAsync(Guid userId, CreateShareTokenDto dto);
        Task<Result<TravelPlanDto>> GetPlanByShareTokenAsync(string token);
    }
}
