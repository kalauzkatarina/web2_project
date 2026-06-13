using Common.DTOs.travelPlan;
using Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPlanService.Interfaces
{
    public interface IShareTokenService
    {
        Task<Result<ShareTokenDto>> CreateAsync(Guid userId, CreateShareTokenDto dto, string frontendUrl);
        Task<Result<ShareTokenDto>> CreateAndSendAsync(Guid userId, CreateShareTokenDto dto, string toEmail, string frontendUrl);
        Task<Result<SharedTravelPlanDto>> GetPlanByTokenAsync(string token);
    }
}
