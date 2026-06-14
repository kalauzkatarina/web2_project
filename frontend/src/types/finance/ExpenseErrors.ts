import type { AddExpenseDto } from "../../models/finance/AddExpenseDto";

export type ExpenseErrors = Partial<Record<keyof AddExpenseDto, string>>;