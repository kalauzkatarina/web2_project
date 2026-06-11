import { useNavigate } from "react-router-dom";
import { HiOutlineLocationMarker } from "react-icons/hi";
import type { TravelPlanCardProps } from "../../types/props/travelPlan/TravelPlanCardProps";

export default function TravelPlanCard({
    plan,
}: TravelPlanCardProps) {

    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/plans/${plan.id}`)}
            className="
                flex
                bg-white
                rounded-[2rem]
                overflow-hidden
                border
                border-stone-200
                cursor-pointer
                transition-all
                hover:-translate-y-1
                hover:shadow-xl
                hover:border-amber-300
            "
        >
            <div className="w-2 bg-amber-500" />

            <div className="p-7 flex-1">
                <h3 className="text-2xl font-bold text-stone-900">
                    {plan.title}
                </h3>

                <p className="text-stone-500 mt-3 line-clamp-2">
                    {plan.description}
                </p>

                {plan.destinations.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                        {plan.destinations
                            .slice(0, 3)
                            .map((destination) => (
                                <div
                                    key={destination.id}
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                        px-3
                                        py-1
                                        rounded-full
                                        bg-amber-50
                                        text-amber-700
                                        text-sm
                                    "
                                >
                                    <HiOutlineLocationMarker />
                                    {destination.name}
                                </div>
                            ))}
                    </div>
                )}

                <div className="mt-6 pt-5 border-t border-stone-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs uppercase text-stone-400">
                            Travel Dates
                        </p>
                        <p className="font-medium text-stone-700 mt-1">
                            {new Date(plan.startDate).toLocaleDateString()}
                            {" - "}
                            {new Date(plan.endDate).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs uppercase text-stone-400">
                            Budget
                        </p>
                        <p className="text-2xl font-bold text-amber-600 mt-1">
                            €{plan.plannedBudget}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}