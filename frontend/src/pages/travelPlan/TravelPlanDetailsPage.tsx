import { useParams } from "react-router-dom";
import { useTravelPlan } from "../../hooks/travelPlan/useTravelPlan";
import DestinationCard from "../../components/destination/DestinationCard";

export default function TravelPlanDetailsPage() {

    const { id } = useParams();

    const { plan, loading } = useTravelPlan(id);

    if (loading)
        return (
            <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
                Loading...
            </div>
        );

    if (!plan)
        return (
            <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
                Travel plan not found.
            </div>
        );

    return (
        <div className="min-h-screen bg-[#fafaf9]">

            <div className="max-w-7xl mx-auto px-6 py-10">

                <div
                    className="
                        bg-white
                        rounded-[2rem]
                        p-10
                        border
                        border-stone-200
                        shadow-sm
                    "
                >
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

                    <h1 className="text-5xl font-bold mt-3 text-stone-900">
                        {plan.title}
                    </h1>

                    <p className="mt-5 text-stone-500 max-w-3xl">
                        {plan.description}
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 mt-10">

                        <div className="bg-amber-50 rounded-2xl p-5">
                            <div className="text-stone-500">
                                Planned Budget
                            </div>

                            <div className="text-3xl font-bold text-amber-600 mt-2">
                                €{plan.plannedBudget}
                            </div>
                        </div>

                        <div className="bg-stone-50 rounded-2xl p-5">
                            <div className="text-stone-500">
                                Start Date
                            </div>

                            <div className="font-semibold mt-2">
                                {new Date(plan.startDate).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="bg-stone-50 rounded-2xl p-5">
                            <div className="text-stone-500">
                                End Date
                            </div>

                            <div className="font-semibold mt-2">
                                {new Date(plan.endDate).toLocaleDateString()}
                            </div>
                        </div>

                    </div>

                    {plan.generalNotes && (
                        <div className="mt-10">
                            <h3 className="text-xl font-bold text-stone-900">
                                Notes
                            </h3>

                            <p className="mt-3 text-stone-600">
                                {plan.generalNotes}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-12">

                    <h2 className="text-3xl font-bold text-stone-900 mb-6">
                        Destinations
                    </h2>

                    {plan.destinations.length === 0 ? (
                        <div
                            className="
                                bg-white
                                rounded-2xl
                                p-8
                                text-center
                                text-stone-500
                                border
                                border-stone-200
                            "
                        >
                            No destinations added yet.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {plan.destinations.map((destination) => (
                                <DestinationCard
                                    key={destination.id}
                                    destination={destination}
                                />
                            ))}
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}