using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPlanService.Models
{
    public class Destination
    {
        public Destination()
        {
        }

        public Destination(Guid id, Guid travelPlanId, string name, string location, DateTime arrivalDate, DateTime departureDate, string description) : this()
        {
            Id = id;
            TravelPlanId = travelPlanId;
            Name = name;
            Location = location;
            ArrivalDate = arrivalDate;
            DepartureDate = departureDate;
            Description = description;
        }

        public Guid Id { get; set; }
        public Guid TravelPlanId { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public DateTime ArrivalDate {  get; set; }
        public DateTime DepartureDate { get; set; }
        public string Description { get; set; }
        public List<Activity> Activities { get; set; } = new List<Activity>();
    }
}
