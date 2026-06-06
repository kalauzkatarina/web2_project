using ChecklistService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChecklistService.Interfaces
{
    public interface IChecklistRepository
    {
        Task<ChecklistItem> AddAsync(ChecklistItem item);
        Task<ChecklistItem?> GetByIdAsync(Guid itemId);
        Task<List<ChecklistItem>> GetByPlanIdAsync(Guid planId);
        Task<bool> UpdateAsync(ChecklistItem item);
        Task<bool> DeleteAsync(Guid itemId);
        Task<bool> DeleteByPlanIdAsync(Guid planId); //za kaskadno brisanje (kad se plan obrise)
        Task<bool> ToggleAsync(Guid itemId); 
    }
}
