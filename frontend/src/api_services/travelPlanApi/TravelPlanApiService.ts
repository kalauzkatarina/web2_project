import type { CreateTravelPlanDto } from "../../models/travelPlans/CreateTravelPlanDto";
import type { TravelPlanDto } from "../../models/travelPlans/TravelPlanDto";
import type { UpdateTravelPlanDto } from "../../models/travelPlans/UpdateTravelPlanDto";
import api from "../api";
import type { ITravelPlanApiService } from "./ITravelPlanApiService";

export const travelPlanService: ITravelPlanApiService = {
    async getAll(): Promise<TravelPlanDto[]> {
        const res = await api.get<TravelPlanDto[]>("/travelPlan");

        return res.data;
    },

    async getAllAdmin(): Promise<TravelPlanDto[]> {
        const res = await api.get<TravelPlanDto[]>("/travelPlan/all");
        return res.data;
    },

    async getById(id: string, shareToken?: string): Promise<TravelPlanDto> {
        const params = shareToken ? `?shareToken=${shareToken}` : "";
        const res = await api.get<TravelPlanDto>(`/travelPlan/${id}${params}`);
        return res.data;
    },


    async create(
        data: CreateTravelPlanDto
    ): Promise<TravelPlanDto> {
        const res = await api.post<TravelPlanDto>(
            "/travelPlan",
            data
        );

        return res.data;
    },

    async update(id: string, data: UpdateTravelPlanDto, shareToken?: string): Promise<void> {
        const params = shareToken ? `?shareToken=${shareToken}` : "";
        await api.put(`/travelPlan/${id}${params}`, data);
    },
    async delete(id: string): Promise<void> {
        await api.delete(`/travelPlan/${id}`);
    },
};