import type { CreateActivityDto } from "../../../models/activities/CreateActivityDto";

export interface ActivityFormProps {
    initialValues: CreateActivityDto;

    submitText: string;

    onSubmit: (
        data: CreateActivityDto
    ) => Promise<void>;

    destinationStartDate?: string;
    destinationEndDate?: string;
}