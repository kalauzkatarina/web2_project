using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelPlanService.Context;
using TravelPlanService.Interfaces;
using TravelPlanService.Models;

namespace TravelPlanService.Repositories
{
    public class PlanRepository : IPlanRepository
    {
        private readonly TravelDbContext _context;
        public PlanRepository(TravelDbContext context)
        {
            _context = context;
        }

        public async Task<TravelPlan> CreateAsync(TravelPlan travelPlan)
        {
            await _context.TravelPlans.AddAsync(travelPlan);
            await _context.SaveChangesAsync();
            return travelPlan;
        }

        public async Task<bool> DeleteAsync(Guid planId)
        {
            var plan = await _context.TravelPlans.FindAsync(planId);
            if (plan == null) return false;

            _context.TravelPlans.Remove(plan);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<List<TravelPlan>> GetAllByUserIdAsync(Guid userId)
        {
            return await _context.TravelPlans
                .Where(tp => tp.UserId == userId)
                .Include(tp => tp.Destinations)          
                    .ThenInclude(d => d.Activities)
                .ToListAsync();
        }

        public async Task<List<TravelPlan>> GetAllAsync()
        {
            return await _context.TravelPlans
                .Include(tp => tp.Destinations)
                    .ThenInclude(d => d.Activities)
                .ToListAsync();
        }

        public async Task<TravelPlan?> GetByIdAsync(Guid planId)
        {
            return await _context.TravelPlans
                .Include(tp => tp.Destinations)
                    .ThenInclude(d => d.Activities)
                .FirstOrDefaultAsync(tp => tp.Id == planId);
        }
        //znak pitanja da se ne zeleni null reference, znaci moze da vrati null
        public async Task<TravelPlan?> GetByShareTokenAsync(string token)
        {
            var shareToken = await _context.ShareTokens
                .FirstOrDefaultAsync(st => st.Token == token && (st.ExpiresAt == null || st.ExpiresAt > DateTime.Now));

            if (shareToken == null) return null;

            return await GetByIdAsync(shareToken.PlanId);
        }

        public async Task<bool> UpdateAsync(TravelPlan plan)
        {
            _context.TravelPlans.Update(plan);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}
