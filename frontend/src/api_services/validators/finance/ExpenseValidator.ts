import type { AddExpenseDto } from "../../../models/finance/AddExpenseDto";
import type { ExpenseErrors } from "../../../types/finance/ExpenseErrors";

export function validateExpense(form: AddExpenseDto, planStartDate?: string, planEndDate?: string): ExpenseErrors {
    const errors: ExpenseErrors = {};

    if (!form.title?.trim())
        errors.title = "Title is required.";
    else if (form.title.length > 100)
        errors.title = "Title cannot exceed 100 characters.";

    if (!form.amount || form.amount <= 0)
        errors.amount = "Amount must be greater than zero.";

    if (!form.date)
        errors.date = "Date is required.";
    else if (planStartDate && form.date < planStartDate)
        errors.date = `Date cannot be before trip start (${planStartDate}).`;
    else if (planEndDate && form.date > planEndDate)
        errors.date = `Date cannot be after trip end (${planEndDate}).`;

    return errors;
}