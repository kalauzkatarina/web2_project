export interface ActivityDto {
    id: string;
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