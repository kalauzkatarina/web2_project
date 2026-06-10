import { useEffect, useState } from "react";
import type { DestinationDto } from "../../models/destinations/DestinationDto";
import { destinationService } from "../../api_services/destinationApi/DestinationApiService";

export function useDestination(id?: string) {

    const [destination, setDestination] =
        useState<DestinationDto | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        if (!id) return;

        destinationService
            .getById(id)
            .then(setDestination)
            .finally(() => setLoading(false));

    }, [id]);

    return { destination, loading };
}