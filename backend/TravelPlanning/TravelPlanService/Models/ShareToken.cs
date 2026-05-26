using Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPlanService.Models
{
    public class ShareToken
    {
        public Guid Id { get; set; }
        public Guid PlanId { get; set; }
        public string Token { get; set; }
        public AccessType AccessType { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? ExpiresAt { get; set; }
    }
}
