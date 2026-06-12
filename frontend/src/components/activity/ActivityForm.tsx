import { useState } from "react";
import type { CreateActivityDto } from "../../models/activities/CreateActivityDto";
import { ActivityStatus } from "../../enums/ActivityStatus";
import { ExpenseCategory } from "../../enums/ExpenseCategory";
import type { ActivityFormProps } from "../../types/props/activity/ActivityFormProps";

export default function ActivityForm({
    initialValues,
    onSubmit,
    submitText,
}: ActivityFormProps) {

    const [form, setForm] =
        useState<CreateActivityDto>(initialValues);

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
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        await onSubmit(form);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            <div>
                <label className="form-label">
                    Title
                </label>

                <input
                    name="title"
                    value={form.title || ""}
                    placeholder="Title of the activity"
                    onChange={handleChange}
                    className="form-input"
                />
            </div>

            <div>
                <label className="form-label">
                    Location
                </label>

                <input
                    name="location"
                    value={form.location || ""}
                    placeholder="Location of the activity"
                    onChange={handleChange}
                    className="form-input"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-4">

                <div>
                    <label className="form-label">
                        Date
                    </label>

                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <div>
                    <label className="form-label">
                        Time
                    </label>

                    <input
                        type="time"
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

            </div>

            <div>
                <label className="form-label">
                    Estimated Cost
                </label>

                <input
                    type="number"
                    name="estimatedCost"
                    value={form.estimatedCost || ""}
                    placeholder="2500"
                    onChange={handleChange}
                    className="form-input"
                />
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

                <textarea
                    name="description"
                    value={form.description || ""}
                    placeholder="Describe your trip..."
                    onChange={handleChange}
                    className="form-input h-32"
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