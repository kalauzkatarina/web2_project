import type { BudgetSummaryProps } from "../../types/props/finance/BudgetSummaryProps";

export default function BudgetSummaryCard({ summary }: BudgetSummaryProps) {
    // Ako još nemamo summary, prikazujemo loading state
    if (!summary) {
        return (
            <div className="bg-white rounded-[2rem] p-8 border border-stone-200 shadow-sm mb-8 animate-pulse">
                <div className="h-6 w-1/3 bg-stone-200 rounded-lg mb-6"></div>
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-stone-100 rounded-2xl h-24"></div>
                    ))}
                </div>
            </div>
        );
    }
    
    const percentage = summary.plannedBudget > 0
        ? Math.min((summary.totalExpenses / summary.plannedBudget) * 100, 100)
        : 0;

    const isOverBudget = summary.remainingBudget < 0;

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-stone-200 shadow-sm mb-8">
            <h3 className="text-xl font-bold text-stone-900 mb-6">Budget Overview</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-amber-50 rounded-2xl p-5">
                    <p className="text-stone-500 text-sm">Planned Budget</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">€{summary.plannedBudget}</p>
                </div>

                <div className="bg-stone-50 rounded-2xl p-5">
                    <p className="text-stone-500 text-sm">Total Spent</p>
                    <p className="text-2xl font-bold text-stone-800 mt-1">€{summary.totalExpenses}</p>
                </div>

                <div className={`rounded-2xl p-5 ${isOverBudget ? "bg-red-50" : "bg-green-50"}`}>
                    <p className="text-stone-500 text-sm">Remaining</p>
                    <p className={`text-2xl font-bold mt-1 ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                        €{summary.remainingBudget}
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-stone-100 rounded-full h-3">
                <div
                    className={`h-3 rounded-full transition-all ${isOverBudget ? "bg-red-500" : "bg-amber-500"}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="text-sm text-stone-500 mt-2">{percentage.toFixed(0)}% of budget used</p>
        </div>
    );
}