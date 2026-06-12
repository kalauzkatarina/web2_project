export interface AddExpenseDto {
    planId: string;
    title: string;
    amount: number;
    category: number;
    date: string;
    description: string;
    activityId?: string;
}