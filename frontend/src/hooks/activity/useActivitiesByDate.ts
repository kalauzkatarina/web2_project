import { useEffect, useState } from "react";
import type { ActivityDto } from "../../models/activities/ActivityDto";
import { activityService } from "../../api_services/activityApi/ActivityApiService";

export function useActivitiesByDate(
    planId?: string,
    date?: string
) {
    const [activities, setActivities] =
        useState<ActivityDto[]>([]);

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {

        if (!planId || !date)
            return;

        setLoading(true);

        activityService
            .getByDate(planId, date)
            .then(setActivities)
            .finally(() => setLoading(false));

    }, [planId, date]);

    return {
        activities,
        loading,
    };
}