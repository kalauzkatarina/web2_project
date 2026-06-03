using Common.DTOs.finance;
using Common.Enums;
using Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceService.Interfaces
{
    public interface IExpenseService
    {
        Task<Result<ExpenseDto>> AddAsync(AddExpenseDto dto, Guid userId);
        Task<Result<ExpenseDto>> GetByIdAsync(Guid expenseId, Guid userId);
        Task<Result<List<ExpenseDto>>> GetByPlanAsync(Guid planId, Guid userId);
        Task<ExpenseDto> GetByActivityIdAsync(Guid activityId);
        Task<Result<bool>> UpdateAsync(Guid expenseId, Guid userId, UpdateExpenseDto dto);
        Task<Result<bool>> DeleteAsync(Guid expenseId, Guid userId);
        Task<Result<BudgetSummaryDto>> GetBudgetSummaryAsync(Guid planId, double plannedBudget);
        Task<Result<bool>> SyncActivityUpdateAsync(Guid activityId, double newAmount, string newTitle, ExpenseCategory category);
        Task<Result<bool>> SyncActivityDeleteAsync(Guid activityId);
        Task SyncActivityAddAsync(Guid activityId, Guid planId, double amount, string title, ExpenseCategory category);
    }
}
