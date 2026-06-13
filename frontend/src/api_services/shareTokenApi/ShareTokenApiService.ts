import api from "../api";
import type { IShareTokenApiService } from "./IShareTokenApiService";
import type { CreateShareTokenDto } from "../../models/shareToken/CreateShareTokenDto";
import type { ShareTokenDto } from "../../models/shareToken/ShareTokenDto";
import type { SharedTravelPlanDto } from "../../models/shareToken/SharedTravelPlanDto";

export const shareTokenService: IShareTokenApiService = {

    async create(data: CreateShareTokenDto, email?: string): Promise<ShareTokenDto> {

        const url = email
            ? `/shareToken?email=${encodeURIComponent(email)}`
            : "/shareToken";

        const res =
            await api.post<ShareTokenDto>(
                url,
                data
            );

        return res.data;
    },

    async getByToken(token: string): Promise<SharedTravelPlanDto> {

        const res =
            await api.get<SharedTravelPlanDto>(
                `/shareToken/${token}`
            );

        return res.data;
    }
};