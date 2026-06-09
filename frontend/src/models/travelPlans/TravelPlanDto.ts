import type { DestinationDto } from "../destinations/DestinationDto";

export interface TravelPlanDto {
    id: string;
    userId: string;

    title: string;
    description: string;

    startDate: string;
    endDate: string;

    plannedBudget: number;
    generalNotes: string;

    createdAt: string;

    destinations: DestinationDto[];
}