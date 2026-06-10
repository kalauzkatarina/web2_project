import type { CreateTravelPlanDto } from "../../../models/travelPlans/CreateTravelPlanDto";

export interface TravelPlanFormProps {
    initialValues: CreateTravelPlanDto;

    onSubmit: (
        data: CreateTravelPlanDto
    ) => Promise<void>;

    submitText: string;
}