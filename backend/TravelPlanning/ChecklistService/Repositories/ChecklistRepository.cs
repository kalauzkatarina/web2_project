using ChecklistService.Context;
using ChecklistService.Interfaces;
using ChecklistService.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChecklistService.Repositories
{
    public class ChecklistRepository : IChecklistRepository
    {
        private readonly ChecklistDbContext _context;

        public ChecklistRepository(ChecklistDbContext context)
        {
            _context = context;
        }

        public async Task<ChecklistItem> AddAsync(ChecklistItem item)
        {
            await _context.ChecklistItems.AddAsync(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<bool> DeleteAsync(Guid itemId)
        {
            var item = await _context.ChecklistItems.FindAsync(itemId);
            if(item == null) return false;

            _context.ChecklistItems.Remove(item);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> DeleteByPlanIdAsync(Guid planId)
        {
            var items = await _context.ChecklistItems
                .Where(c => c.PlanId == planId)
                .ToListAsync();
            if (!items.Any()) return true;
            _context.ChecklistItems.RemoveRange(items);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<ChecklistItem?> GetByIdAsync(Guid itemId)
        {
            return await _context.ChecklistItems
                .FirstOrDefaultAsync(c => c.Id == itemId);
        }

        public async Task<List<ChecklistItem>> GetByPlanIdAsync(Guid planId)
        {
            return await _context.ChecklistItems
                .Where(c => c.PlanId == planId)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> ToggleAsync(Guid itemId)
        {
            var item = await _context.ChecklistItems.FindAsync(itemId);
            if(item == null) return false;
            item.IsCompleted = !item.IsCompleted;
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> UpdateAsync(ChecklistItem item)
        {
            _context.ChecklistItems.Update(item);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}
