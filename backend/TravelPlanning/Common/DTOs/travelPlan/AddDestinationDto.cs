using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs.travelPlan
{
    public class AddDestinationDto
    {
        public Guid TravelPlanId { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public DateTime ArrivalDate { get; set; }
        public DateTime DepartureDate { get; set; }
        public string Description { get; set; }
    }
}
