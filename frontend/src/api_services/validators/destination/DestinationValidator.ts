import type { CreateDestinationDto } from "../../../models/destinations/CreateDestinationDto";
import type { DestinationErrors } from "../../../types/destination/DestinationErrors";

export function validateDestination(
    form: CreateDestinationDto,
    planStartDate?: string,
    planEndDate?: string
): DestinationErrors {
    const errors: DestinationErrors = {};

    if (!form.name?.trim())
        errors.name = "Destination name is required.";
    else if (form.name.length > 100)
        errors.name = "Name cannot exceed 100 characters.";

    if (!form.location?.trim())
        errors.location = "Location is required.";
    else if (form.location.length > 200)
        errors.location = "Location cannot exceed 200 characters.";

    if (!form.arrivalDate)
        errors.arrivalDate = "Arrival date is required.";
    else if (planStartDate && form.arrivalDate < planStartDate)
        errors.arrivalDate = `Arrival cannot be before plan start (${planStartDate}).`;
    else if (planEndDate && form.arrivalDate > planEndDate)
        errors.arrivalDate = `Arrival cannot be after plan end (${planEndDate}).`;

    if (!form.departureDate)
        errors.departureDate = "Departure date is required.";
    else if (form.arrivalDate && form.departureDate < form.arrivalDate)
        errors.departureDate = "Departure cannot be before arrival date.";
    else if (planEndDate && form.departureDate > planEndDate)
        errors.departureDate = `Departure cannot be after plan end (${planEndDate}).`;

    if (form.description && form.description.length > 500)
        errors.description = "Description cannot exceed 500 characters.";

    return errors;
}