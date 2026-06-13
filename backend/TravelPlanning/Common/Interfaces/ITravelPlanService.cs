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
        Task<Result<List<TravelPlanDto>>> GetAllAsync(string role);
        Task<Result<TravelPlanDto>> GetPlanByIdAsync(Guid planId, Guid userId, string role);
        Task<Result<bool>> UpdatePlanAsync(Guid planId, Guid userId, UpdateTravelPlanDto dto, string role);
        Task<Result<bool>> DeletePlanAsync(Guid planId, Guid userId, string role);

        //Destinations
        Task<Result<DestinationDto>> AddDestinationAsync(Guid userId, AddDestinationDto dto);
        Task<Result<List<DestinationDto>>> GetDestinationsByPlanAsync(Guid planId, Guid userId);
        Task<Result<DestinationDto>> GetDestinationByIdAsync(Guid destinationId, Guid userId);
        Task<Result<bool>> UpdateDestinationAsync(Guid destinationId, Guid userId, UpdateDestionationDto dto, string role);
        Task<Result<bool>> DeleteDestinationAsync(Guid destinationId, Guid userId, string role);

        //Activities
        Task<Result<ActivityDto>> AddActivityAsync(Guid userId, AddActivityDto dto);
        Task<Result<List<ActivityDto>>> GetActivitiesByDestinationAsync(Guid destinationId, Guid userId);
        Task<Result<List<ActivityDto>>> GetActivitiesByDateAsync(Guid planId, Guid userId, DateTime date);
        Task<Result<ActivityDto>> GetActivityByIdAsync(Guid activityId, Guid userId);
        Task<Result<List<ActivityDto>>> GetActivitiesByPlanAsync(Guid planId, Guid userId);
        Task<Result<bool>> UpdateActivityAsync(Guid activityId, Guid userId, UpdateActivityDto dto, string role);
        Task<Result<bool>> DeleteActivityAsync(Guid activityId, Guid userId, string role);

        //Share tokens
        Task<Result<ShareTokenDto>> CreateShareTokenAsync(Guid userId, CreateShareTokenDto dto);
        Task<Result<ShareTokenDto>> CreateAndSendShareTokenAsync(Guid userId, CreateShareTokenDto dto, string toEmail);
        Task<Result<SharedTravelPlanDto>> GetPlanByShareTokenAsync(string token);
    }
}
