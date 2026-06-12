import { useState, useEffect } from "react";
import { checklistService } from "../../api_services/checklistApi/ChecklistApiService";
import type { ChecklistItemDto } from "../../models/checklist/ChecklistItemDto";

export function useChecklist(planId: string | undefined) {
    const [items, setItems] = useState<ChecklistItemDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        if (!planId) return;
        try {
            const data = await checklistService.getByPlan(planId);
            setItems(data);
        } catch (error) {
            console.error("Error fetching checklist:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [planId]);

    return { items, setItems, loading, refetch: fetchItems };
}