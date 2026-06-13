import { useEffect, useState } from "react";
import type { TravelPlanDto } from "../../models/travelPlans/TravelPlanDto";
import { travelPlanService } from "../../api_services/travelPlanApi/TravelPlanApiService";
import { getUserRole } from "../../helpers/jwt";

export function useTravelPlans() {
    const [plans, setPlans] = useState<TravelPlanDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [switching, setSwitching] = useState(false);

    const [filter, setFilter] = useState<"my" | "all">("my");

    const role = getUserRole(localStorage.getItem("token") || "");

    useEffect(() => {
        loadPlans();
    }, [filter]); // Hook se automatski ponovo pokreće kada se filter promeni

    const loadPlans = async () => {
        if (!loading) {
            setSwitching(true);
        }

        try {
            const data =
                role.toLowerCase() === "admin" && filter === "all"
                    ? await travelPlanService.getAllAdmin()
                    : await travelPlanService.getAll();

            setPlans(data);
        } catch (error) {
            console.error("Greška pri učitavanju planova:", error);
        } finally {
            setLoading(false);
            setSwitching(false);
        }
    };

    return {
        plans,
        loading,
        switching,
        role,
        filter,
        setFilter,
        refresh: loadPlans,
    };
}