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

    async getById(id: string, shareToken?: string): Promise<ActivityDto> {
        const params = shareToken ? `?shareToken=${shareToken}` : "";
        const res = await api.get<ActivityDto>(`/activity/${id}${params}`);
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

    async create(data: CreateActivityDto, shareToken?: string): Promise<ActivityDto> {
        const params = shareToken ? `?shareToken=${shareToken}` : "";
        const res = await api.post<ActivityDto>(`/activity${params}`, data);
        return res.data;
    },

    async update(id: string, data: UpdateActivityDto, shareToken?: string): Promise<void> {
        const params = shareToken ? `?shareToken=${shareToken}` : "";
        await api.put(`/activity/${id}${params}`, data);
    },

    async delete(id: string, shareToken?: string): Promise<void> {
        const params = shareToken ? `?shareToken=${shareToken}` : "";
        await api.delete(`/activity/${id}${params}`);
    },
};