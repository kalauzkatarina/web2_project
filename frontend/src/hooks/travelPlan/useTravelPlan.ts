import { useEffect, useState } from "react";
import { travelPlanService } from "../../api_services/travelPlanApi/TravelPlanApiService";
import type { TravelPlanDto } from "../../models/travelPlans/TravelPlanDto";

export function useTravelPlan(id: string | undefined) {
    const [plan, setPlan] = useState<TravelPlanDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        loadPlan();
    }, [id]);

    const loadPlan = async () => {
        try {
            const data = await travelPlanService.getById(id!);
            setPlan(data);
        } finally {
            setLoading(false);
        }
    };

    return {
        plan,
        setPlan,
        loading,
        refresh: loadPlan,
    };
}