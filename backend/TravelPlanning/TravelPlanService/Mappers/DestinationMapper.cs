using Common.DTOs.travelPlan;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelPlanService.Models;

namespace TravelPlanService.Mappers
{
    public class DestinationMapper
    {
        public static DestinationDto ToDto(Destination destination)
        {
            return new DestinationDto
            {
                Id = destination.Id,
                TravelPlanId = destination.TravelPlanId,
                Name = destination.Name,
                Location = destination.Location,
                ArrivalDate = destination.ArrivalDate,
                DepartureDate = destination.DepartureDate,
                Description = destination.Description,
                Activities = destination.Activities?
                .Select(a => ActivityMapper.ToDto(a))
                .ToList() ?? new List<ActivityDto>()
            }; 
        }
    }
}
