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

    useEffect(() => {

        if (!token)
            return;

        const load = async () => {

            try {

                const result =
                    await shareTokenService.getByToken(token);

                setData(result);

            } finally {

                setLoading(false);
            }
        };

        load();

    }, [token]);

    return {
        data,
        loading
    };
}