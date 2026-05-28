using Common.DTOs.travelPlan;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelPlanService.Models;

namespace TravelPlanService.Mappers
{
    public class TravelPlanMapper
    {
        public static TravelPlanDto ToDto(TravelPlan travelPlan)
        {
            return new TravelPlanDto
            {
                Id = travelPlan.Id,
                UserId = travelPlan.UserId,
                Title = travelPlan.Title,
                Description = travelPlan.Description,
                StartDate = travelPlan.StartDate,
                EndDate = travelPlan.EndDate,
                PlannedBudget = travelPlan.PlannedBudget,
                GeneralNotes = travelPlan.GeneralNotes,
                CreatedAt = travelPlan.CreatedAt,
                Destinations = travelPlan.Destinations?
                .Select(d => DestinationMapper.ToDto(d))
                .ToList() ?? new List<DestinationDto>()
            };
        }
    }
}
