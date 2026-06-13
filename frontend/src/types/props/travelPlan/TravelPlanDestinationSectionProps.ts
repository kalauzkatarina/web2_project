import type { TravelPlanDto } from "../../../models/travelPlans/TravelPlanDto";

export type TravelPlanDestinationsSectionProps = {
    plan: TravelPlanDto;
    navigate: (path: string) => void;
    onEditDestination?: (id: string) => void;
    onDeleteDestination?: (id: string) => void;
    shareToken?: string;
    onEditActivity?: (id: string) => void;
    onDeleteActivity?: (id: string) => void;

    showActions?: boolean;
}