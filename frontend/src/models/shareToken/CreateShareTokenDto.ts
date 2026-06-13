import type { AccessType } from "../../enums/AccessType";

export interface CreateShareTokenDto {
    planId: string;
    accessType: AccessType;
    daysValid?: number;
}