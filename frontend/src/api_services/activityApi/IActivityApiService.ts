import type { ActivityDto } from "../../models/activities/ActivityDto";
import type { CreateActivityDto } from "../../models/activities/CreateActivityDto";
import type { UpdateActivityDto } from "../../models/activities/UpdateActivityDto";

export interface IActivityApiService {
    getByDestination(destinationId: string): Promise<ActivityDto[]>;
    getByDate(planId: string, date: string): Promise<ActivityDto[]>;
    getById(id: string, shareToken?: string): Promise<ActivityDto>;
    getByPlan(planId: string): Promise<ActivityDto[]>;
    create(data: CreateActivityDto, shareToken?: string): Promise<ActivityDto>;
    update(id: string, data: UpdateActivityDto, shareToken?: string): Promise<void>;
    delete(id: string, shareToken?: string): Promise<void>;
}