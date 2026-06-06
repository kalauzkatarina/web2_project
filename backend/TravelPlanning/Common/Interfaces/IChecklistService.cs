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
        Task<Result<ChecklistItemDto>> AddItemAsync(Guid userId, AddChecklistItemDto dto);
        Task<Result<List<ChecklistItemDto>>> GetByPlanAsync(Guid planId, Guid userId);
        Task<Result<bool>> UpdateItemAsync(Guid itemId, Guid userId, UpdateChecklistItemDto dto);
        Task<Result<bool>> DeleteItemAsync(Guid itemId, Guid userId);
        Task<Result<ChecklistItemDto>> ToggleItemAsync(Guid itemId, Guid userId);
        Task<Result<bool>> DeleteByPlanAsync(Guid planId); // kaskadno brisanje
    }
}
