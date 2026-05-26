using Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs.travelPlan
{
    public class CreateShareTokenDto
    {
        public Guid PlanId { get; set; }
        public AccessType AccessType { get; set; }
        public int? DaysValid { get; set; }
    }
}
