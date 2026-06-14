import type { BudgetSummaryDto } from "../../../models/finance/BudgetSummaryDto";
import type { ExpenseDto } from "../../../models/finance/ExpenseDto";

export type FinanceSectionProps = {
    planId: string;
    planStartDate: string;
    planEndDate: string;
    summary: BudgetSummaryDto | null;
    expenses: ExpenseDto[];
    onRefresh: () => Promise<void>;

}