import { useNavigate, useParams } from "react-router-dom";
import { AccessType } from "../../enums/AccessType";
import { useSharedPlan } from "../../hooks/shareToken/useSharedPlan";
import TravelPlanHeader from "../../components/travelPlan/TravelPlanHeader";
import TravelPlanDestinationsSection from "../../components/travelPlan/TravelPlanDestinationSection";
import { destinationService } from "../../api_services/destinationApi/DestinationApiService";
import { activityService } from "../../api_services/activityApi/ActivityApiService";

export default function SharedPlanPage() {
    const { token } = useParams();

    const { data, loading, refetch } = useSharedPlan(token);
    const navigate = useNavigate();

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
    const handleEdit = () => {
        const jwt = localStorage.getItem("token");

        if (!jwt) {
            localStorage.setItem("pendingShareToken", token ?? "");
            navigate("/login");
            return;
        }

        navigate(`/plans/${data.plan.id}/edit?shareToken=${token}`);
    };

    return (
        <div className="min-h-screen bg-[#fafaf9]">

            <div className="max-w-7xl mx-auto px-6 py-10">
                <TravelPlanHeader
                    plan={data.plan}
                    showActions={false}
                    accessType={data.accessType}
                    showEditButton={canEdit}
                    onEdit={handleEdit}
                />

                <TravelPlanDestinationsSection
                    plan={data.plan}
                    navigate={navigate}
                    shareToken={canEdit ? token : undefined}
                    showActions={canEdit}
                    onEditDestination={
                        canEdit
                            ? (id) =>
                                navigate(
                                    `/destinations/${id}/edit?shareToken=${token}`
                                )
                            : undefined
                    }
                    onDeleteDestination={
                        canEdit
                            ? async (id) => {
                                await destinationService.delete(id, token);
                                await refetch();
                            }
                            : undefined
                    }
                    onEditActivity={
                        canEdit
                            ? (id) => navigate(`/activities/${id}/edit?shareToken=${token}`)
                            : undefined
                    }
                    onDeleteActivity={
                        canEdit
                            ? async (id) => {
                                await activityService.delete(id, token);
                                await refetch();
                            }
                            : undefined
                    }
                />


            </div>

        </div>
    );
}