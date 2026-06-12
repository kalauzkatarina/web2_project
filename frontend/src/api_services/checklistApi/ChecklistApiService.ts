import type { AddChecklistItemDto } from "../../models/checklist/AddChecklistItemDto";
import type { ChecklistItemDto } from "../../models/checklist/ChecklistItemDto";
import type { UpdateChecklistItemDto } from "../../models/checklist/UpdateChecklistItemDto";
import api from "../api";
import type { IChecklistApiService } from "./IChecklistApiService";

export const checklistService: IChecklistApiService = {
    async getByPlan(planId: string): Promise<ChecklistItemDto[]> {
        const response = await api.get(`/checklist/plan/${planId}`);
        return response.data;
    },

    async addItem(data: AddChecklistItemDto): Promise<ChecklistItemDto> {
        const response = await api.post("/checklist", data);
        return response.data;
    },

    async toggleItem(itemId: string): Promise<ChecklistItemDto> {
        const response = await api.patch(`/checklist/${itemId}/toggle`);
        return response.data;
    },

    async updateItem(itemId: string, data: UpdateChecklistItemDto): Promise<void> {
        await api.put(`/checklist/${itemId}`, data);
    },

    async deleteItem(itemId: string): Promise<void> {
        await api.delete(`/checklist/${itemId}`);
    }
};