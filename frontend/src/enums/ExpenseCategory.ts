// src/models/finance/ExpenseCategory.ts (ili gde ti stoji)
export const ExpenseCategory = {
    Transport: 0,
    Accommodation: 1,
    Food: 2,
    Tickets: 3,
    Shopping: 4,
    Other: 5,
} as const;

// Ovo je ključno za TypeScript:
export type ExpenseCategory = typeof ExpenseCategory[keyof typeof ExpenseCategory];