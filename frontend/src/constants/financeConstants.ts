import { ExpenseCategory } from "../enums/ExpenseCategory";

export const categoryLabels: Record<ExpenseCategory, string> = {
    [ExpenseCategory.Transport]: "Transport",
    [ExpenseCategory.Accommodation]: "Accommodation",
    [ExpenseCategory.Food]: "Food",
    [ExpenseCategory.Tickets]: "Tickets",
    [ExpenseCategory.Shopping]: "Shopping",
    [ExpenseCategory.Other]: "Other",
};

export const categoryColors: Record<ExpenseCategory, string> = {
    [ExpenseCategory.Transport]: "bg-blue-100 text-blue-700",
    [ExpenseCategory.Accommodation]: "bg-purple-100 text-purple-700",
    [ExpenseCategory.Food]: "bg-orange-100 text-orange-700",
    [ExpenseCategory.Tickets]: "bg-pink-100 text-pink-700",
    [ExpenseCategory.Shopping]: "bg-green-100 text-green-700",
    [ExpenseCategory.Other]: "bg-stone-100 text-stone-700",
};