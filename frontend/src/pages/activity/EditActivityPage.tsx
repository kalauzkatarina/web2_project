import { useNavigate, useParams } from "react-router-dom";
import ActivityForm from "../../components/activity/ActivityForm";
import { activityService } from "../../api_services/activityApi/ActivityApiService";
import { useActivity } from "../../hooks/activity/useActivity";
import { HiArrowLeft } from "react-icons/hi";

export default function EditActivityPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const {
        activity,
        loading,
    } = useActivity(id);

    if (loading)
        return <div>Loading...</div>;

    if (!activity)
        return <div>Activity not found.</div>;

    return (
        <div className="min-h-screen bg-[#fafaf9]">

            <div className="max-w-5xl mx-auto px-6 py-10">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-stone-500 hover:text-amber-600 mb-6"
                >
                    <HiArrowLeft />
                    Back to Journey
                </button>

                <h1 className="text-5xl font-bold text-stone-900">
                    Edit Activity
                </h1>

                <p className="text-stone-500 mt-3 mb-8">
                    Update activity details.
                </p>

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

                    <ActivityForm
                        submitText="Save Changes"
                        initialValues={{
                            destinationId: activity.destinationId,
                            title: activity.title,
                            location: activity.location,
                            description: activity.description,
                            estimatedCost: activity.estimatedCost,
                            date: activity.date.split("T")[0],
                            time: activity.time,
                            status: activity.status,
                            category: activity.category,
                        }}
                        onSubmit={async (data) => {

                            await activityService.update(
                                activity.id,
                                data
                            );

                            navigate(-1);
                        }}
                    />

                </div>

            </div>

        </div>
    );
}