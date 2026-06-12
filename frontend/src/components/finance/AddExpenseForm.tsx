import { useState } from "react";
import type { AddExpenseDto } from "../../models/finance/AddExpenseDto";
import { ExpenseCategory } from "../../enums/ExpenseCategory";
import type { AddExpenseFormProps } from "../../types/props/finance/AddExpenseFormProps";

export default function AddExpenseForm({ planId, onAdd, onClose }: AddExpenseFormProps) {
    const [form, setForm] = useState<AddExpenseDto>({
        planId,
        title: "",
        amount: 0,
        category: ExpenseCategory.Other,
        date: new Date().toISOString().split("T")[0],
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onAdd(form);
        onClose();
    };

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-stone-200 shadow-sm mb-6">
            <h3 className="text-xl font-bold text-stone-900 mb-6">Add Expense</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="Expense title"
                        value={form.title || ""}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="form-label">Amount (€)</label>
                        <input
                            type="number"
                            required
                            min={0.01}
                            step={0.01}
                            className="form-input"
                            placeholder="0"
                            value={form.amount || ""}
                            onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
                        />
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
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        required
                        className="form-input"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                </div>

                <div>
                    <label className="form-label">Description (optional)</label>
                    <textarea
                        className="form-input"
                        rows={2}
                        placeholder="Describe your expense..."
                        value={form.description || ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                    <button type="button" onClick={onClose} className="px-5 py-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50">Cancel</button>
                    <button type="submit" className="px-5 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600">Add Expense</button>
                </div>
            </form>
        </div>
    );
}