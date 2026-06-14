import type { AddExpenseDto } from "../../../models/finance/AddExpenseDto";

export type AddExpenseFormProps = {
    planId: string;
    planStartDate: string;
    planEndDate: string;
    onAdd: (data: AddExpenseDto) => Promise<void>;
    onClose: () => void;
}