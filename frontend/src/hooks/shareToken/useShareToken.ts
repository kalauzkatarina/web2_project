import { useState } from "react";
import { shareTokenService } from "../../api_services/shareTokenApi/ShareTokenApiService";
import type { CreateShareTokenDto } from "../../models/shareToken/CreateShareTokenDto";
import type { ShareTokenDto } from "../../models/shareToken/ShareTokenDto";

export const useShareToken = () => {

    const [loading, setLoading] = useState(false);

    const [shareData, setShareData] =
        useState<ShareTokenDto | null>(null);

    const createShareToken = async (
        dto: CreateShareTokenDto,
        email?: string
    ) => {

        setLoading(true);

        try {

            const result =
                await shareTokenService.create(
                    dto,
                    email
                );

            setShareData(result);

            return result;

        } finally {

            setLoading(false);
        }
    };

    return {
        loading,
        shareData,
        createShareToken
    };
};