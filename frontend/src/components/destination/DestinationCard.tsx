import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiCalendar } from "react-icons/fi";
import ActivityCard from "../activity/ActivityCard";
import type { DestinationCardProps } from "../../types/props/destination/DestinationCardProps";

export default function DestinationCard({
    destination,
}: DestinationCardProps) {
    return (
        <div
            className="
                rounded-[2rem]
                p-6
                bg-gradient-to-br
                from-amber-50
                to-white
                border
                border-amber-100
                shadow-sm
            "
        >
            <div className="flex justify-between items-start">

                <div>
                    <h3 className="text-2xl font-bold text-stone-900">
                        {destination.name}
                    </h3>

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-1
                            rounded-full
                            bg-white
                            border
                            border-amber-200
                            text-stone-700
                            mt-3
                        "
                    >
                        <HiOutlineLocationMarker className="text-amber-500" />
                        {destination.location}
                    </div>
                </div>

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-stone-500
                    "
                >
                    <FiCalendar />
                    {new Date(destination.arrivalDate).toLocaleDateString()}
                </div>

            </div>

            {destination.description && (
                <p className="mt-5 text-stone-600 leading-relaxed">
                    {destination.description}
                </p>
            )}

            {destination.activities.length > 0 && (
                <div className="mt-6">

                    <div className="flex items-center justify-between mb-4">

                        <h4 className="font-bold text-stone-900">
                            Activities
                        </h4>

                        <div
                            className="
                                px-3
                                py-1
                                rounded-full
                                bg-amber-100
                                text-amber-700
                                text-sm
                                font-semibold
                            "
                        >
                            {destination.activities.length}
                        </div>

                    </div>

                    <div className="space-y-3">
                        {destination.activities.map((activity) => (
                            <ActivityCard
                                key={activity.id}
                                activity={activity}
                            />
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
}