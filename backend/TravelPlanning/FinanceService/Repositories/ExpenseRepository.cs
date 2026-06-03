using FinanceService.Context;
using FinanceService.Interfaces;
using FinanceService.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceService.Repositories
{
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly FinanceDbContext _context;

        public ExpenseRepository(FinanceDbContext context)
        {
            _context = context;
        }
        public async Task<Expense> AddAsync(Expense expense)
        {
            await _context.Expenses.AddAsync(expense);
            await _context.SaveChangesAsync();
            return expense;
        }

        public async Task<bool> DeleteAsync(Guid expenseId)
        {
            var expense = await _context.Expenses.FindAsync(expenseId);
            if (expense == null) return false;

            _context.Expenses.Remove(expense);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> DeleteByPlanIdAsync(Guid planId)
        {
            var expenses = await _context.Expenses
                .Where(e => e.PlanId == planId)
                .ToListAsync();

            if (!expenses.Any()) return true;

            _context.Expenses.RemoveRange(expenses);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<List<Expense>> GetAllAsync()
        {
            return await _context.Expenses.ToListAsync();
        }

        public async Task<Expense?> GetByActivityIdAsync(Guid activityId)
        {
            return await _context.Expenses.FirstOrDefaultAsync(e => e.ActivityId == activityId);
        }

        public async Task<Expense?> GetByIdAsync(Guid expenseId)
        {
            return await _context.Expenses
                .FirstOrDefaultAsync(e => e.Id == expenseId);
        }

        public async Task<List<Expense>> GetByPlanIdAsync(Guid planId)
        {
            return await _context.Expenses
                .Where(e => e.PlanId == planId)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
        }

        public async Task<double> GetTotalByPlanIdAsync(Guid planId)
        {
            return await _context.Expenses
                .Where(e => e.PlanId == planId)
                .SumAsync(e => e.Amount);
        }

        public async Task<bool> UpdateAsync(Expense expense)
        {
            _context.Expenses.Update(expense);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}
