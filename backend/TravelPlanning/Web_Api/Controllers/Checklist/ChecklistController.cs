using Common.DTOs.checklist;
using Common.Helpers;
using Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace Web_Api.Controllers.Checklist
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ChecklistController : ControllerBase
    {
        private readonly IChecklistService _checklistService;

        public ChecklistController()
        {
            _checklistService = ServiceProxy.Create<IChecklistService>(new Uri("fabric:/TravelPlanning/ChecklistService"));
        }

        [HttpPost]
        public async Task<IActionResult> AddItem([FromBody] AddChecklistItemDto dto)
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty)
                return Unauthorized(new { Message = "Invalid token." });

            var result = await _checklistService.AddItemAsync(userId, dto);
            return result.IsSuccess 
                ? Ok(result.Data)
                : BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpGet("plan/{planId}")]
        public async Task<IActionResult> GetByPlan(Guid planId)
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty) return Unauthorized(new { Message = "Invalid token." });

            var result = await _checklistService.GetByPlanAsync(planId, userId);
            return result.IsSuccess 
                ? Ok(result.Data) 
                : BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpPut("{itemId}")]
        public async Task<IActionResult> UpdateItem(Guid itemId, [FromBody] UpdateChecklistItemDto dto)
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty) return Unauthorized(new { Message = "Invalid token." });

            var result = await _checklistService.UpdateItemAsync(itemId, userId, dto);
            return result.IsSuccess 
                ? Ok(new { Message = "Item updated successfully." }) 
                : BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpPatch("{itemId}/toggle")]
        public async Task<IActionResult> ToggleItem(Guid itemId)
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty) return Unauthorized(new { Message = "Invalid token." });

            var result = await _checklistService.ToggleItemAsync(itemId, userId);
            return result.IsSuccess 
                ? Ok(result.Data) 
                : BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpDelete("{itemId}")]
        public async Task<IActionResult> DeleteItem(Guid itemId)
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty) return Unauthorized(new { Message = "Invalid token." });

            var result = await _checklistService.DeleteItemAsync(itemId, userId);
            return result.IsSuccess 
                ? Ok(new { Message = "Item deleted successfully." }) 
                : BadRequest(new { Message = result.ErrorMessage });
        }
    }
}
