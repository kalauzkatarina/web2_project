import TravelPlanCard from "../../components/travelPlan/TravelPlanCard";
import { useTravelPlans } from "../../hooks/travelPlan/useTravelPlans";

export default function TravelPlansPage() {
    const { plans, loading } = useTravelPlans();

    if (loading)
        return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="mb-10">
                <p className="text-amber-600 font-semibold tracking-wider uppercase text-sm">
                    Travel Planner
                </p>

                <h1 className="text-5xl font-bold text-stone-900 mt-2">
                    My Journeys
                </h1>
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