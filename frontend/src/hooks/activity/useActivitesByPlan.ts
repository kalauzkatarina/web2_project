import { useEffect, useState } from "react";
import type { ActivityDto } from "../../models/activities/ActivityDto";
import { activityService } from "../../api_services/activityApi/ActivityApiService";

export function useActivitiesByPlan(planId?: string) {

    const [activities, setActivities] =
        useState<ActivityDto[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        if (!planId)
            return;

        activityService
            .getByPlan(planId)
            .then(setActivities)
            .finally(() => setLoading(false));

    }, [planId]);

    return {
        activities,
        loading,
    };
}