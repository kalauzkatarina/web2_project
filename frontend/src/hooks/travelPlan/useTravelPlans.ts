import { useEffect, useState } from "react";
import type { TravelPlanDto } from "../../models/travelPlans/TravelPlanDto";
import { travelPlanService } from "../../api_services/travelPlanApi/TravelPlanApiService";

export function useTravelPlans() {
    const [plans, setPlans] = useState<TravelPlanDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            const data = await travelPlanService.getAll();
            setPlans(data);
        } finally {
            setLoading(false);
        }
    };

    return {
        plans,
        loading,
        refresh: loadPlans,
    };
}