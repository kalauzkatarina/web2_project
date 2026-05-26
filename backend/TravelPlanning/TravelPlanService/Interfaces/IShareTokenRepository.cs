using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelPlanService.Models;

namespace TravelPlanService.Interfaces
{
    public interface IShareTokenRepository
    {
        Task<ShareToken> CreateAsync(ShareToken shareToken);
        Task<ShareToken?> GetByTokenAsync(string token);
    }
}
