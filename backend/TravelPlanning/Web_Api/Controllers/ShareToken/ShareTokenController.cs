using Common.DTOs.travelPlan;
using Common.Helpers;
using Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace Web_Api.Controllers.ShareToken
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShareTokenController : ControllerBase
    {
        private readonly ITravelPlanService _travelPlanService;

        public ShareTokenController()
        {
            _travelPlanService = ServiceProxy.Create<ITravelPlanService>(new Uri("fabric:/TravelPlanning/TravelPlanService"));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateShareToken([FromBody] CreateShareTokenDto dto, [FromQuery] string? email)
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            // Ako je prosleđen email, pozivamo novu metodu
            if (!string.IsNullOrEmpty(email))
            {
                var result = await _travelPlanService.CreateAndSendShareTokenAsync(userId, dto, email);
                return result.IsSuccess ? Ok(result.Data) : BadRequest(new { Message = result.ErrorMessage });
            }

            // Inače pozivamo staru metodu
            var defaultResult = await _travelPlanService.CreateShareTokenAsync(userId, dto);
            return defaultResult.IsSuccess ? Ok(defaultResult.Data) : BadRequest(new { Message = defaultResult.ErrorMessage });
        }

        // ovaj endpoint je bez Authorize — pristupa mu i osoba sa QR kodom
        [HttpGet("{token}")]
        public async Task<IActionResult> GetPlanByToken(string token)
        {
            var result = await _travelPlanService.GetPlanByShareTokenAsync(token);
            if (result.IsSuccess)
                return Ok(result.Data);

            return NotFound(new { Message = result.ErrorMessage });
        }
    }
}
