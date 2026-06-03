using Common.DTOs.finance;
using Common.Enums;
using Common.Models;
using FinanceService.Interfaces;
using FinanceService.Mappers;
using FinanceService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceService.Services
{
    public class ExpenseService : IExpenseService
    {
        private readonly IExpenseRepository _expenseRepository;

        public ExpenseService(IExpenseRepository expenseRepository)
        {
            _expenseRepository = expenseRepository;
        }

        public async Task<Result<ExpenseDto>> AddAsync(AddExpenseDto dto, Guid userId)
        {
            if (dto.Amount <= 0)
                return Result<ExpenseDto>.Failure("Amount must be greater than zero.");

            var expense = new Expense(
                Guid.NewGuid(),
                dto.PlanId,
                dto.Title,
                dto.Amount,
                dto.Category,
                dto.Date,
                dto.Description);

            var created = await _expenseRepository.AddAsync(expense);
            return Result<ExpenseDto>.Success(ExpenseMapper.ToDto(created));
        }

        public async Task<Result<bool>> DeleteAsync(Guid expenseId, Guid userId)
        {
            var expense = await _expenseRepository.GetByIdAsync(expenseId);
            if (expense == null)
                return Result<bool>.Failure("Expense not found.");

            var success = await _expenseRepository.DeleteAsync(expenseId);
            return success
              ? Result<bool>.Success(true)
              : Result<bool>.Failure("Failed to delete expense.");
        }

        public async Task<Result<BudgetSummaryDto>> GetBudgetSummaryAsync(Guid planId, double plannedBudget)
        {
            var totalExpenses = await _expenseRepository.GetTotalByPlanIdAsync(planId);

            var summary = new BudgetSummaryDto
            {
                PlanId = planId,
                PlannedBudget = plannedBudget,
                TotalExpenses = totalExpenses,
                RemainingBudget = plannedBudget - totalExpenses
            };

            return Result<BudgetSummaryDto>.Success(summary);
        }

        public async Task<ExpenseDto> GetByActivityIdAsync(Guid activityId)
        {
            var expense = await _expenseRepository.GetByActivityIdAsync(activityId);
            if (expense == null) return null;

            return ExpenseMapper.ToDto(expense);
        }

        public async Task<Result<ExpenseDto>> GetByIdAsync(Guid expenseId, Guid userId)
        {
            var expense = await _expenseRepository.GetByIdAsync(expenseId);
            if (expense == null)
                return Result<ExpenseDto>.Failure("Expense not found.");

            return Result<ExpenseDto>.Success(ExpenseMapper.ToDto(expense));
        }

        public async Task<Result<List<ExpenseDto>>> GetByPlanAsync(Guid planId, Guid userId)
        {
            var expenses = await _expenseRepository.GetByPlanIdAsync(planId);
            var dtos = expenses.Select(e => ExpenseMapper.ToDto(e)).ToList();
            return Result<List<ExpenseDto>>.Success(dtos);
        }

        public async Task<Result<bool>> SyncActivityDeleteAsync(Guid activityId)
        {
            var expense = await _expenseRepository.GetByActivityIdAsync(activityId);

            if (expense == null) return Result<bool>.Failure("Expense not found for activity delete.");

            await _expenseRepository.DeleteAsync(expense.Id);
            return Result<bool>.Success(true);
        }

        public async Task<Result<bool>> SyncActivityUpdateAsync(Guid activityId, double newAmount, string newTitle, ExpenseCategory category)
        {
            var expense = await _expenseRepository.GetByActivityIdAsync(activityId);

            if (expense == null) return Result<bool>.Failure("Expense not found for activity update.");

            expense.Amount = newAmount;
            expense.Title = newTitle;
            expense.Category = category;

            await _expenseRepository.UpdateAsync(expense);
            return Result<bool>.Success(true);
        }

        public async Task SyncActivityAddAsync(Guid activityId, Guid planId, double amount, string title, ExpenseCategory category)
        {
            // Ovde ide tvoja standardna logika za upis u SQL bazu
            var expense = new Expense
            {
                ActivityId = activityId,
                PlanId = planId,
                Amount = amount,
                Title = title,
                Category = category,
                Date = DateTime.Now,
                Description = !string.IsNullOrEmpty(title) ? $"Automatski dodato za: {title}" : "Sistemski trošak",
                CreatedAt = DateTime.Now
            };
            await _expenseRepository.AddAsync(expense);
        }

        public async Task<Result<bool>> UpdateAsync(Guid expenseId, Guid userId, UpdateExpenseDto dto)
        {
            var expense = await _expenseRepository.GetByIdAsync(expenseId);
            if (expense == null)
                return Result<bool>.Failure("Expense not found.");

            if (dto.Amount <= 0)
                return Result<bool>.Failure("Amount must be greater than zero.");

            expense.Title = dto.Title;
            expense.Amount = dto.Amount;
            expense.Category = dto.Category;
            expense.Date = dto.Date;
            expense.Description = dto.Description;

            var success = await _expenseRepository.UpdateAsync(expense);

            return success
                ? Result<bool>.Success(true)
                : Result<bool>.Failure("Failed to update expense.");
        }
    }
}
