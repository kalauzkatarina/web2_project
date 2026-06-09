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

    async getById(id: string): Promise<TravelPlanDto> {
        const res = await api.get<TravelPlanDto>(
            `/travelPlan/${id}`
        );

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

    async update(
        id: string,
        data: UpdateTravelPlanDto
    ): Promise<void> {
        await api.put(`/travelPlan/${id}`, data);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/travelPlan/${id}`);
    },
};