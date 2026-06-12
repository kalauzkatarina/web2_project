import type { TravelPlanDto } from "../../../models/travelPlans/TravelPlanDto";

export type TravelPlanDestinationsSectionProps = {
    plan: TravelPlanDto;
    navigate: (path: string) => void;
    onEditDestination: (id: string) => void;
    onDeleteDestination: (id: string) => void;
    onEditActivity: (id: string) => void;
    onDeleteActivity: (id: string) => void;
}