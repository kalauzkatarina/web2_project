using Common.DTOs.travelPlan;
using Common.Helpers;
using Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace Web_Api.Controllers.Plan
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TravelPlanController : ControllerBase
    {
        private readonly ITravelPlanService _travelPlanService;

        public TravelPlanController()
        {
            _travelPlanService = ServiceProxy.Create<ITravelPlanService>(new Uri("fabric:/TravelPlanning/TravelPlanService"));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTravelPlanDto dto)
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var result = await _travelPlanService.CreatePlanAsync(userId, dto);
            return result.IsSuccess ? Ok(result.Data) : BadRequest(result.ErrorMessage);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPlans()
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var result = await _travelPlanService.GetAllPlansByUserAsync(userId);
            if(result.IsSuccess)
                return Ok(result.Data);

            return BadRequest(new {Message = result.ErrorMessage});
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllPlansAdmin()
        {
            var role = ClaimsPrincipalHelper.GetUserRole(User);
            var result = await _travelPlanService.GetAllAsync(role);

            if (result.IsSuccess) return Ok(result.Data);
            return BadRequest(new { Message = result.ErrorMessage });
        }


        [HttpGet("{planId}")]
        public async Task<IActionResult> GetPlanById(string planId)
        {
            if (!Guid.TryParse(planId, out Guid outId))
                return BadRequest(new { Message = "Invalid ID format." });

            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var role = ClaimsPrincipalHelper.GetUserRole(User);

            var result = await _travelPlanService.GetPlanByIdAsync(outId, userId, role);
            if(result.IsSuccess)
                return Ok(result.Data);

            return NotFound(new { Message = result.ErrorMessage });
        }

        [HttpPut("{planId}")]
        public async Task<IActionResult> UpdatePlan(string planId, [FromBody] UpdateTravelPlanDto dto)
        {
            if (!Guid.TryParse(planId, out Guid outId))
                return BadRequest(new { Message = "Invalid ID format." });

            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var role = ClaimsPrincipalHelper.GetUserRole(User);

            var result = await _travelPlanService.UpdatePlanAsync(outId, userId, dto, role);
            if (result.IsSuccess)
                return Ok(new { Message = "Travel plan updated successfully." });

            return BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpDelete("{planId}")]
        public async Task<IActionResult> DeletePlan(string planId)
        {
            if (!Guid.TryParse(planId, out Guid outId))
                return BadRequest(new { Message = "Invalid ID format." });

            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var role = ClaimsPrincipalHelper.GetUserRole(User);

            var result = await _travelPlanService.DeletePlanAsync(outId, userId, role);
            if (result.IsSuccess)
                return Ok(new { Message = "Travel plan deleted successfully." });

            return NotFound(new {Message = result.ErrorMessage});
        }
    }
}
