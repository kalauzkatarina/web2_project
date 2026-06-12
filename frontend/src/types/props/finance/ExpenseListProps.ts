import type { ExpenseDto } from "../../../models/finance/ExpenseDto";

export type ExpenseListProps = {
    expenses: ExpenseDto[];
    onDelete: (id: string) => void;
}