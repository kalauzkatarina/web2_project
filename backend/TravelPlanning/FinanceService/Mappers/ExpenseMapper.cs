using Common.DTOs.finance;
using FinanceService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceService.Mappers
{
    public static class ExpenseMapper
    {
        public static ExpenseDto ToDto(Expense expense)
        {
            return new ExpenseDto
            {
                Id = expense.Id,
                PlanId = expense.PlanId,
                Title = expense.Title,
                Amount = expense.Amount,
                Category = expense.Category,
                Date = expense.Date,
                Description = expense.Description,
                CreatedAt = expense.CreatedAt,
                ActivityId = expense.ActivityId,
            };
        }
    }
}
