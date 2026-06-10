import { useNavigate } from "react-router-dom";
import TravelPlanCard from "../../components/travelPlan/TravelPlanCard";
import { useTravelPlans } from "../../hooks/travelPlan/useTravelPlans";

export default function TravelPlansPage() {
    const { plans, loading } = useTravelPlans();
    const navigate = useNavigate();

    if (loading)
        return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-10">

                <div>
                    <p
                        className="
                            uppercase
                            tracking-widest
                            text-amber-600
                            text-sm
                            font-bold
                        "
                    >
                        Travel Plan
                    </p>

                    <h1 className="text-5xl font-bold text-stone-900 mt-2">
                        My Journeys
                    </h1>
                </div>

                <button
                    onClick={() => navigate("/plans/create")}
                    className="
            px-5
            py-3
            rounded-2xl
            bg-amber-500
            text-white
            font-semibold
            hover:bg-amber-600
        "
                >
                    + New Journey
                </button>

            </div>

            <div className="grid gap-4">
                {plans.map((plan) => (
                    <TravelPlanCard
                        key={plan.id}
                        plan={plan}
                    />
                ))}
            </div>
        </div>
    );
}