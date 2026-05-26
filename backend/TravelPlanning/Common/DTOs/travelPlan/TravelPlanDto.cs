using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs.travelPlan
{
    public class TravelPlanDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double PlannedBudget { get; set; }
        public string GeneralNotes { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<DestinationDto> Destinations { get; set; } = new List<DestinationDto>();
    }
}
