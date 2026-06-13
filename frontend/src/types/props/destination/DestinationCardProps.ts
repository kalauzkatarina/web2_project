import type { DestinationDto } from "../../../models/destinations/DestinationDto";

export type DestinationCardProps = {
    destination: DestinationDto;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onActivityEdit?: (id: string) => void;
    onActivityDelete?: (id: string) => void;
    shareToken?: string;
}