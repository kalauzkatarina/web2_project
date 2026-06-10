import { useNavigate } from "react-router-dom";
import TravelPlanForm from "../../components/travelPlan/TravelPlanForm";
import { travelPlanService } from "../../api_services/travelPlanApi/TravelPlanApiService";
import { HiArrowLeft } from "react-icons/hi";

export default function CreateTravelPlanPage() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fafaf9]">

            <div className="max-w-5xl mx-auto px-6 py-10">

                <button
                    onClick={() => navigate("/")}
                    className="
                    flex
                    items-center
                    gap-2
                    text-stone-500
                    hover:text-amber-600
                    transition-colors
                    mb-6
                "
                >
                    <HiArrowLeft />
                    Back to Journeys
                </button>

                <h1 className="text-5xl font-bold text-stone-900 mt-2">
                    Create Journey
                </h1>

                <p className="text-stone-500 mt-3 mb-8">
                    Start planning your next adventure.
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
                        submitText="Create Journey"
                        initialValues={{
                            title: "",
                            description: "",
                            startDate: "",
                            endDate: "",
                            plannedBudget: 0,
                            generalNotes: "",
                        }}
                        onSubmit={async (data) => {
                            const created = await travelPlanService.create(data);
                            navigate(`/plans/${created.id}`);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}