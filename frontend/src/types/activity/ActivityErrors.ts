import type { CreateActivityDto } from "../../models/activities/CreateActivityDto";

export type ActivityErrors = Partial<Record<keyof CreateActivityDto, string>>;