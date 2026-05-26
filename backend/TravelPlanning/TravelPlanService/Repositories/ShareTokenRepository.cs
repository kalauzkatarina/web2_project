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
    public class ShareTokenRepository : IShareTokenRepository
    {
        private readonly TravelDbContext _context;
        public ShareTokenRepository(TravelDbContext context)
        {
            _context = context;
        }
        public async Task<ShareToken> CreateAsync(ShareToken shareToken)
        {
            await _context.ShareTokens.AddAsync(shareToken);
            await _context.SaveChangesAsync();
            return shareToken;
        }

        public async Task<ShareToken?> GetByTokenAsync(string token)
        {
            return await _context.ShareTokens
                .FirstOrDefaultAsync(st => st.Token == token);
        }
    }
}
