using Common.DTOs.checklist;
using Common.Models;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface IChecklistService : IService
    {
        Task<Result<ChecklistItemDto>> AddItemAsync(Guid userId, AddChecklistItemDto dto, string role);
        Task<Result<List<ChecklistItemDto>>> GetByPlanAsync(Guid planId, Guid userId, string role);
        Task<Result<bool>> UpdateItemAsync(Guid itemId, Guid userId, UpdateChecklistItemDto dto, string role);
        Task<Result<bool>> DeleteItemAsync(Guid itemId, Guid userId, string role);
        Task<Result<ChecklistItemDto>> ToggleItemAsync(Guid itemId, Guid userId, string role);
        Task<Result<bool>> DeleteByPlanAsync(Guid planId); // kaskadno brisanje
    }
}
