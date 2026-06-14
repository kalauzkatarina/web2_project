import { useState } from "react";
import type { AddExpenseDto } from "../../models/finance/AddExpenseDto";
import { ExpenseCategory } from "../../enums/ExpenseCategory";
import type { AddExpenseFormProps } from "../../types/props/finance/AddExpenseFormProps";
import type { ExpenseErrors } from "../../types/finance/ExpenseErrors";
import { validateExpense } from "../../api_services/validators/finance/ExpenseValidator";

export default function AddExpenseForm({ planId, planStartDate, planEndDate, onAdd, onClose }: AddExpenseFormProps) {
    const [form, setForm] = useState<AddExpenseDto>({
        planId,
        title: "",
        amount: 0,
        category: ExpenseCategory.Other,
        date: new Date().toISOString().split("T")[0],
        description: "",
    });
    const [errors, setErrors] = useState<ExpenseErrors>({});

    const clearError = (field: string) => {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const ErrorMsg = ({ message }: { message?: string }) =>
        message ? (
            <p className="text-red-500 text-xs mt-1">
                {message}
            </p>
        ) : null;

    const inputClass = (hasError: boolean) =>
        `form-input ${hasError ? "border-red-400" : ""}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateExpense(form, planStartDate, planEndDate);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        await onAdd(form);
        onClose();
    };

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-stone-200 shadow-sm mb-6">
            <h3 className="text-xl font-bold text-stone-900 mb-6">Add Expense</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="form-label">Title <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        className={inputClass(!!errors.title)}
                        placeholder="Expense title"
                        value={form.title || ""}
                        onChange={(e) => {
                            setForm({ ...form, title: e.target.value });
                            clearError("title");
                        }}
                    />
                    <ErrorMsg message={errors.title} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="form-label">Amount (€) <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            min={0.01}
                            step={0.01}
                            className={inputClass(!!errors.amount)}
                            placeholder="0"
                            value={form.amount || ""}
                            onChange={(e) => {
                                setForm({ ...form, amount: parseFloat(e.target.value) })
                                clearError("amount");
                            }}
                        />
                        <ErrorMsg message={errors.amount} />
                    </div>

                    <div>
                        <label className="form-label">Category</label>
                        <select
                            className="form-input"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: Number(e.target.value) })}
                        >
                            {Object.entries(ExpenseCategory).map(([name, value]) => (
                                <option key={value} value={value}>{name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="form-label">Date <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        className={inputClass(!!errors.date)}
                        value={form.date}
                        min={planStartDate}
                        max={planEndDate}
                        onChange={(e) => {
                            setForm({ ...form, date: e.target.value })
                            clearError("date")
                        }}
                    />
                    <ErrorMsg message={errors.date} />
                </div>

                <div>
                    <label className="form-label">Description</label>
                    <textarea
                        className={inputClass(!!errors.description)}
                        rows={2}
                        placeholder="Describe your expense..."
                        value={form.description || ""}
                        onChange={(e) => {
                            setForm({ ...form, description: e.target.value })
                            clearError("description")
                        }}
                    />
                    <ErrorMsg message={errors.description} />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                    <button type="button" onClick={onClose} className="px-5 py-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50">Cancel</button>
                    <button type="submit" className="px-5 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600">Add Expense</button>
                </div>
            </form>
        </div>
    );
}