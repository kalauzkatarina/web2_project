import type { TravelPlanDto } from "../../../models/travelPlans/TravelPlanDto";

export type TravelPlanHeaderProps = {
    plan: TravelPlanDto;
    onEdit: () => void;
    onDelete: () => void;
}