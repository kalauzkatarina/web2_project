import { useNavigate, useParams } from "react-router-dom";
import DestinationForm from "../../components/destination/DestinationForm";
import { destinationService } from "../../api_services/destinationApi/DestinationApiService";
import { HiArrowLeft } from "react-icons/hi";

export default function CreateDestinationPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fafaf9]">

            <div className="max-w-5xl mx-auto px-6 py-10">

                <button
                    onClick={() => navigate(`/plans/${id}`)}
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
                    Add Destination
                </h1>

                <p className="text-stone-500 mt-3 mb-8">
                    Add a new stop to your journey.
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
                        submitText="Add Destination"
                        initialValues={{
                            travelPlanId: id!,
                            name: "",
                            location: "",
                            arrivalDate: "",
                            departureDate: "",
                            description: "",
                        }}
                        onSubmit={async (data) => {

                            await destinationService.create(data);

                            navigate(`/plans/${id}`);
                        }}
                    />

                </div>

            </div>

        </div>
    );
}