import type { AccessType } from "../../enums/AccessType";
import type { TravelPlanDto } from "../travelPlans/TravelPlanDto";

export interface SharedTravelPlanDto {
    plan: TravelPlanDto;
    accessType: AccessType;
}