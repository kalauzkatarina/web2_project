export interface ExpenseDto {
    id: string;
    planId: string;
    title: string;
    amount: number;
    category: number; 
    date: string;
    description: string;
    createdAt: string;
    activityId?: string;
}