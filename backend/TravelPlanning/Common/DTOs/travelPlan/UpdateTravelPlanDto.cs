using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs.travelPlan
{
    public class UpdateTravelPlanDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double PlannedBudget { get; set; }
        public string GeneralNotes { get; set; }
    }
}
