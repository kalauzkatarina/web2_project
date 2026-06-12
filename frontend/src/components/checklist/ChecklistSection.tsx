import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { FiCheck } from "react-icons/fi";
import { checklistService } from "../../api_services/checklistApi/ChecklistApiService";
import { useChecklist } from "../../hooks/checklist/useChecklist";
import type { ChecklistSectionProps } from "../../types/props/checklist/ChecklistSectionProps";

export default function ChecklistSection({ planId }: ChecklistSectionProps) {
    const { items, setItems, loading } = useChecklist(planId);
    const [newTitle, setNewTitle] = useState("");
    const [adding, setAdding] = useState(false);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            const created = await checklistService.addItem({ planId, title: newTitle });
            setItems(prev => [...prev, created]);
            setNewTitle("");
            setAdding(false);
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    const handleToggle = async (itemId: string) => {
        try {
            const updated = await checklistService.toggleItem(itemId);
            setItems(prev => prev.map(i => i.id === itemId ? updated : i));
        } catch (error) {
            console.error("Error toggling item:", error);
        }
    };

    const handleDelete = async (itemId: string) => {
        try {
            await checklistService.deleteItem(itemId);
            setItems(prev => prev.filter(i => i.id !== itemId));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const completed = items.filter(i => i.isCompleted).length;

    return (
        <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-stone-900">Packing List</h2>
                    {items.length > 0 && (
                        <p className="text-stone-500 mt-1 text-sm">
                            {completed} / {items.length} completed
                        </p>
                    )}
                </div>

                <button
                    onClick={() => setAdding(!adding)}
                    className="px-5 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition shadow-sm"
                >
                    + Add Item
                </button>
            </div>

            {items.length > 0 && (
                <div className="w-full bg-stone-100 rounded-full h-2 mb-6">
                    <div
                        className="h-2 rounded-full bg-amber-500 transition-all"
                        style={{ width: `${(completed / items.length) * 100}%` }}
                    />
                </div>
            )}

            {adding && (
                <form
                    onSubmit={handleAdd}
                    className="bg-white rounded-2xl p-5 border border-stone-200 mb-4 flex gap-3"
                >
                    <input
                        type="text"
                        placeholder="e.g. Passport, charger, sunscreen..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        autoFocus
                        className="flex-1 px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-400"
                    />
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
                    >
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={() => setAdding(false)}
                        className="px-5 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
                    >
                        Cancel
                    </button>
                </form>
            )}

            {loading ? (
                <div>Loading...</div>
            ) : items.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center text-stone-500 border border-stone-200">
                    No items added yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-2xl p-4 border flex items-center gap-4 transition
                ${item.isCompleted ? "border-green-200 bg-green-50" : "border-stone-200"}`}
                        >
                            <button
                                onClick={() => handleToggle(item.id)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition flex-shrink-0
                  ${item.isCompleted
                                        ? "bg-green-500 border-green-500 text-white"
                                        : "border-stone-300 hover:border-amber-400"}`}
                            >
                                {item.isCompleted && <FiCheck size={12} />}
                            </button>

                            <span className={`flex-1 font-medium ${item.isCompleted ? "line-through text-stone-400" : "text-stone-800"}`}>
                                {item.title}
                            </span>

                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition"
                            >
                                <HiOutlineTrash size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}