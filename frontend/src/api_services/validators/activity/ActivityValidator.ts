import type { CreateActivityDto } from "../../../models/activities/CreateActivityDto";
import type { ActivityErrors } from "../../../types/activity/ActivityErrors";

export function validateActivity(
    form: CreateActivityDto,
    destinationStartDate?: string,
    destinationEndDate?: string
): ActivityErrors {
    const errors: ActivityErrors = {};

    if (!form.title?.trim())
        errors.title = "Title is required.";
    else if (form.title.length > 100)
        errors.title = "Title cannot exceed 100 characters.";

    if (form.location && form.location.length > 200)
        errors.location = "Location cannot exceed 200 characters.";

    if (!form.date)
        errors.date = "Date is required.";
    else if (destinationStartDate && form.date < destinationStartDate)
        errors.date = `Date cannot be before destination arrival (${destinationStartDate}).`;
    else if (destinationEndDate && form.date > destinationEndDate)
        errors.date = `Date cannot be after destination departure (${destinationEndDate}).`;

    if (!form.time)
        errors.time = "Time is required.";

    if (form.estimatedCost < 0)
        errors.estimatedCost = "Estimated cost cannot be negative.";

    if (form.description && form.description.length > 500)
        errors.description = "Description cannot exceed 500 characters.";

    return errors;
}