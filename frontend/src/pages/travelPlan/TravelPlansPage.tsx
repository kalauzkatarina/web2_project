import { useNavigate } from "react-router-dom";
import TravelPlanCard from "../../components/travelPlan/TravelPlanCard";
import { useTravelPlans } from "../../hooks/travelPlan/useTravelPlans";

export default function TravelPlansPage() {
    const {
        plans,
        loading,
        switching,
        role,
        filter,
        setFilter,
    } = useTravelPlans();

    const navigate = useNavigate();

    const isAdmin = role.toLowerCase() === "admin";

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                Loading...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <p className="uppercase tracking-widest text-amber-600 text-sm font-bold">
                        {isAdmin
                            ? "System Administration"
                            : "Travel Plan"}
                    </p>

                    <h1 className="text-5xl font-bold text-stone-900 mt-2 min-h-[4rem]">
                        {filter === "all"
                            ? "All User Journeys"
                            : "My Journeys"}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {isAdmin && (
                        <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200">
                            <button
                                onClick={() => setFilter("my")}
                                className={`px-4 py-2 rounded-xl transition-all duration-300 ${filter === "my"
                                        ? "bg-white shadow-sm text-amber-600 font-bold"
                                        : "text-stone-500"
                                    }`}
                            >
                                My Journeys
                            </button>

                            <button
                                onClick={() => setFilter("all")}
                                className={`px-4 py-2 rounded-xl transition-all duration-300 ${filter === "all"
                                        ? "bg-white shadow-sm text-amber-600 font-bold"
                                        : "text-stone-500"
                                    }`}
                            >
                                All Journeys
                            </button>
                        </div>
                    )}

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
                            transition-colors
                        "
                    >
                        + New Journey
                    </button>
                </div>
            </div>

            <div
                className={`
                    grid gap-4
                    transition-all duration-300
                    ${switching ? "opacity-60" : "opacity-100"}
                `}
            >
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