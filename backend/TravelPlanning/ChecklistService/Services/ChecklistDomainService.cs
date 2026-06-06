using ChecklistService.Interfaces;
using ChecklistService.Mappers;
using ChecklistService.Models;
using Common.DTOs.checklist;
using Common.Interfaces;
using Common.Models;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace ChecklistService.Services
{
    public class ChecklistDomainService : IChecklistDomainService
    {
        private readonly IChecklistRepository _repository;
        private readonly ITravelPlanGateway _travelPlanGateway;

        public ChecklistDomainService(IChecklistRepository repository, ITravelPlanGateway travelPlanGateway)
        {
            _repository = repository;
            _travelPlanGateway = travelPlanGateway;
        }

        public async Task<Result<ChecklistItemDto>> AddItemAsync(Guid userId, AddChecklistItemDto dto)
        {
            var planResult = await _travelPlanGateway.GetPlanAsync(dto.PlanId, userId);
            if (!planResult.IsSuccess)
                return Result<ChecklistItemDto>.Failure(planResult.ErrorMessage);

            var item = new ChecklistItem(
                Guid.NewGuid(),
                dto.PlanId,
                dto.Title,
                false);

            var created = await _repository.AddAsync(item);
            return Result<ChecklistItemDto>.Success(ChecklistMapper.ToDto(created));
        }

        public async Task<Result<bool>> DeleteByPlanAsync(Guid planId)
        {
            //ne mora da se proveri autorizacija jer ovo poziva sistem kad se brise putovanje
            var success = await _repository.DeleteByPlanIdAsync(planId);

            return success
                ? Result<bool>.Success(true)
                : Result<bool>.Failure("Failed to delete checklist items for the given plan.");
        }

        public async Task<Result<bool>> DeleteItemAsync(Guid itemId, Guid userId)
        {
            var item = await _repository.GetByIdAsync(itemId);
            if (item == null)
                return Result<bool>.Failure("Checklist item not found.");

            var planResult = await _travelPlanGateway.GetPlanAsync(item.PlanId, userId);
            if (!planResult.IsSuccess)
                return Result<bool>.Failure(planResult.ErrorMessage);

            var success = await _repository.DeleteAsync(itemId);
            return success
               ? Result<bool>.Success(true)
               : Result<bool>.Failure("Failed to delete checklist item.");

        }

        public async Task<Result<List<ChecklistItemDto>>> GetByPlanAsync(Guid planId, Guid userId)
        {
            var planResult = await _travelPlanGateway.GetPlanAsync(planId, userId);
            if (!planResult.IsSuccess)
                return Result<List<ChecklistItemDto>>.Failure(planResult.ErrorMessage);

            var items = await _repository.GetByPlanIdAsync(planId);
            var dtos = items.Select(i => ChecklistMapper.ToDto(i)).ToList();
            return Result<List<ChecklistItemDto>>.Success(dtos);

        }

        public async Task<Result<ChecklistItemDto>> ToggleItemAsync(Guid itemId, Guid userId)
        {
            var item = await _repository.GetByIdAsync(itemId);
            if (item == null)
                return Result<ChecklistItemDto>.Failure("Checklist item not found.");

            var planResult = await _travelPlanGateway.GetPlanAsync(item.PlanId, userId);
            if (!planResult.IsSuccess)
                return Result<ChecklistItemDto>.Failure(planResult.ErrorMessage);

            await _repository.ToggleAsync(itemId);

            var updated = await _repository.GetByIdAsync(itemId);
            return Result<ChecklistItemDto>.Success(ChecklistMapper.ToDto(updated));
        }

        public async Task<Result<bool>> UpdateItemAsync(Guid itemId, Guid userId, UpdateChecklistItemDto dto)
        {
            var item = await _repository.GetByIdAsync(itemId);
            if (item == null)
                return Result<bool>.Failure("Checklist item not found.");

            var planResult = await _travelPlanGateway.GetPlanAsync(item.PlanId, userId);
            if (!planResult.IsSuccess)
                return Result<bool>.Failure(planResult.ErrorMessage);

            item.Title = dto.Title;
            item.IsCompleted = dto.IsCompleted;

            var success = await _repository.UpdateAsync(item);
            return success
                ? Result<bool>.Success(true)
                : Result<bool>.Failure("Failed to update checklist item.");

        }
    }
}
