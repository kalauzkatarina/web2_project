import { useState } from "react";
import type { CreateTravelPlanDto } from "../../models/travelPlans/CreateTravelPlanDto";
import type { TravelPlanFormProps } from "../../types/props/travelPlan/TravelPlanFormProps";

export default function TravelPlanForm({
    initialValues,
    onSubmit,
    submitText,
}: TravelPlanFormProps) {

    const [form, setForm] =
        useState<CreateTravelPlanDto>(initialValues);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                name === "plannedBudget"
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
                <label className="block mb-2 text-sm font-medium text-stone-700">
                    Journey Title
                </label>

                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Summer in Italy"
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
                        transition-all"
                />
            </div>


            <div>
                <label className="block mb-2 text-sm font-medium text-stone-700">
                    Description
                </label>

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your trip..."
                    className="
                        w-full 
                        p-4 
                        rounded-2xl 
                        border 
                        border-stone-200 
                        h-32 
                        shadow-sm
                        bg-[#fafaf9]
                        focus:border-amber-500
                        focus:bg-white
                        focus:outline-none
                        transition-all"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-4">

                <div>
                    <label className="block mb-2 text-sm font-medium text-stone-700">
                        Start Date
                    </label>

                    <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
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
                        transition-all"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-stone-700">
                        End Date
                    </label>

                    <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
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
                        transition-all"
                    />
                </div>

            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-stone-700">
                    Planned Budget (€)
                </label>

                <input
                    type="number"
                    name="plannedBudget"
                    value={form.plannedBudget || ""}
                    onChange={handleChange}
                    placeholder="2500"
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
                        transition-all
                    "
                />
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-stone-700">
                    General Notes
                </label>

                <textarea
                    name="generalNotes"
                    value={form.generalNotes}
                    onChange={handleChange}
                    placeholder="Anything important for this trip..."
                    className="
                        w-full 
                        p-4 
                        rounded-2xl 
                        border 
                        border-stone-200 
                        h-32  
                        shadow-sm
                        bg-[#fafaf9]
                        focus:border-amber-500
                        focus:bg-white
                        focus:outline-none
                        transition-all"
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
                        transition
                        shadow-lg
                        shadow-amber-500/20
                    "
                >
                    {submitText}
                </button>
            </div>
        </form>
    );
}