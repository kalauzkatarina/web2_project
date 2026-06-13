import type { CreateTravelPlanDto } from "../../models/travelPlans/CreateTravelPlanDto";
import type { TravelPlanDto } from "../../models/travelPlans/TravelPlanDto";
import type { UpdateTravelPlanDto } from "../../models/travelPlans/UpdateTravelPlanDto";

export interface ITravelPlanApiService {
    getAll(): Promise<TravelPlanDto[]>;
    getAllAdmin(): Promise<TravelPlanDto[]>;
    getById(id: string, shareToken?: string): Promise<TravelPlanDto>;
    create(data: CreateTravelPlanDto): Promise<TravelPlanDto>;
    update(id: string, data: UpdateTravelPlanDto, shareToken?: string): Promise<void>;
    delete(id: string): Promise<void>;
}