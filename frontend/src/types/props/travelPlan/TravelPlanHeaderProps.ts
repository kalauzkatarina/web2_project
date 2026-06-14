import type { AccessType } from "../../../enums/AccessType";
import type { TravelPlanDto } from "../../../models/travelPlans/TravelPlanDto";

export type TravelPlanHeaderProps = {
    plan: TravelPlanDto;
    onEdit?: () => void;
    onDelete?: () => void;
    onShare?: () => void;

    showActions?: boolean;
    accessType?: AccessType;
    showEditButton?: boolean;
    onDownloadPdf?: () => void;
}