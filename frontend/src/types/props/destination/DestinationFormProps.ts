import type { CreateDestinationDto } from "../../../models/destinations/CreateDestinationDto";

export interface DestinationFormProps {
    initialValues: CreateDestinationDto;

    submitText: string;

    onSubmit: (
        data: CreateDestinationDto
    ) => Promise<void>;

    planStartDate?: string;
    planEndDate?: string;
}