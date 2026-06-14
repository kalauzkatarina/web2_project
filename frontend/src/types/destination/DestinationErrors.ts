import type { CreateDestinationDto } from "../../models/destinations/CreateDestinationDto";

export type DestinationErrors = Partial<Record<keyof CreateDestinationDto, string>>;