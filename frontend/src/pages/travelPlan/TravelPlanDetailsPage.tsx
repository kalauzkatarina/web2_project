import { useNavigate, useParams } from "react-router-dom";
import { useTravelPlan } from "../../hooks/travelPlan/useTravelPlan";
import { HiArrowLeft, } from "react-icons/hi";
import { useEffect, useState } from "react";
import ConfirmationModal from "../../components/confirmation/ConfirmationModal";
import { travelPlanService } from "../../api_services/travelPlanApi/TravelPlanApiService";
import { useFinance } from "../../hooks/finance/useFinance";
import ChecklistSection from "../../components/checklist/ChecklistSection";
import TravelPlanHeader from "../../components/travelPlan/TravelPlanHeader";
import TravelPlanDestinationsSection from "../../components/travelPlan/TravelPlanDestinationSection";
import FinanceSection from "../../components/finance/FinanceSection";
import { useTravelPlanActions } from "../../hooks/travelPlan/useTravelPlanActions";
import SharePlanModal from "../../components/sharePlan/SharePlanModal";
import { generateTravelPlanPdf } from "../../helpers/generateTravelPlanPdf";
import TravelPlanPdfView from "../../components/travelPlan/TravelPlanPdfView";

export default function TravelPlanDetailsPage() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showPdf, setShowPdf] = useState(false);
    const [generatingPdf, setGeneratingPdf] = useState(false);


    const { id } = useParams();
    const { plan, setPlan, loading } = useTravelPlan(id);
    const { expenses, summary, refetch } = useFinance(id);

    const refreshFinanceWithDelay = async () => {
        setTimeout(async () => {
            await refetch();
        }, 1000);
    };

    const { deleteState, setDeleteState, handlers } = useTravelPlanActions(
        id!,
        setPlan,
        refreshFinanceWithDelay
    );

    const handleDownloadPdf = async () => {
        setShowPdf(true);
        setGeneratingPdf(true);

        setTimeout(async () => {
            await generateTravelPlanPdf(
                "pdf-content",
                plan!.title
            );

            setShowPdf(false);
            setGeneratingPdf(false);
        }, 500);
    };

    useEffect(() => {
        refreshFinanceWithDelay();
    }, []);

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

                <TravelPlanHeader
                    plan={plan}
                    onEdit={() => navigate(`/plans/${plan.id}/edit`)}
                    onDelete={() => setShowDeleteModal(true)}
                    onShare={() => setShowShareModal(true)}
                    onDownloadPdf={handleDownloadPdf}
                />

                <TravelPlanDestinationsSection
                    plan={plan}
                    navigate={navigate}
                    onEditDestination={(id) => navigate(`/destinations/${id}/edit`)}
                    onDeleteDestination={(id) => setDeleteState(s => ({ ...s, destinationId: id }))}
                    onEditActivity={(id) => navigate(`/activities/${id}/edit`)}
                    onDeleteActivity={(id) => setDeleteState(s => ({ ...s, activityId: id }))}
                />

                <FinanceSection
                    planId={plan.id}
                    summary={summary}
                    expenses={expenses}
                    onRefresh={refreshFinanceWithDelay}
                />

                <ChecklistSection planId={plan.id} />

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
                title="Delete Destination"
                message="Are you sure you want to delete this destination? This action cannot be undone."
                confirmText="Delete"
                isOpen={deleteState.showPlanModal}
                onConfirm={handlers.deletePlan}
                onCancel={() => setDeleteState(s => ({ ...s, showPlanModal: false }))}
            />

            <ConfirmationModal
                isOpen={!!deleteState.destinationId}
                title="Delete Destination"
                message="Are you sure you want to delete this destination?"
                onCancel={() => setDeleteState(s => ({ ...s, destinationId: null }))}
                onConfirm={() => handlers.deleteDestination(deleteState.destinationId!)}
            />

            <ConfirmationModal
                isOpen={!!deleteState.activityId}
                title="Delete Activity"
                message="Are you sure you want to delete this activity?"
                onCancel={() => setDeleteState(s => ({ ...s, activityId: null }))}
                onConfirm={() => handlers.deleteActivity(deleteState.activityId!)}
            />

            <SharePlanModal
                isOpen={showShareModal}
                planId={plan.id}
                onClose={() => setShowShareModal(false)}
            />

            {showPdf && (
                <div className="fixed -left-[9999px] top-0">
                    <TravelPlanPdfView plan={plan!} />
                </div>
            )}
        </div>
    );
}