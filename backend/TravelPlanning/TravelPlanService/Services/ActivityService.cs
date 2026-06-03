using Common.DTOs.travelPlan;
using Common.Enums;
using Common.Interfaces;
using Common.Models;
using Microsoft.Extensions.Logging;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelPlanService.Interfaces;
using TravelPlanService.Mappers;
using TravelPlanService.Models;

namespace TravelPlanService.Services
{
    public class ActivityService : IActivityService
    {
        private readonly IActivityRepository _activityRepository;
        private readonly IDestinationRepository _destinationRepository;
        private readonly IPlanRepository _travelPlanRepository;

        public ActivityService(IActivityRepository activityRepository, IDestinationRepository destinationRepository, IPlanRepository travelPlanRepository)
        {
            _activityRepository = activityRepository;
            _destinationRepository = destinationRepository;
            _travelPlanRepository = travelPlanRepository;
        }

        #region HELPER methods

        private IFinanceService GetFinanceProxy()
        {
            return ServiceProxy.Create<IFinanceService>(
                new Uri("fabric:/TravelPlanning/FinanceService"),
                new ServicePartitionKey(0));
        }

        private async Task SyncWithFinance(Guid userId, Guid planId, Guid activityId, double amount, string title, string operation, ExpenseCategory category)
        {
            if (amount == 0) return;

            try
            {
                var proxy = GetFinanceProxy();
                await proxy.SyncActivityCostAsync(userId, planId, activityId, amount, title, operation, category);
            }
            catch (Exception ex)
            {
                //ne blokiramo tok radnje
            }
        }

        #endregion

        public async Task<Result<ActivityDto>> AddAsync(Guid userId, AddActivityDto dto)
        {
            var destination = await _destinationRepository.GetByIdAsync(dto.DestinationId);
            if (destination == null)
                return Result<ActivityDto>.Failure("Destination not found.");

            var plan = await _travelPlanRepository.GetByIdAsync(destination.TravelPlanId);
            if (plan == null || plan.UserId != userId)
                return Result<ActivityDto>.Failure("You are not authorized to add activities to this plan.");

            var acitvity = new Activity(
                Guid.NewGuid(),
                dto.DestinationId,
                dto.Title,
                dto.Location,
                dto.Description,
                dto.EstimatedCost,
                dto.Date,
                dto.Time,
                dto.Status,
                dto.Category);

            var created = await _activityRepository.AddAsync(acitvity);

            await SyncWithFinance(userId,plan.Id, created.Id, created.EstimatedCost, $"Activity: {created.Title}", "ADD", created.Category);

            return Result<ActivityDto>.Success(ActivityMapper.ToDto(created));
        }

        public async Task<Result<bool>> DeleteAsync(Guid activityId, Guid userId)
        {
            var activity = await _activityRepository.GetByIdAsync(activityId);
            if (activity == null)
                return Result<bool>.Failure("Activity not found.");

            var destination = await _destinationRepository.GetByIdAsync(activity.DestinationId);
            if(destination == null)
                return Result<bool>.Failure("Destination not found.");

            var plan = await _travelPlanRepository.GetByIdAsync(destination.TravelPlanId);
            if (plan == null || plan.UserId != userId)
                return Result<bool>.Failure("You are not authorized to delete this activity.");

            var success = await _activityRepository.DeleteAsync(activityId);

            if (success)
            {
                // We send negative cost to subtract it from the total budget
                await SyncWithFinance(userId, plan.Id, activity.Id, -activity.EstimatedCost, $"Delete: {activity.Title}", "DELETE", activity.Category);
            }

            return success
                ? Result<bool>.Success(true)
                : Result<bool>.Failure("Failed to delete activity.");
        }

        public async Task<Result<List<ActivityDto>>> GetByDateAsync(Guid planId, Guid userId, DateTime date)
        {
            var plan = await _travelPlanRepository.GetByIdAsync(planId);
            if (plan == null || plan.UserId != userId)
                return Result<List<ActivityDto>>.Failure("You are not authorized to view activities for this plan.");

            var activities = await _activityRepository.GetByDateAsync(planId, date);
            var dtos = activities.Select(a => ActivityMapper.ToDto(a)).ToList();
            return Result<List<ActivityDto>>.Success(dtos);
        }

        public async Task<Result<List<ActivityDto>>> GetByDestinationAsync(Guid destinationId, Guid userId)
        {
            var destination = await _destinationRepository.GetByIdAsync(destinationId);
            if (destination == null)
                return Result<List<ActivityDto>>.Failure("Destination not found.");

            var plan = await _travelPlanRepository.GetByIdAsync(destination.TravelPlanId);
            if (plan == null || plan.UserId != userId)
                return Result<List<ActivityDto>>.Failure("You are not authorized to view activities for this destination.");

            var activities = await _activityRepository.GetByDestinationIdAsync(destinationId);
            var dtos = activities.Select(a => ActivityMapper.ToDto(a)).ToList();
            return Result<List<ActivityDto>>.Success(dtos);
        }

        public async Task<Result<bool>> UpdateAsync(Guid activityId, Guid userId, UpdateActivityDto dto)
        {
            var activity = await _activityRepository.GetByIdAsync(activityId);
            if (activity == null)
                return Result<bool>.Failure("Activity not found.");

            var destination = await _destinationRepository.GetByIdAsync(activity.DestinationId);
            var plan = await _travelPlanRepository.GetByIdAsync(destination.TravelPlanId);
            if (plan == null || plan.UserId != userId)
                return Result<bool>.Failure("You are not authorized to delete this activity.");

            double oldCost = activity.EstimatedCost;

            activity.Title = dto.Title;
            activity.Location = dto.Location;
            activity.Description = dto.Description;
            activity.EstimatedCost = dto.EstimatedCost;
            activity.Date = dto.Date;
            activity.Time = dto.Time;
            activity.Status = dto.Status;
            activity.Category = dto.Category;

            var success = await _activityRepository.UpdateAsync(activity);

            if (success)
            {
                double amountDelta = activity.EstimatedCost - oldCost;
                await SyncWithFinance(userId ,plan.Id, activity.Id, activity.EstimatedCost, $"Update: {activity.Title}", "UPDATE", activity.Category);
            }

            return success
                ? Result<bool>.Success(true)
                : Result<bool>.Failure("Failed to update activity.");
        }
    }
}
