using Common.DTOs.travelPlan;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelPlanService.Models;

namespace TravelPlanService.Mappers
{
    public class ActivityMapper
    {
        public static ActivityDto ToDto(Activity activity)
        {
            return new ActivityDto
            {
                Id = activity.Id,
                DestinationId = activity.DestinationId,
                Title = activity.Title,
                Location = activity.Location,
                Description = activity.Description,
                EstimatedCost = activity.EstimatedCost,
                Date = activity.Date,
                Time = activity.Time,
                Status = activity.Status,
                Category = activity.Category
            };
        }
    }
}
