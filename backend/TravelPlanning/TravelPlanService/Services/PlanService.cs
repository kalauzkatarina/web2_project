using Common.DTOs.travelPlan;
using Common.Models;
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
    public class PlanService : IPlanService
    {
        private readonly IPlanRepository _travelPlanRepository;

        public PlanService(IPlanRepository travelPlanRepository)
        {
            _travelPlanRepository = travelPlanRepository;
        }
        public async Task<Result<TravelPlanDto>> CreateAsync(Guid userId, CreateTravelPlanDto dto)
        {
            if (dto.EndDate < dto.StartDate)
                return Result<TravelPlanDto>.Failure("End date cannot be before start date");

            if (dto.PlannedBudget < 0)
                return Result<TravelPlanDto>.Failure("Budget cannot be negative.");

            var plan = new TravelPlan(
                Guid.NewGuid(),
                userId,
                dto.Title,
                dto.Description,
                dto.StartDate,
                dto.EndDate,
                dto.PlannedBudget,
                dto.GeneralNotes);
            
            var created = await _travelPlanRepository.CreateAsync(plan);

            return Result<TravelPlanDto>.Success(TravelPlanMapper.ToDto(created));
        }

        public async Task<Result<bool>> DeleteAsync(Guid planId, Guid userId, string role)
        {
            var plan = await _travelPlanRepository.GetByIdAsync(planId);
            if (plan == null)
                return Result<bool>.Failure("Travel plan not found.");

            if (plan.UserId != userId && role != "Admin")
                return Result<bool>.Failure("You are not authorized to update this plan.");

            var success = await _travelPlanRepository.DeleteAsync(planId);

            return success
                ? Result<bool>.Success(true)
                : Result<bool>.Failure("Failed to delete travel plan.");
        }

        public async Task<Result<List<TravelPlanDto>>> GetAllByUserAsync(Guid userId)
        {
            var plans = await _travelPlanRepository.GetAllByUserIdAsync(userId);
            var dtos = plans.Select(p => TravelPlanMapper.ToDto(p)).ToList(); 

            return Result<List<TravelPlanDto>>.Success(dtos);
        }

        public async Task<Result<List<TravelPlanDto>>> GetAllAsync(string role)
        {
            if (role != "Admin")
                return Result<List<TravelPlanDto>>.Failure("Access denied.");

            var plans = await _travelPlanRepository.GetAllAsync();
            return Result<List<TravelPlanDto>>.Success(plans.Select(p => TravelPlanMapper.ToDto(p)).ToList());
        }

        public async Task<Result<TravelPlanDto>> GetByIdAsync(Guid planId, Guid userId, string role)
        {
            var plan = await _travelPlanRepository.GetByIdAsync(planId);
            if (plan == null)
                return Result<TravelPlanDto>.Failure("Travel plan not found.");

            if (plan.UserId != userId && role != "Admin")
                return Result<TravelPlanDto>.Failure("You are not authorized to access this plan.");

            return Result<TravelPlanDto>.Success(TravelPlanMapper.ToDto(plan));
        }

        public async Task<Result<bool>> UpdateAsync(Guid planId, Guid userId, UpdateTravelPlanDto dto, string role)
        {
            var plan = await _travelPlanRepository.GetByIdAsync(planId);
            if (plan == null)
                return Result<bool>.Failure("Travel plan not found.");

            if (plan.UserId != userId && role != "Admin")
                return Result<bool>.Failure("You are not authorized to update this plan.");

            if (dto.EndDate < dto.StartDate)
                return Result<bool>.Failure("End date cannot be before start date");

            if (dto.PlannedBudget < 0)
                return Result<bool>.Failure("Budget cannot be negative.");

            plan.Title = dto.Title;
            plan.Description = dto.Description;
            plan.StartDate = dto.StartDate;
            plan.EndDate = dto.EndDate;
            plan.PlannedBudget = dto.PlannedBudget;
            plan.GeneralNotes = dto.GeneralNotes;

            var success = await _travelPlanRepository.UpdateAsync(plan);
            return success
                ? Result<bool>.Success(true)
                : Result<bool>.Failure("Failed to update travel plan.");
        }
    }
}
