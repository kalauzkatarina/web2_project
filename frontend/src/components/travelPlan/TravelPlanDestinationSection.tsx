import type { TravelPlanDestinationsSectionProps } from "../../types/props/travelPlan/TravelPlanDestinationSectionProps";
import DestinationCard from "../destination/DestinationCard";
import { HiOutlineCalendar } from "react-icons/hi";

export default function TravelPlanDestinationsSection({ plan, navigate, onEditDestination, onDeleteDestination, onEditActivity, onDeleteActivity, showActions = true, shareToken  }: TravelPlanDestinationsSectionProps) {
     const addDestinationUrl = shareToken
        ? `/plans/${plan.id}/destinations/create?shareToken=${shareToken}`
        : `/plans/${plan.id}/destinations/create`;

    return (
        <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-stone-900">
                    Destinations
                </h2>

                {showActions && (
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate(addDestinationUrl)}
                            className="
                                px-5
                                py-3
                                rounded-xl
                                bg-amber-500
                                text-white
                                font-medium
                                hover:bg-amber-600
                                transition
                            "
                        >
                            + Add Destination
                        </button>

                        <button
                            onClick={() =>
                                navigate(`/plans/${plan.id}/calendar`)
                            }
                            className="
                    flex
                    items-center
                    gap-2
                    px-5
                    py-3
                    rounded-xl
                    bg-white
                    border
                    border-stone-200
                    text-stone-700
                    font-medium
                    hover:bg-stone-50
                    transition
                "
                        >
                            <HiOutlineCalendar
                                size={20}
                                className="text-amber-500"
                            />
                            Calendar View
                        </button>
                    </div>
                )}
            </div>

            {plan.destinations.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-stone-500 border border-stone-200">No destinations added yet.</div>
            ) : (
                <div className="space-y-6">
                    {plan.destinations.map((dest: any) => (
                        <DestinationCard
                            key={dest.id}
                            destination={dest}
                            onEdit={onEditDestination}
                            onDelete={onDeleteDestination}
                            onActivityEdit={onEditActivity}
                            onActivityDelete={onDeleteActivity}
                            shareToken={shareToken}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}