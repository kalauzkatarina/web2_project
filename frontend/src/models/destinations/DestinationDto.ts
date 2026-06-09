import type { ActivityDto } from "../activities/ActivityDto";

export interface DestinationDto {
    id: string;
    travelPlanId: string;

    name: string;
    location: string;

    arrivalDate: string;
    departureDate: string;

    description: string;

    activities: ActivityDto[];
}