import type { AccessType } from "../../enums/AccessType";

export interface ShareTokenDto {
    token: string;
    shareUrl: string;
    accessType: AccessType;
    expiresAt?: string;
}