import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { HiArrowLeft } from "react-icons/hi";
import ActivityCard from "../../components/activity/ActivityCard";
import { useActivitiesByDate } from "../../hooks/activity/useActivitiesByDate";
import { useActivitiesByPlan } from "../../hooks/activity/useActivitesByPlan";
import { useTravelPlan } from "../../hooks/travelPlan/useTravelPlan";
import { formatDateToISO } from "../../helpers/dateHelper";

export default function ActivityCalendarPage() {

    const { id } = useParams();
    const { plan } = useTravelPlan(id);
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const dateString = formatDateToISO(selectedDate);
    const { activities, loading, } = useActivitiesByDate(id, dateString);
    const { activities: allActivities, } = useActivitiesByPlan(id);
    const activityDates = new Set(allActivities.map(a => a.date.split("T")[0]));

    //ovo da otvori kalendar gde pocinje travelPlan
    useEffect(() => {
        if (plan?.startDate) {
            setSelectedDate(new Date(plan.startDate));
        }
    }, [plan]);

    return (
        <div className="min-h-screen bg-[#fafaf9]">

            <div className="max-w-6xl mx-auto px-6 py-10">

                <button
                    onClick={() => navigate(-1)}
                    className="
                        flex
                        items-center
                        gap-2
                        text-stone-500
                        hover:text-amber-600
                        mb-6
                    "
                >
                    <HiArrowLeft />
                    Back to Journey
                </button>

                <h1 className="text-5xl font-bold text-stone-900 mb-8">
                    Activity Calendar
                </h1>

                <div
                    className="
                        bg-white
                        rounded-[2rem]
                        border
                        border-stone-200
                        p-8
                        shadow-sm
                    "
                >

                    <Calendar
                        value={selectedDate}
                        onChange={(value) =>
                            setSelectedDate(value as Date)
                        }
                        tileClassName={({ date }) => {

                            const day = formatDateToISO(date);

                            const classes = [];

                            const start =
                                plan?.startDate.split("T")[0];

                            const end =
                                plan?.endDate.split("T")[0];

                            if (
                                start &&
                                end &&
                                day >= start &&
                                day <= end
                            ) {
                                classes.push("trip-day");
                            }

                            if (activityDates.has(day)) {
                                classes.push("activity-day");
                            }

                            return classes.join(" ");
                        }}
                    />

                    <div className="flex gap-4 mb-4 justify-center">
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                            <span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300" />
                            Trip Duration
                        </div>
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                            <span className="w-3 h-3 rounded-full bg-amber-500" />
                            Activities Planned
                        </div>
                    </div>

                </div>

                <div className="mt-8">

                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-bold">Activities for {selectedDate.toLocaleDateString()}</h2>
                        <div className="text-sm text-stone-500 font-medium">
                            {activities.length} activities • {activities.reduce((sum, a) => sum + a.estimatedCost, 0)} €
                        </div>
                    </div>

                    {loading ? (
                        <div>Loading...</div>
                    ) : activities.length === 0 ? (
                        <div
                            className="
                                bg-white
                                rounded-2xl
                                border
                                border-stone-200
                                p-6
                                text-stone-500
                            "
                        >
                            No activities planned.
                        </div>
                    ) : (
                        <div className="space-y-4">

                            {activities.map(activity => (
                                <ActivityCard
                                    key={activity.id}
                                    activity={activity}
                                />
                            ))}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}