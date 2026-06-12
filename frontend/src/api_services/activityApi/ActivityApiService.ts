import api from "../api";
import type { IActivityApiService } from "./IActivityApiService";
import type { ActivityDto } from "../../models/activities/ActivityDto";
import type { CreateActivityDto } from "../../models/activities/CreateActivityDto";
import type { UpdateActivityDto } from "../../models/activities/UpdateActivityDto";

export const activityService: IActivityApiService = {

    async getByDestination(
        destinationId: string
    ): Promise<ActivityDto[]> {

        const res =
            await api.get<ActivityDto[]>(
                `/activity/destination/${destinationId}`
            );

        return res.data;
    },

    async getByDate(
        planId: string,
        date: string
    ): Promise<ActivityDto[]> {

        const res =
            await api.get<ActivityDto[]>(
                `/activity/plan/${planId}/date/${date}`
            );

        return res.data;
    },

    async getById(
        id: string
    ): Promise<ActivityDto> {

        const res =
            await api.get<ActivityDto>(
                `/activity/${id}`
            );

        return res.data;
    },

    async getByPlan(
        planId: string
    ): Promise<ActivityDto[]> {

        const res =
            await api.get<ActivityDto[]>(
                `/activity/plan/${planId}`
            );

        return res.data;
    },

    async create(
        data: CreateActivityDto
    ): Promise<ActivityDto> {

        const res =
            await api.post<ActivityDto>(
                "/activity",
                data
            );

        return res.data;
    },

    async update(
        id: string,
        data: UpdateActivityDto
    ): Promise<void> {

        await api.put(
            `/activity/${id}`,
            data
        );
    },

    async delete(
        id: string
    ): Promise<void> {

        await api.delete(
            `/activity/${id}`
        );
    },
};