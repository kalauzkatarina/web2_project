using Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs.travelPlan
{
    public class SharedTravelPlanDto
    {
        public TravelPlanDto Plan { get; set; }
        public AccessType AccessType { get; set; }
    }
}
