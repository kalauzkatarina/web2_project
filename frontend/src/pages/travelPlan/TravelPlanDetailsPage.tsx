import { useNavigate, useParams } from "react-router-dom";
import { useTravelPlan } from "../../hooks/travelPlan/useTravelPlan";
import DestinationCard from "../../components/destination/DestinationCard";
import { HiArrowLeft, HiOutlineCalendar, HiOutlineTrash } from "react-icons/hi";
import { FiEdit2 } from "react-icons/fi";
import { useState } from "react";
import ConfirmationModal from "../../components/confirmation/ConfirmationModal";
import { travelPlanService } from "../../api_services/travelPlanApi/TravelPlanApiService";
import { destinationService } from "../../api_services/destinationApi/DestinationApiService";
import { activityService } from "../../api_services/activityApi/ActivityApiService";

export default function TravelPlanDetailsPage() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [destinationToDelete, setDestinationToDelete] = useState<string | null>(null);
    const [activityToDelete, setActivityToDelete] = useState<string | null>(null);

    const { id } = useParams();
    const { plan, setPlan, loading } = useTravelPlan(id);

    const navigate = useNavigate();

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

                <button
                    onClick={() => navigate("/")}
                    className="
                        flex
                        items-center
                        gap-2
                        text-stone-500
                        hover:text-amber-600
                        transition-colors
                        mb-6"
                >
                    <HiArrowLeft />
                    Back to Journeys
                </button>

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

                    <div className="flex justify-between items-start mt-3">

                        <h1 className="text-5xl font-bold text-stone-900">
                            {plan.title}
                        </h1>

                        <div className="flex gap-2">

                            <button
                                title="Edit Journey"
                                onClick={() => navigate(`/plans/${plan.id}/edit`)}
                                className="
                                    p-3
                                    rounded-2xl
                                    bg-white
                                    border
                                    border-stone-200
                                    text-stone-500
                                    shadow-sm
                                    hover:text-amber-600
                                    hover:border-amber-300
                                    hover:shadow
                                    transition
                                "
                            >
                                <FiEdit2 size={18} />
                            </button>

                            <button
                                title="Delete Journey"
                                onClick={() => setShowDeleteModal(true)}
                                className="
                                        p-3
                                        rounded-2xl
                                        bg-white
                                        border
                                        border-stone-200
                                        text-stone-500
                                        shadow-sm
                                        hover:text-red-500
                                        hover:border-red-300
                                        hover:shadow
                                        transition
                                    "
                            >
                                <HiOutlineTrash size={18} />
                            </button>

                        </div>

                    </div>

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

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-3xl font-bold text-stone-900">
                            Destinations
                        </h2>

                        <div className="flex flex-wrap gap-3 mb-6">
                            <button
                                onClick={() => navigate(`/plans/${plan.id}/destinations/create`)}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition shadow-sm"
                            >
                                <span>+ Add Destination</span>
                            </button>

                            <button
                                onClick={() => navigate(`/plans/${plan.id}/calendar`)}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-stone-200 text-stone-700 font-medium hover:bg-stone-50 hover:border-stone-300 transition shadow-sm"
                            >
                                <HiOutlineCalendar size={20} className="text-amber-500" />
                                <span>Calendar view</span>
                            </button>
                        </div>
                    </div>

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
                                    onEdit={(id) =>
                                        navigate(`/destinations/${id}/edit`)
                                    }
                                    onDelete={(id) =>
                                        setDestinationToDelete(id)
                                    }
                                    onActivityEdit={(id) =>
                                        navigate(`/activities/${id}/edit`)
                                    }
                                    onActivityDelete={(id) =>
                                        setActivityToDelete(id)
                                    }
                                />
                            ))}
                        </div>
                    )}

                </div>

            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                title="Delete Journey"
                message="Are you sure you want to delete this journey? This action cannot be undone."
                confirmText="Delete"
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={async () => {
                    await travelPlanService.delete(plan.id);
                    navigate("/");
                }}
            />

            <ConfirmationModal
                isOpen={destinationToDelete !== null}
                title="Delete Destination"
                message="Are you sure you want to delete this destination? This action cannot be undone."
                confirmText="Delete"
                onCancel={() =>
                    setDestinationToDelete(null)
                }
                onConfirm={async () => {

                    if (!destinationToDelete)
                        return;

                    await destinationService.delete(
                        destinationToDelete
                    );

                    setPlan(prev =>
                        prev
                            ? {
                                ...prev,
                                destinations: prev.destinations.filter(
                                    d => d.id !== destinationToDelete
                                ),
                            }
                            : prev
                    );

                    setDestinationToDelete(null);
                }}
            />

            <ConfirmationModal
                isOpen={activityToDelete !== null}
                title="Delete Activity"
                message="Are you sure you want to delete this activity?"
                confirmText="Delete"
                onCancel={() =>
                    setActivityToDelete(null)
                }
                onConfirm={async () => {

                    if (!activityToDelete)
                        return;

                    await activityService.delete(
                        activityToDelete
                    );

                    setPlan(prev =>
                        prev
                            ? {
                                ...prev,
                                destinations:
                                    prev.destinations.map(d => ({
                                        ...d,
                                        activities:
                                            d.activities.filter(
                                                a => a.id !== activityToDelete
                                            )
                                    }))
                            }
                            : prev
                    );

                    setActivityToDelete(null);
                }}
            />

        </div>
    );
}