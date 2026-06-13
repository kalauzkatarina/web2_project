import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTravelPlan } from "../../hooks/travelPlan/useTravelPlan";
import TravelPlanForm from "../../components/travelPlan/TravelPlanForm";
import { travelPlanService } from "../../api_services/travelPlanApi/TravelPlanApiService";
import { HiArrowLeft } from "react-icons/hi";

export default function EditTravelPlanPage() {

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const shareToken = searchParams.get("shareToken") ?? undefined;
    const navigate = useNavigate();

    const { plan, loading } = useTravelPlan(id, shareToken);

    if (loading)
        return <div>Loading...</div>;

    if (!plan)
        return <div>Travel plan not found.</div>;

    return (
        <div className="min-h-screen bg-[#fafaf9]">

            <div className="max-w-5xl mx-auto px-6 py-10">

                <button
                    onClick={() => shareToken ? navigate(`/shared/${shareToken}`) : navigate(`/plans/${id}`)}
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
                    Edit Journey
                </h1>

                <p className="text-stone-500 mt-3 mb-8">
                    Update your travel plan.
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
                    <TravelPlanForm
                        submitText="Save Changes"
                        initialValues={{
                            title: plan.title,
                            description: plan.description,
                            startDate: plan.startDate.split("T")[0],
                            endDate: plan.endDate.split("T")[0],
                            plannedBudget: plan.plannedBudget,
                            generalNotes: plan.generalNotes,
                        }}
                       onSubmit={async (data) => {
                            await travelPlanService.update(plan.id, data, shareToken);

                            if (shareToken) {
                                navigate(`/shared/${shareToken}`);
                            } else {
                                navigate(`/plans/${plan.id}`);
                            }
                        }}
                    />
                </div>

            </div>

        </div>
    );
}