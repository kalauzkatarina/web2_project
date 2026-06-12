import type { AddChecklistItemDto } from "../../models/checklist/AddChecklistItemDto";
import type { ChecklistItemDto } from "../../models/checklist/ChecklistItemDto";
import type { UpdateChecklistItemDto } from "../../models/checklist/UpdateChecklistItemDto";

export interface IChecklistApiService {
    getByPlan(planId: string): Promise<ChecklistItemDto[]>;
    addItem(data: AddChecklistItemDto): Promise<ChecklistItemDto>;
    toggleItem(itemId: string): Promise<ChecklistItemDto>;
    updateItem(itemId: string, data: UpdateChecklistItemDto): Promise<void>;
    deleteItem(itemId: string): Promise<void>;
}