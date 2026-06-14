import type { CreateTravelPlanDto } from "../../../models/travelPlans/CreateTravelPlanDto";
import type { TravelPlanErrors } from "../../../types/travelPlan/TravelPlanErrors";

export function validateTravelPlan(form: CreateTravelPlanDto): TravelPlanErrors {
    const errors: TravelPlanErrors = {};

    if (!form.title?.trim())
        errors.title = "Title is required.";
    else if (form.title.length > 100)
        errors.title = "Title cannot exceed 100 characters.";

    if (form.description && form.description.length > 500)
        errors.description = "Description cannot exceed 500 characters.";

    if (!form.startDate)
        errors.startDate = "Start date is required.";

    if (!form.endDate)
        errors.endDate = "End date is required.";
    else if (form.startDate && form.endDate < form.startDate)
        errors.endDate = "End date cannot be before start date.";

    if (form.plannedBudget < 0)
        errors.plannedBudget = "Budget cannot be negative.";

    return errors;
}