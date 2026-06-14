import { useState } from "react";
import type { CreateDestinationDto } from "../../models/destinations/CreateDestinationDto";
import type { DestinationFormProps } from "../../types/props/destination/DestinationFormProps";
import type { DestinationErrors } from "../../types/destination/DestinationErrors";
import { validateDestination } from "../../api_services/validators/destination/DestinationValidator";

export default function DestinationForm({
    initialValues,
    onSubmit,
    submitText,
    planStartDate,
    planEndDate
}: DestinationFormProps) {

    const [form, setForm] = useState<CreateDestinationDto>(initialValues);
    const [errors, setErrors] = useState<DestinationErrors>({});

    const clearError = (field: string) => {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const ErrorMsg = ({ message }: { message?: string }) =>
        message ? (
            <p className="text-red-500 text-xs mt-1">
                {message}
            </p>
        ) : null;

    const inputClass = (hasError: boolean) =>
        `form-input ${hasError ? "border-red-400" : ""}`;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        clearError(name);
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const validationErrors = validateDestination(form, planStartDate, planEndDate);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        await onSubmit(form);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            <div>
                <label className="form-label">
                    Destination Name <span className="text-red-500">*</span>
                </label>

                <div>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Paris"
                        className={inputClass(!!errors.name)}
                    />
                    <ErrorMsg message={errors.name} />
                </div>
            </div>

            <div>
                <label className="form-label">
                    Location <span className="text-red-500">*</span>
                </label>

                <div>
                    <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="France"
                        className={inputClass(!!errors.location)}
                    />
                    <ErrorMsg message={errors.location} />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">

                <div>
                    <label className="form-label">
                        Arrival Date <span className="text-red-500">*</span>
                    </label>

                    <input
                        type="date"
                        name="arrivalDate"
                        value={form.arrivalDate}
                        min={planStartDate}
                        max={planEndDate}
                        onChange={handleChange}
                        className={inputClass(!!errors.arrivalDate)}
                    />
                    {errors.arrivalDate && <ErrorMsg message={errors.arrivalDate} />}
                </div>

                <div>
                    <label className="form-label">
                        Departure Date <span className="text-red-500">*</span>
                    </label>

                    <input
                        type="date"
                        name="departureDate"
                        value={form.departureDate}
                        min={form.arrivalDate || planStartDate}
                        max={planEndDate}
                        onChange={handleChange}
                        className={inputClass(!!errors.departureDate)}
                    />
                    {errors.departureDate && <ErrorMsg message={errors.departureDate} />}
                </div>

            </div>

            <div>
                <label className="form-label">
                    Description
                </label>

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe this destination..."
                    className={inputClass(!!errors.description)}
                />
            </div>

            <div className="flex justify-center pt-4">

                <button
                    type="submit"
                    className="
                        px-10
                        py-4
                        rounded-2xl
                        bg-amber-500
                        text-white
                        font-semibold
                        hover:bg-amber-600
                    "
                >
                    {submitText}
                </button>

            </div>

        </form>
    );
}