import { useParams } from "react-router-dom";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AccessType } from "../../enums/AccessType";
import { useSharedPlan } from "../../hooks/shareToken/useSharedPlan";
import DestinationCard from "../../components/destination/DestinationCard";

export default function SharedPlanPage() {
    const { token } = useParams();

    const { data, loading } = useSharedPlan(token);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
                Invalid share link.
            </div>
        );
    }

    const canEdit = data.accessType === AccessType.Edit;

    return (
        <div className="min-h-screen bg-[#fafaf9]">

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div
                    className="
                        flex
                        bg-white
                        rounded-[2rem]
                        overflow-hidden
                        border
                        border-stone-200
                        shadow-sm
                    "
                >
                    <div className="w-2 bg-amber-500" />

                    <div className="p-7 flex-1">

                        <div className="flex justify-between items-start">

                            <div>
                                <h1 className="text-4xl font-bold text-stone-900">
                                    {data.plan.title}
                                </h1>

                                <p className="text-stone-500 mt-3 max-w-3xl">
                                    {data.plan.description}
                                </p>
                            </div>

                            <div
                                className={`
                                    px-4
                                    py-2
                                    rounded-full
                                    text-sm
                                    font-semibold
                                    ${
                                        canEdit
                                            ? "bg-green-100 text-green-700"
                                            : "bg-blue-100 text-blue-700"
                                    }
                                `}
                            >
                                {canEdit
                                    ? "Edit Access"
                                    : "View Access"}
                            </div>

                        </div>

                        {data.plan.destinations.length > 0 && (
                            <div className="mt-5 flex flex-wrap gap-2">

                                {data.plan.destinations
                                    .slice(0, 3)
                                    .map((destination) => (

                                        <div
                                            key={destination.id}
                                            className="
                                                flex
                                                items-center
                                                gap-1
                                                px-3
                                                py-1
                                                rounded-full
                                                bg-amber-50
                                                text-amber-700
                                                text-sm
                                            "
                                        >
                                            <HiOutlineLocationMarker />
                                            {destination.name}
                                        </div>

                                    ))}
                            </div>
                        )}

                        <div
                            className="
                                mt-6
                                pt-5
                                border-t
                                border-stone-100
                                flex
                                justify-between
                                items-center
                            "
                        >

                            <div>
                                <p className="text-xs uppercase text-stone-400">
                                    Travel Dates
                                </p>

                                <p className="font-medium text-stone-700 mt-1">
                                    {new Date(
                                        data.plan.startDate
                                    ).toLocaleDateString()}
                                    {" - "}
                                    {new Date(
                                        data.plan.endDate
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-xs uppercase text-stone-400">
                                    Budget
                                </p>

                                <p className="text-2xl font-bold text-amber-600 mt-1">
                                    €{data.plan.plannedBudget}
                                </p>
                            </div>

                        </div>

                    </div>
                </div>

                {data.plan.generalNotes && (
                    <div
                        className="
                            mt-8
                            bg-white
                            rounded-[2rem]
                            p-6
                            border
                            border-stone-200
                        "
                    >
                        <h2 className="text-xl font-bold text-stone-900">
                            Notes
                        </h2>

                        <p className="mt-3 text-stone-600">
                            {data.plan.generalNotes}
                        </p>
                    </div>
                )}

                <div className="mt-12">

                    <h2 className="text-3xl font-bold text-stone-900 mb-6">
                        Destinations
                    </h2>

                    {data.plan.destinations.length === 0 ? (
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

                            {data.plan.destinations.map((destination) => (

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