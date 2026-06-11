import type { ActivityDto } from "../../../models/activities/ActivityDto";

export type ActivityCardProps = {
    activity: ActivityDto;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}