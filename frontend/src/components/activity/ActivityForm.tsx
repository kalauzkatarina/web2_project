import { useState } from "react";
import type { CreateActivityDto } from "../../models/activities/CreateActivityDto";
import { ActivityStatus } from "../../enums/ActivityStatus";
import { ExpenseCategory } from "../../enums/ExpenseCategory";
import type { ActivityFormProps } from "../../types/props/activity/ActivityFormProps";
import type { ActivityErrors } from "../../types/activity/ActivityErrors";
import { validateActivity } from "../../api_services/validators/activity/ActivityValidator";

export default function ActivityForm({
    initialValues,
    onSubmit,
    submitText,
    destinationStartDate,
    destinationEndDate
}: ActivityFormProps) {

    const [form, setForm] = useState<CreateActivityDto>(initialValues);
    const [errors, setErrors] = useState<ActivityErrors>({});

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
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]:
                name === "estimatedCost"
                    ? Number(value)
                    : name === "status" || name === "category"
                        ? Number(value)
                        : value,
        }));

        clearError(name);
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const validationErrors = validateActivity(
            form,
            destinationStartDate,
            destinationEndDate
        );

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
                    Title <span className="text-red-500">*</span>
                </label>

                <div>
                    <input
                        name="title"
                        value={form.title || ""}
                        placeholder="Title of the activity"
                        onChange={handleChange}
                        className={inputClass(!!errors.title)}
                    />
                    <ErrorMsg message={errors.title} />
                </div>
            </div>

            <div>
                <label className="form-label">
                    Location
                </label>

                <div>
                    <input
                        name="location"
                        value={form.location || ""}
                        placeholder="Location of the activity"
                        onChange={handleChange}
                        className={inputClass(!!errors.location)}
                    />
                    <ErrorMsg message={errors.location} />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">

                <div>
                    <label className="form-label">
                        Date <span className="text-red-500">*</span>
                    </label>

                    <div>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            min={destinationStartDate}
                            max={destinationEndDate}
                            onChange={handleChange}
                            className={inputClass(!!errors.date)}
                        />
                        <ErrorMsg message={errors.date} />
                    </div>
                </div>

                <div>
                    <label className="form-label">
                        Time <span className="text-red-500">*</span>
                    </label>

                    <div>
                        <input
                            type="time"
                            name="time"
                            value={form.time}
                            onChange={handleChange}
                            className={inputClass(!!errors.time)}
                        />
                        <ErrorMsg message={errors.time} />
                    </div>
                </div>

            </div>

            <div>
                <label className="form-label">
                    Estimated Cost
                </label>

                <div>
                    <input
                        type="number"
                        name="estimatedCost"
                        value={form.estimatedCost !== undefined ? form.estimatedCost : ""}
                        placeholder="2500"
                        onChange={handleChange}
                        onFocus={() => {
                            if (form.estimatedCost === 0) {
                                setForm(prev => ({
                                    ...prev,
                                    estimatedCost: undefined as any
                                }));
                            }
                        }}
                        className={inputClass(!!errors.estimatedCost)}
                    />
                    <ErrorMsg message={errors.estimatedCost} />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">

                <div>
                    <label className="form-label">
                        Status
                    </label>

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="form-input"
                    >
                        {Object.entries(ActivityStatus).map(([key, value]) => (
                            <option
                                key={key}
                                value={key}
                            >
                                {value}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="form-label">
                        Category
                    </label>

                    <select name="category" value={form.category} onChange={handleChange} className="form-input">
                        {Object.entries(ExpenseCategory)
                            .filter(([key]) => isNaN(Number(key))) //ovo stavlja "food", "transport"...
                            .map(([key, value]) => (
                                <option key={value} value={value}>{key}</option>
                            ))}
                    </select>
                </div>

            </div>

            <div>
                <label className="form-label">
                    Description
                </label>

                <div>
                    <textarea
                        name="description"
                        value={form.description || ""}
                        placeholder="Describe this activity..."
                        onChange={handleChange}
                        rows={3}
                        className={inputClass(!!errors.description)}
                    />
                    <ErrorMsg message={errors.description} />
                </div>
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