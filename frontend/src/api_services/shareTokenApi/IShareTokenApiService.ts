import type { CreateShareTokenDto } from "../../models/shareToken/CreateShareTokenDto";
import type { SharedTravelPlanDto } from "../../models/shareToken/SharedTravelPlanDto";
import type { ShareTokenDto } from "../../models/shareToken/ShareTokenDto";

export interface IShareTokenApiService {

    create(data: CreateShareTokenDto, email?: string): Promise<ShareTokenDto>;
    getByToken(token: string): Promise<SharedTravelPlanDto>;
}