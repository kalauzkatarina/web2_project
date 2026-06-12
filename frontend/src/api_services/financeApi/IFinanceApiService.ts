import type { AddExpenseDto } from "../../models/finance/AddExpenseDto";
import type { BudgetSummaryDto } from "../../models/finance/BudgetSummaryDto";
import type { ExpenseDto } from "../../models/finance/ExpenseDto";
import type { UpdateExpenseDto } from "../../models/finance/UpdateExpenseDto";

export interface IFinanceApiService {
    addExpense(data: AddExpenseDto): Promise<ExpenseDto>;
    getSummary(planId: string): Promise<BudgetSummaryDto>;
    getByPlan(planId: string): Promise<ExpenseDto[]>;
    updateExpense(expenseId: string, data: UpdateExpenseDto): Promise<void>;
    deleteExpense(expenseId: string): Promise<void>;
}