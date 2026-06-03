using FinanceService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceService.Interfaces
{
    public interface IExpenseRepository
    {
        Task<Expense> AddAsync(Expense expense);
        Task<Expense?> GetByIdAsync(Guid expenseId);
        Task<List<Expense>> GetByPlanIdAsync(Guid planId);
        Task<List<Expense>> GetAllAsync();
        Task<bool> UpdateAsync(Expense expense);
        Task<bool> DeleteAsync(Guid expenseId);
        Task<double> GetTotalByPlanIdAsync(Guid planId);
        Task<bool> DeleteByPlanIdAsync(Guid planId); //kaskadno brisanje
        Task<Expense?> GetByActivityIdAsync(Guid activityId);
    }
}
