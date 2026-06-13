import { FiEdit2, FiShare2 } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
import type { TravelPlanHeaderProps } from "../../types/props/travelPlan/TravelPlanHeaderProps";
import { AccessType } from "../../enums/AccessType";

export default function TravelPlanHeader({
    plan,
    onEdit,
    onDelete,
    onShare,
    showActions = true,
    accessType,
    showEditButton = false
}: TravelPlanHeaderProps) {
    return (
        <div
            className="
                bg-white
                rounded-[2rem]
                p-10
                border
                border-stone-200
                shadow-sm
            "
        >
            <p
                className="
                    uppercase
                    tracking-widest
                    text-amber-600
                    text-sm
                    font-bold
                "
            >
                Travel Plan
            </p>

            <div className="flex justify-between items-start mt-3">
                <h1 className="text-5xl font-bold text-stone-900">
                    {plan.title}
                </h1>

                {showActions ? (
                    <div className="flex gap-2">
                        <button
                            title="Share Journey"
                            onClick={onShare}
                            className="
                                p-3
                                rounded-2xl
                                bg-white
                                border
                                border-stone-200
                                text-stone-500
                                shadow-sm
                                hover:text-blue-500
                                hover:border-blue-300
                                hover:shadow
                                transition
                            "
                        >
                            <FiShare2 size={18} />
                        </button>

                        <button
                            title="Edit Journey"
                            onClick={onEdit}
                            className="
                                p-3
                                rounded-2xl
                                bg-white
                                border
                                border-stone-200
                                text-stone-500
                                shadow-sm
                                hover:text-amber-600
                                hover:border-amber-300
                                hover:shadow
                                transition
                            "
                        >
                            <FiEdit2 size={18} />
                        </button>

                        <button
                            title="Delete Journey"
                            onClick={onDelete}
                            className="
                                p-3
                                rounded-2xl
                                bg-white
                                border
                                border-stone-200
                                text-stone-500
                                shadow-sm
                                hover:text-red-500
                                hover:border-red-300
                                hover:shadow
                                transition
                            "
                        >
                            <HiOutlineTrash size={18} />
                        </button>
                    </div>
                ) : showEditButton ? (
                    <button
                        title="Edit Journey"
                        onClick={onEdit}
                        className="
                            p-3
                            rounded-2xl
                            bg-white
                            border
                            border-stone-200
                            text-stone-500
                            shadow-sm
                            hover:text-amber-600
                            hover:border-amber-300
                            hover:shadow
                            transition
                        "
                    >
                        <FiEdit2 size={18} />
                    </button>
                ) : (
                    <div
                        className={`
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            font-semibold
                            ${accessType === AccessType.Edit
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }
                        `}
                    >
                        {accessType === AccessType.Edit
                            ? "Edit Access"
                            : "View Access"}
                    </div>
                )}
            </div>

            <p className="mt-5 text-stone-500 max-w-3xl">
                {plan.description}
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-10">
                <div className="bg-amber-50 rounded-2xl p-5">
                    <div className="text-stone-500">
                        Planned Budget
                    </div>

                    <div className="text-3xl font-bold text-amber-600 mt-2">
                        €{plan.plannedBudget}
                    </div>
                </div>

                <div className="bg-stone-50 rounded-2xl p-5">
                    <div className="text-stone-500">
                        Start Date
                    </div>

                    <div className="font-semibold mt-2">
                        {new Date(plan.startDate).toLocaleDateString()}
                    </div>
                </div>

                <div className="bg-stone-50 rounded-2xl p-5">
                    <div className="text-stone-500">
                        End Date
                    </div>

                    <div className="font-semibold mt-2">
                        {new Date(plan.endDate).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {plan.generalNotes && (
                <div className="mt-10">
                    <h3 className="text-xl font-bold text-stone-900">
                        Notes
                    </h3>

                    <p className="mt-3 text-stone-600">
                        {plan.generalNotes}
                    </p>
                </div>
            )}
        </div>
    );
}