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
    public class DestinationService : IDestinationService
    {
        private readonly IDestinationRepository _destinationRepository;
        private readonly IPlanRepository _travelPlanRepository;

        public DestinationService(IDestinationRepository destinationRepository, IPlanRepository travelPlanRepository)
        {
            _destinationRepository = destinationRepository;
            _travelPlanRepository = travelPlanRepository;
        }

        public async Task<Result<DestinationDto>> AddAsync(Guid userId, AddDestinationDto dto)
        {
            var plan = await _travelPlanRepository.GetByIdAsync(dto.TravelPlanId);
            if (plan == null)
                return Result<DestinationDto>.Failure("Travel plan not found.");

            if (plan == null || plan.UserId != userId)
                return Result<DestinationDto>.Failure("Cannot add destination to a plan that is not yours.");

            if (dto.DepartureDate < dto.ArrivalDate)
                return Result<DestinationDto>.Failure("Departure date cannot be before arrival date.");

            var destination = new Destination(
                Guid.NewGuid(),
                dto.TravelPlanId,
                dto.Name,
                dto.Location,
                dto.ArrivalDate,
                dto.DepartureDate,
                dto.Description);

            var created = await _destinationRepository.AddAsync(destination);
            return Result<DestinationDto>.Success(DestinationMapper.ToDto(created));
        }

        public async Task<Result<bool>> DeleteAsync(Guid destinationId, Guid userId)
        {
            var destination = await _destinationRepository.GetByIdAsync(destinationId);
            if (destination == null)
                return Result<bool>.Failure("Destination not found.");

            var plan = await _travelPlanRepository.GetByIdAsync(destination.TravelPlanId);
            if (plan == null || plan.UserId != userId)
                return Result<bool>.Failure("You are not authorized to delete this destination.");

            var success = await _destinationRepository.DeleteAsync(destinationId);
            return success
                ? Result<bool>.Success(true)
                : Result<bool>.Failure("Failed to delete destination.");
        }

        public async Task<Result<List<DestinationDto>>> GetByPlanAsync(Guid planId, Guid userId)
        {
            var plan = await _travelPlanRepository.GetByIdAsync(planId);

            if (plan == null || plan.UserId != userId)
                return Result<List<DestinationDto>>.Failure("You are not authorized to view these destinations.");

            var destinations = await _destinationRepository.GetByPlanIdAsync(planId);
            var dtos = destinations.Select(d => DestinationMapper.ToDto(d)).ToList();
            return Result<List<DestinationDto>>.Success(dtos);
        }

        public async Task<Result<bool>> UpdateAsync(Guid destinationId, Guid userId, UpdateDestionationDto dto)
        {
            var destination = await _destinationRepository.GetByIdAsync(destinationId);
            if (destination == null)
                return Result<bool>.Failure("Destination not found.");

            var plan = await _travelPlanRepository.GetByIdAsync(destination.TravelPlanId);
            if (plan == null || plan.UserId != userId)
                return Result<bool>.Failure("You are not authorized to delete this destination.");

            if (dto.DepartureDate < dto.ArrivalDate)
                return Result<bool>.Failure("Departure date cannot be before arrival date.");

            destination.Name = dto.Name;
            destination.Location = dto.Location;
            destination.ArrivalDate = dto.ArrivalDate;
            destination.DepartureDate = dto.DepartureDate;
            destination.Description = dto.Description;

            var success = await _destinationRepository.UpdateAsync(destination);
            return success
                ? Result<bool>.Success(true)
                : Result<bool>.Failure("Failed to update destination.");
        }
    }
}
