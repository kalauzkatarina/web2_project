using Common.DTOs.finance;
using Common.Enums;
using Common.Models;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface IFinanceService : IService
    {
        Task<Result<ExpenseDto>> AddExpenseAsync(AddExpenseDto dto, Guid userId);
        Task<Result<ExpenseDto>> GetExpenseByIdAsync(Guid expenseId, Guid userId);
        Task<Result<List<ExpenseDto>>> GetExpensesByPlanAsync(Guid planId, Guid userId);
        Task<Result<bool>> UpdateExpenseAsync(Guid expenseId, Guid userId, UpdateExpenseDto dto);
        Task<Result<bool>> DeleteExpenseAsync(Guid expenseId, Guid userId);
        Task<Result<BudgetSummaryDto>> GetBudgetSummaryAsync(Guid planId, Guid userId);
        Task<Result<bool>> DeleteExpensesByPlanAsync(Guid planId); // kaskadno brisanje
        Task<Result<bool>> SyncActivityCostAsync(Guid userId, Guid planId, Guid activityId, double newTotalAmount, string title, string operation, ExpenseCategory category);
    }
}
