import { useEffect, useState } from "react";
import type { DestinationDto } from "../../models/destinations/DestinationDto";
import { destinationService } from "../../api_services/destinationApi/DestinationApiService";

export function useDestination(id?: string, shareToken?: string) {

    const [destination, setDestination] =
        useState<DestinationDto | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        if (!id) return;

        destinationService
            .getById(id, shareToken)
            .then(setDestination)
            .catch(() => setDestination(null))
            .finally(() => setLoading(false));

    }, [id, shareToken]);

    return { destination, loading };
}