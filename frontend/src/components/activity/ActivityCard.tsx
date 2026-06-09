import { HiOutlineLocationMarker, } from "react-icons/hi";
import { MdOutlineEuro, } from "react-icons/md";
import { FiClock, FiCalendar, } from "react-icons/fi";
import { getActivityStatus, getExpenseCategory } from "../../helpers/activityHelper";
import type { ActivityCardProps } from "../../types/props/activity/ActivityCardProps";

export default function ActivityCard({
    activity,
}: ActivityCardProps) {

    return (
        <div
            className="
                bg-stone-50
                rounded-2xl
                p-5
                border
                border-stone-200
                hover:border-amber-200
                transition
            "
        >
            <div className="flex justify-between items-start">

                <div>

                    <h4 className="text-lg font-bold text-stone-900">
                        {activity.title}
                    </h4>

                    <div className="flex items-center gap-2 mt-2 text-stone-500">
                        <HiOutlineLocationMarker className="text-amber-500" />
                        <span>{activity.location}</span>
                    </div>

                </div>

                <div
                    className="
                        flex
                        items-center
                        gap-1
                        px-3
                        py-1
                        rounded-full
                        bg-white
                        border
                        border-amber-200
                        text-amber-700
                        font-semibold
                    "
                >
                    <MdOutlineEuro />
                    {activity.estimatedCost}
                </div>

            </div>

            {activity.description && (
                <p className="mt-4 text-stone-600">
                    {activity.description}
                </p>
            )}

            <div className="flex flex-wrap gap-3 mt-5">

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        px-3
                        py-2
                        rounded-xl
                        bg-white
                        border
                        border-stone-200
                        text-sm
                    "
                >
                    <FiCalendar />
                    {new Date(activity.date).toLocaleDateString()}
                </div>

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        px-3
                        py-2
                        rounded-xl
                        bg-white
                        border
                        border-stone-200
                        text-sm
                    "
                >
                    <FiClock />
                    {activity.time}
                </div>

                <div
                    className="
                        px-3
                        py-2
                        rounded-xl
                        bg-amber-100
                        text-amber-700
                        text-sm
                        font-medium
                    "
                >
                    {getActivityStatus(activity.status)}
                </div>

                <div
                    className="
                        px-3
                        py-2
                        rounded-xl
                        bg-stone-200
                        text-stone-700
                        text-sm
                        font-medium
                    "
                >
                    {getExpenseCategory(activity.category)}
                </div>

            </div>

        </div>
    );
}