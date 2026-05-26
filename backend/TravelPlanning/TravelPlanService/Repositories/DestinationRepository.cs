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
    public class DestinationRepository : IDestinationRepository
    {
        private readonly TravelDbContext _context;

        public DestinationRepository(TravelDbContext context)
        {
            _context = context;
        }

        public async Task<Destination> AddAsync(Destination destination)
        {
            await _context.Destinations.AddAsync(destination);
            await _context.SaveChangesAsync();
            return destination;
        }

        public async Task<bool> DeleteAsync(Guid destinationId)
        {
            var destination = await _context.Destinations.FindAsync(destinationId);
            if (destination == null) return false;

            _context.Destinations.Remove(destination);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<Destination?> GetByIdAsync(Guid destinationId)
        {
            return await _context.Destinations
                .Include(d => d.Activities)
                .FirstOrDefaultAsync(d => d.Id == destinationId);
        }

        public async Task<List<Destination>?> GetByPlanIdAsync(Guid planId)
        {
            return await _context.Destinations
                .Where(d => d.TravelPlanId == planId)
                .Include(d => d.Activities) //ucitaj i sve aktivnosti vezane za tu destinaciju
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(Destination destination)
        {
            _context.Destinations.Update(destination); //markira sve properties kao izmenjene sql update
            var result = await _context.SaveChangesAsync(); //vraca broj izmenjenih redova u bazi
            return result > 0; //ako je bar jedan red izmenjen, vraca true
        }
    }
}
