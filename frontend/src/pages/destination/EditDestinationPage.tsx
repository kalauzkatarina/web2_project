import { useNavigate, useParams } from "react-router-dom";
import DestinationForm from "../../components/destination/DestinationForm";
import { destinationService } from "../../api_services/destinationApi/DestinationApiService";
import { useDestination } from "../../hooks/destination/useDestination";
import { HiArrowLeft } from "react-icons/hi";

export default function EditDestinationPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const {
        destination,
        loading,
    } = useDestination(id);

    if (loading)
        return (
            <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
                Loading...
            </div>
        );

    if (!destination)
        return (
            <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
                Destination not found.
            </div>
        );

    return (
        <div className="min-h-screen bg-[#fafaf9]">

            <div className="max-w-5xl mx-auto px-6 py-10">

                <button
                    onClick={() => navigate(-1)}
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
                    Edit Destination
                </h1>

                <p className="text-stone-500 mt-3 mb-8">
                    Update destination details.
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

                    <DestinationForm
                        submitText="Save Changes"
                        initialValues={{
                            travelPlanId: destination.travelPlanId,
                            name: destination.name,
                            location: destination.location,
                            arrivalDate:
                                destination.arrivalDate.split("T")[0],
                            departureDate:
                                destination.departureDate.split("T")[0],
                            description:
                                destination.description ?? "",
                        }}
                        onSubmit={async (data) => {

                            await destinationService.update(
                                destination.id,
                                {
                                    name: data.name,
                                    location: data.location,
                                    arrivalDate: data.arrivalDate,
                                    departureDate: data.departureDate,
                                    description: data.description,
                                }
                            );

                            navigate(
                                `/plans/${destination.travelPlanId}`
                            );
                        }}
                    />

                </div>

            </div>

        </div>
    );
}