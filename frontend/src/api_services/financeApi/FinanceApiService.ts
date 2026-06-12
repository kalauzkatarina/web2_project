import type { AddExpenseDto } from "../../models/finance/AddExpenseDto";
import type { BudgetSummaryDto } from "../../models/finance/BudgetSummaryDto";
import type { ExpenseDto } from "../../models/finance/ExpenseDto";
import type { UpdateExpenseDto } from "../../models/finance/UpdateExpenseDto";
import api from "../api";
import type { IFinanceApiService } from "./IFinanceApiService";

export const financeService: IFinanceApiService = {
    async addExpense(data: AddExpenseDto): Promise<ExpenseDto> {
        const res = await api.post<ExpenseDto>("/finance/expense", data);
        return res.data;
    },

    async getSummary(planId: string): Promise<BudgetSummaryDto> {
        const res = await api.get<BudgetSummaryDto>(`/finance/summary/${planId}`);
        return res.data;
    },

    async getByPlan(planId: string): Promise<ExpenseDto[]> {
        const res = await api.get<ExpenseDto[]>(`/finance/plan/${planId}`);
        return res.data;
    },

    async updateExpense(expenseId: string, data: UpdateExpenseDto): Promise<void> {
        await api.put(`/finance/expense/${expenseId}`, data);
    },

    async deleteExpense(expenseId: string): Promise<void> {
        await api.delete(`/finance/expense/${expenseId}`);
    }
};