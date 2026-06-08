using Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MailingService.Models
{
    public class SharePlanEmail
    {
        public string ToEmail { get; set; }
        public string PlanTitle { get; set; }
        public string ShareUrl { get; set; }
        public AccessType AccessType { get; set; } 
        public DateTime? ExpiresAt { get; set; }
    }
}
