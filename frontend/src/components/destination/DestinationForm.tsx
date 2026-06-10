import { useState } from "react";
import type { CreateDestinationDto } from "../../models/destinations/CreateDestinationDto";
import type { DestinationFormProps } from "../../types/props/destination/DestinationFormProps";

export default function DestinationForm({
    initialValues,
    onSubmit,
    submitText,
}: DestinationFormProps) {

    const [form, setForm] =
        useState<CreateDestinationDto>(initialValues);

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
                <label className="block mb-2 text-sm font-medium text-stone-700">
                    Destination Name
                </label>

                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Paris"
                    className="
                        w-full
                        p-4
                        rounded-2xl
                        border
                        border-stone-200
                        shadow-sm
                        bg-[#fafaf9]
                        focus:border-amber-500
                        focus:bg-white
                        focus:outline-none
                    "
                />
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-stone-700">
                    Location
                </label>

                <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="France"
                    className="
                        w-full
                        p-4
                        rounded-2xl
                        border
                        border-stone-200
                        shadow-sm
                        bg-[#fafaf9]
                        focus:border-amber-500
                        focus:bg-white
                        focus:outline-none
                    "
                />
            </div>

            <div className="grid md:grid-cols-2 gap-4">

                <div>
                    <label className="block mb-2 text-sm font-medium text-stone-700">
                        Arrival Date
                    </label>

                    <input
                        type="date"
                        name="arrivalDate"
                        value={form.arrivalDate}
                        onChange={handleChange}
                        className="
                            w-full
                            p-4
                            rounded-2xl
                            border
                            border-stone-200
                            shadow-sm
                            bg-[#fafaf9]
                        "
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-stone-700">
                        Departure Date
                    </label>

                    <input
                        type="date"
                        name="departureDate"
                        value={form.departureDate}
                        onChange={handleChange}
                        className="
                            w-full
                            p-4
                            rounded-2xl
                            border
                            border-stone-200
                            shadow-sm
                            bg-[#fafaf9]
                        "
                    />
                </div>

            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-stone-700">
                    Description
                </label>

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe this destination..."
                    className="
                        w-full
                        h-32
                        p-4
                        rounded-2xl
                        border
                        border-stone-200
                        shadow-sm
                        bg-[#fafaf9]
                    "
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