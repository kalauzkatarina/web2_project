using Common.DTOs.travelPlan;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelPlanService.Models;

namespace TravelPlanService.Mappers
{
    public class ShareTokenMapper
    {
        public static ShareTokenDto ToDto(ShareToken shareToken, string baseUrl = "")
        {
            return new ShareTokenDto
            {
                Token = shareToken.Token,
                ShareUrl = $"{baseUrl}/shared/{shareToken.Token}",
                AccessType = shareToken.AccessType,
                ExpiresAt = shareToken.ExpiresAt
            };
        }
    }
}
