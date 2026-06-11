export interface CreateActivityDto {
    destinationId: string;

    title: string;
    location: string;
    description: string;

    estimatedCost: number;

    date: string;
    time: string;

    status: number;
    category: number;
}