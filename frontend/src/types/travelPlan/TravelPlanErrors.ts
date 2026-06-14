import type { CreateTravelPlanDto } from "../../models/travelPlans/CreateTravelPlanDto";

export type TravelPlanErrors = Partial<Record<keyof CreateTravelPlanDto, string>>;