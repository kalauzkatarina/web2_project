import { useEffect, useState } from "react";
import type { ActivityDto } from "../../models/activities/ActivityDto";
import { activityService } from "../../api_services/activityApi/ActivityApiService";

export function useActivity(id?: string) {

    const [activity, setActivity] =
        useState<ActivityDto | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        if (!id)
            return;

        activityService
            .getById(id)
            .then(setActivity)
            .finally(() => setLoading(false));

    }, [id]);

    return {
        activity,
        loading,
    };
}