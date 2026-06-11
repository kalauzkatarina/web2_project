export interface UpdateActivityDto {
    title: string;
    location: string;
    description: string;

    estimatedCost: number;

    date: string;
    time: string;

    status: number;
    category: number;
}