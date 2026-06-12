import { HiOutlineTrash } from "react-icons/hi";
import { ExpenseCategory } from "../../enums/ExpenseCategory";
import { categoryLabels, categoryColors } from "../../constants/financeConstants";
import type { ExpenseListProps } from "../../types/props/finance/ExpenseListProps";

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
    if (expenses.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 text-center text-stone-500 border border-stone-200">
                No expenses added yet.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {expenses.map((expense) => (
                <div
                    key={expense.id}
                    className="bg-white rounded-2xl p-5 border border-stone-200 flex justify-between items-center"
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-stone-900">{expense.title}</h4>
                            {expense.activityId && (
                                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                                    Auto
                                </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[expense.category as ExpenseCategory]}`}>
                                {categoryLabels[expense.category as ExpenseCategory]}
                            </span>
                        </div>
                        {expense.description && (
                            <p className="text-sm text-stone-500 mt-1">{expense.description}</p>
                        )}
                        <p className="text-xs text-stone-400 mt-1">
                            {new Date(expense.date).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-amber-600">€{expense.amount}</span>
                        {!expense.activityId && (
                            <button
                                onClick={() => onDelete(expense.id)}
                                className="p-2 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-red-500 hover:border-red-300 transition"
                            >
                                <HiOutlineTrash size={16} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}