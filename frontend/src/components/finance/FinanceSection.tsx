import { useState } from "react";
import BudgetSummaryCard from "./BudgetSummaryCard";
import AddExpenseForm from "./AddExpenseForm";
import ExpenseList from "./ExpenseList";
import { financeService } from "../../api_services/financeApi/FinanceApiService";
import type { FinanceSectionProps } from "../../types/props/finance/FinanceSectionProps";

export default function FinanceSection({ planId, summary, expenses, onRefresh }: FinanceSectionProps) {
    const [showAddExpense, setShowAddExpense] = useState(false);

    return (
        <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-stone-900">Budget & Expenses</h2>
                <button
                    onClick={() => setShowAddExpense(!showAddExpense)}
                    className="px-5 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
                >
                    + Add Expense
                </button>
            </div>

            {summary && <BudgetSummaryCard summary={summary} />}

            {showAddExpense && (
                <AddExpenseForm
                    planId={planId}
                    onClose={() => setShowAddExpense(false)}
                    onAdd={async (data) => {
                        await financeService.addExpense(data);
                        setShowAddExpense(false);
                        await onRefresh();
                    }}
                />
            )}

            <ExpenseList
                expenses={expenses}
                onDelete={async (id: string) => {
                    await financeService.deleteExpense(id);
                    await onRefresh();
                }}
            />
        </div>
    );
}