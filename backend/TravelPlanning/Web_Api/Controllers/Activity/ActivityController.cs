using Common.DTOs.travelPlan;
using Common.Helpers;
using Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace Web_Api.Controllers.Activity
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ActivityController : ControllerBase
    {
        private readonly ITravelPlanService _travelPlanService;

        public ActivityController()
        {
            _travelPlanService = ServiceProxy.Create<ITravelPlanService>(new Uri("fabric:/TravelPlanning/TravelPlanService"));
        }

        [HttpPost]
        public async Task<IActionResult> AddActivity([FromBody] AddActivityDto dto)
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var result = await _travelPlanService.AddActivityAsync(userId, dto);
            if (result.IsSuccess)
                return Ok(result.Data);

            return BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpGet("destination/{destinationId}")]
        public async Task<IActionResult> GetByDestination(string destinationId)
        {
            if (!Guid.TryParse(destinationId, out Guid id))
                return BadRequest(new { Message = "Invalid ID format." });

            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var result = await _travelPlanService.GetActivitiesByDestinationAsync(id, userId);
            if (result.IsSuccess)
                return Ok(result.Data);

            return BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpGet("plan/{planId}/date/{date}")]
        public async Task<IActionResult> GetByDate(string planId, DateTime date)
        {
            if (!Guid.TryParse(planId, out Guid id))
                return BadRequest(new { Message = "Invalid ID format." });

            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var result = await _travelPlanService.GetActivitiesByDateAsync(id, userId, date);
            if (result.IsSuccess)
                return Ok(result.Data);

            return BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            if (!Guid.TryParse(id, out Guid activityId))
                return BadRequest(new { Message = "Invalid ID format." });

            var userId = ClaimsPrincipalHelper.GetUserId(User);

            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var result = await _travelPlanService.GetActivityByIdAsync(activityId, userId);

            if (result.IsSuccess)
                return Ok(result.Data);

            return NotFound(new { Message = result.ErrorMessage });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActivity(string id, [FromBody] UpdateActivityDto dto)
        {
            if (!Guid.TryParse(id, out Guid activityId))
                return BadRequest(new { Message = "Invalid ID format." });

            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var result = await _travelPlanService.UpdateActivityAsync(activityId, userId, dto);
            if (result.IsSuccess)
                return Ok(new { Message = "Activity updated successfully." });

            return BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(string id)
        {
            if (!Guid.TryParse(id, out Guid activityId))
                return BadRequest(new { Message = "Invalid ID format." });

            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var result = await _travelPlanService.DeleteActivityAsync(activityId, userId);
            if (result.IsSuccess)
                return Ok(new { Message = "Activity deleted successfully." });

            return NotFound(new { Message = result.ErrorMessage });
        }
    }
}
