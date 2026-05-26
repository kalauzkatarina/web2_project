
using Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs.travelPlan
{
    public class ShareTokenDto
    {
        public string Token { get; set; }
        public string ShareUrl { get; set; }
        public AccessType AccessType { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }
}
