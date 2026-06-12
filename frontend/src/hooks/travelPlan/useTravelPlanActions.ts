import { useState } from "react";
import { travelPlanService } from "../../api_services/travelPlanApi/TravelPlanApiService";
import { destinationService } from "../../api_services/destinationApi/DestinationApiService";
import { activityService } from "../../api_services/activityApi/ActivityApiService";
import type { TravelPlanDto } from "../../models/travelPlans/TravelPlanDto";

export interface DeleteState {
    showPlanModal: boolean;
    destinationId: string | null;
    activityId: string | null;
}

export const useTravelPlanActions = (
    planId: string, 
    setPlan: React.Dispatch<React.SetStateAction<TravelPlanDto | null>>, //ovo je reactov setter, prima vrednost i null
    onRefreshFinance: () => Promise<void>
) => {
    const [deleteState, setDeleteState] = useState<DeleteState>({
        showPlanModal: false,
        destinationId: null,
        activityId: null
    });

    const handlers = {
        deletePlan: async () => {
            await travelPlanService.delete(planId);
        },
        deleteDestination: async (id: string) => {
            await destinationService.delete(id);
            setPlan((prev) => prev ? { 
                ...prev, 
                destinations: prev.destinations.filter((d) => d.id !== id) 
            } : null);
            await onRefreshFinance();
            setDeleteState(s => ({ ...s, destinationId: null }));
        },
        deleteActivity: async (id: string) => {
            await activityService.delete(id);
            setPlan((prev) => prev ? {
                ...prev,
                destinations: prev.destinations.map((d) => ({
                    ...d,
                    activities: d.activities.filter((a) => a.id !== id)
                }))
            } : null);
            await onRefreshFinance();
            setDeleteState(s => ({ ...s, activityId: null }));
        }
    };

    return { deleteState, setDeleteState, handlers };
};