using Common.DTOs.finance;
using Common.Helpers;
using Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace Web_Api.Controllers.Finance
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FinanceController : ControllerBase
    {
        private readonly IFinanceService _financeService;

        public FinanceController()
        {
            _financeService = ServiceProxy.Create<IFinanceService>(
                new Uri("fabric:/TravelPlanning/FinanceService"),
                new ServicePartitionKey(0));
        }

        [HttpPost("expense")]
        public async Task<IActionResult> AddExpense([FromBody] AddExpenseDto dto)
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty) return Unauthorized();

            var result = await _financeService.AddExpenseAsync(dto, userId);

            return result.IsSuccess 
                ? Ok(result.Data) 
                : BadRequest(result.ErrorMessage);
        }

        [HttpGet("summary/{planId}")]
        public async Task<IActionResult> GetSummary(Guid planId)
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty) return Unauthorized();

            var result = await _financeService.GetBudgetSummaryAsync(planId, userId);

            return result.IsSuccess 
                ? Ok(result.Data) 
                : BadRequest(result.ErrorMessage);
        }

        [HttpGet("plan/{planId}")]
        public async Task<IActionResult> GetExpensesByPlan(Guid planId)
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty) return Unauthorized();

            var result = await _financeService.GetExpensesByPlanAsync(planId, userId);

            return result.IsSuccess 
                ? Ok(result.Data) 
                : BadRequest(result.ErrorMessage);
        }

        [HttpPut("expense/{expenseId}")]
        public async Task<IActionResult> UpdateExpense(Guid expenseId, [FromBody] UpdateExpenseDto dto)
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty) return Unauthorized();

            var result = await _financeService.UpdateExpenseAsync(expenseId, userId, dto);

            return result.IsSuccess 
                ? Ok(new { Message = "Expense updated successfully." }) 
                : BadRequest(result.ErrorMessage);
        }

        [HttpDelete("expense/{expenseId}")]
        public async Task<IActionResult> DeleteExpense(Guid expenseId)
        {
            var userId = ClaimsPrincipalHelper.GetUserId(User);
            if (userId == Guid.Empty) return Unauthorized();

            var result = await _financeService.DeleteExpenseAsync(expenseId, userId);

            return result.IsSuccess 
                ? Ok(new { Message = "Expense deleted successfully." }) 
                : BadRequest(result.ErrorMessage);
        }
    }
}
