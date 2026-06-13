import { HiOutlineLocationMarker, HiOutlineTrash } from "react-icons/hi";
import { FiCalendar, FiEdit2 } from "react-icons/fi";
import ActivityCard from "../activity/ActivityCard";
import type { DestinationCardProps } from "../../types/props/destination/DestinationCardProps";
import { useNavigate } from "react-router-dom";

export default function DestinationCard({
    destination,
    onEdit,
    onDelete,
    onActivityEdit,
    onActivityDelete,
}: DestinationCardProps) {

    const navigate = useNavigate();

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

                <div className="flex gap-2">

                    {onEdit && <button
                        title="Edit Destination"
                        onClick={() => onEdit?.(destination.id)}
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
                    }

                    {onDelete &&
                        <button
                            title="Delete Destination"
                            onClick={() => onDelete?.(destination.id)}
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
                    }

                </div>

            </div>

            <div
                className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-stone-500
                    mt-4
                "
            >
                <FiCalendar />
                {new Date(destination.arrivalDate).toLocaleDateString()}
                {" - "}
                {new Date(destination.departureDate).toLocaleDateString()}
            </div>

            {destination.description && (
                <p className="mt-5 text-stone-600 leading-relaxed">
                    {destination.description}
                </p>
            )}

            <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-stone-900">Activities</h4>

                {onActivityEdit &&
                    <button
                        onClick={() => navigate(`/destinations/${destination.id}/activities/create`)}
                        className="px-5 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition shadow-sm"
                    >
                        + Add Activity
                    </button>
                }
            </div>

            {destination.activities.length > 0 ? (
                <div className="space-y-3">
                    {destination.activities.map((activity) => (
                        <ActivityCard
                            key={activity.id}
                            activity={activity}
                            onEdit={onActivityEdit}
                            onDelete={onActivityDelete}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-stone-400 italic">No activities added yet.</p>
            )}
        </div>
    );
}