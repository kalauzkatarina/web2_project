import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ActivityForm from "../../components/activity/ActivityForm";
import { activityService } from "../../api_services/activityApi/ActivityApiService";
import { HiArrowLeft } from "react-icons/hi";

export default function CreateActivityPage() {

    const { id } = useParams(); //destId
    const [searchParams] = useSearchParams();
    const shareToken = searchParams.get("shareToken") ?? undefined;
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fafaf9]">

            <div className="max-w-5xl mx-auto px-6 py-10">

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

                <h1 className="text-5xl font-bold text-stone-900">
                    Add Activity
                </h1>

                <p className="text-stone-500 mt-3 mb-8">
                    Add a new activity to this destination.
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
                        submitText="Add Activity"
                        initialValues={{
                            destinationId: id!,
                            title: "",
                            location: "",
                            description: "",
                            estimatedCost: 0,
                            date: "",
                            time: "",
                            status: 0,
                            category: 5,
                        }}
                         onSubmit={async (data) => {
                            await activityService.create(data, shareToken);

                            if (shareToken) {
                                navigate(`/shared/${shareToken}`);
                            } else {
                                navigate(-1);
                            }
                        }}
                    />

                </div>

            </div>

        </div>
    );
}