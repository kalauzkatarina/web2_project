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
    public class ActivityRepository : IActivityRepository
    {
        private readonly TravelDbContext _context;

        public ActivityRepository(TravelDbContext context)
        {
            _context = context;
        }
        public async Task<Activity> AddAsync(Activity activity)
        {
            await _context.Activities.AddAsync(activity);
            await _context.SaveChangesAsync();
            return activity;
        }

        public async Task<bool> DeleteAsync(Guid activityId)
        {
            var activity = await _context.Activities.FindAsync(activityId);
            if (activity == null) return false;

            _context.Activities.Remove(activity);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<List<Activity>> GetByDateAsync(Guid planId, DateTime date)
        {
            return await _context.Activities
                .Where(a => _context.Destinations
                .Any(d => d.Id == a.DestinationId && d.TravelPlanId == planId)
                && a.Date.Date == date.Date)
                .OrderBy(a => a.Time)
                .ToListAsync();
        }

        public Task<List<Activity>> GetByDestinationIdAsync(Guid destinationId)
        {
            return _context.Activities
                .Where(a => a.DestinationId == destinationId)
                .OrderBy(a => a.Date).ThenBy(a => a.Time)
                .ToListAsync();
        }

        public async Task<Activity?> GetByIdAsync(Guid activityId)
        {
            return await _context.Activities
                .FirstOrDefaultAsync(a => a.Id == activityId);
        }

        public async Task<List<Activity>> GetByPlanIdAsync(Guid planId)
        {
            return await _context.Activities
                .Where(a => _context.Destinations
                .Any(d => d.Id == a.DestinationId && d.TravelPlanId == planId))
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(Activity activity)
        {
            _context.Activities.Update(activity);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}
