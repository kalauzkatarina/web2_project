import type { ActivityDto } from "../../models/activities/ActivityDto";
import type { CreateActivityDto } from "../../models/activities/CreateActivityDto";
import type { UpdateActivityDto } from "../../models/activities/UpdateActivityDto";

export interface IActivityApiService {

    getByDestination(
        destinationId: string
    ): Promise<ActivityDto[]>;

    getByDate(
        planId: string,
        date: string
    ): Promise<ActivityDto[]>;

    getById(id: string): Promise<ActivityDto>;

    getByPlan(
        planId: string
    ): Promise<ActivityDto[]>;

    create(
        data: CreateActivityDto
    ): Promise<ActivityDto>;

    update(
        id: string,
        data: UpdateActivityDto
    ): Promise<void>;

    delete(
        id: string
    ): Promise<void>;
}