using Common.DTOs.travelPlan;
using Common.Helpers;
using Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System.Numerics;

namespace Web_Api.Controllers.Destination
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DestinationController : ControllerBase
    {
        private readonly ITravelPlanService _travelPlanService;

        public DestinationController()
        {
            _travelPlanService = ServiceProxy.Create<ITravelPlanService>(new Uri("fabric:/TravelPlanning/TravelPlanService"));
        }

        [HttpPost]
        public async Task<IActionResult> AddDestination([FromBody] AddDestinationDto dto)
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var result = await _travelPlanService.AddDestinationAsync(userId, dto);
            if(result.IsSuccess)
                return Ok(result.Data);

            return BadRequest(new {Message = result.ErrorMessage});
        }

        [HttpGet("plan/{planId}")]
        public async Task<IActionResult> GetByPlan(string planId)
        {
            if (!Guid.TryParse(planId, out Guid id))
                return BadRequest(new { Message = "Invalid ID format." });

            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var result = await _travelPlanService.GetDestinationsByPlanAsync(id, userId);
            if (result.IsSuccess)
                return Ok(result.Data);

            return BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            if (!Guid.TryParse(id, out Guid destinationId))
                return BadRequest(new { Message = "Invalid ID format." });

            var userId = ClaimsPrincipalHelper.GetUserId(User);

            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var result = await _travelPlanService.GetDestinationByIdAsync(destinationId, userId);

            if (result.IsSuccess)
                return Ok(result.Data);

            return BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDestination(string id, [FromBody] UpdateDestionationDto dto)
        {
            if (!Guid.TryParse(id, out Guid destinationId))
                return BadRequest(new { Message = "Invalid ID format." });

            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var result = await _travelPlanService.UpdateDestinationAsync(destinationId, userId, dto);
            if (result.IsSuccess)
                return Ok(new { Message = "Destination updated successfully." });

            return BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(string id)
        {
            if (!Guid.TryParse(id, out Guid destinationId))
                return BadRequest(new { Message = "Invalid ID format." });

            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var result = await _travelPlanService.DeleteDestinationAsync(destinationId, userId);
            if (result.IsSuccess)
                return Ok(new { Message = "Destination deleted successfully." });

            return BadRequest(new { Message = result.ErrorMessage });
        }
    }
}
