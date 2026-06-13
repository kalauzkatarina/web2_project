import { useEffect, useState } from "react";
import { shareTokenService } from "../../api_services/shareTokenApi/ShareTokenApiService";
import type { SharedTravelPlanDto } from "../../models/shareToken/SharedTravelPlanDto";

export function useSharedPlan(
    token?: string
) {
    const [data, setData] =
        useState<SharedTravelPlanDto | null>(null);

    const [loading, setLoading] =
        useState(true);

     const fetchData = async () => {
        if (!token) return;
        try {
            const result = await shareTokenService.getByToken(token);
            setData(result);
        } catch {
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    return {
        data,
        loading,
        refetch: fetchData
    };
}