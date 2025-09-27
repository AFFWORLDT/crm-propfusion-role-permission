import MultiStepForm from "../../ui/MultiStepForm";
import SectionTop from "../../ui/SectionTop";
import { buildBuildingData, buildBuildingEditData } from "../../utils/buildFormData";
import SvgMap from "../../assets/map.svg?react";
import SvgInfo from "../../assets/info.svg?react";
import SvgDescription from "../../assets/description.svg?react";
import SvgMedia from "../../assets/media.svg?react";
import SvgCard from "../../assets/card.svg?react";
import SvgPortals from "../../assets/portals.svg?react";
import StepLocation from "../../features/building/StepLocation";
import StepInfo from "../../features/building/StepInfo";
import StepDescription from "../../features/building/StepDescription";
import StepPhotos from "../../features/building/StepPhotos";
import StepPayment from "../../features/building/StepPayment";
import StepPortals from "../../features/building/StepPortals";

import useDeleteImageStore from "../../store/deleteImageStore";
import useImagesStore from "../../store/imagesStore";
import { useDocumentsStore } from "../../store/imagesStore";
import { useNavigate, useParams } from "react-router-dom";
import useUpdateBuilding from "../../features/building/useUpdateBuilding";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../PageNotFound";
import useInfiniteBuilding from "../../features/building/useGetBuildUrl";
import { useDeleteImage } from "../../features/Extra/useDeleteImage";

function EditNewBuilding() {
    const { updateBuildingMutation, isPending } = useUpdateBuilding();
    const { images: deleteImages } = useDeleteImageStore();
    const { deleteImage } = useDeleteImage();
    const { images, setImages } = useImagesStore();
    const { documents, clearAllDocuments, setDocument } = useDocumentsStore();
    const { id } = useParams();

    const navigate = useNavigate();
    const {
        projects: buildingData,
        isLoading,
        error,
    } = useInfiniteBuilding(id);
    const building = buildingData[0];

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    useEffect(() => {
        if (building?.photos) {
            setImages(building.photos);
        }
    }, [building, setImages]);
    useEffect(() => {
        if (building) {
            setDocument("management_contract", building.management_contract);
            setDocument("tenancy_lease_contract", building.tenancy_lease_contract);
            setDocument("title_deed", building.title_deed);
            setDocument("affection_plan", building.affection_plan);
            setDocument("poa_noc", building.poa_noc);
            setDocument("building_drawing", building.building_drawing);
            setDocument("handover_documents", building.handover_documents);
            setDocument("other_documents", building.other_documents);
        }
    }, [building, setDocument]);

    function handleFormSubmit(data) {
        const updatedBuilding = buildBuildingData(data);
        updatedBuilding.building_status = building.building_status;

        updateBuildingMutation(
            {
                buildingId: building.id,
                updatedBuilding: {
                    ...updatedBuilding,
                    photos: images,
                    management_contract: documents.management_contract,
                    tenancy_lease_contract: documents.tenancy_lease_contract,
                    title_deed: documents.title_deed,
                    affection_plan: documents.affection_plan,
                    poa_noc: documents.poa_noc,
                    building_drawing: documents.building_drawing,
                    handover_documents: documents.handover_documents,
                    other_documents: documents.other_documents,
                },
            },
            {
                onSettled: () => {
                    if (deleteImages.length > 0) {
                        deleteImage(deleteImages);
                    }
                    navigate(-1);
                },
                onSuccess: () => {
                    localStorage.removeItem("documents-storage");
                    clearAllDocuments();
                },
            }
        );
    }

    function renderStep(step) {
        switch (step) {
            case 1:
                return <StepLocation />;
            case 2:
                return <StepInfo />;
            case 3:
                return <StepDescription />;
            case 4:
                return <StepPhotos isEditSession={true} buildingData={building} />;
            case 5:
                return <StepPayment chequePaymentsData={building.cheque_payments} />;
            case 6:
                return <StepPortals />;
            default:
                return null;
        }
    }

    if (isLoading) return <Spinner type="fullPage" />;
    if (!building) return <PageNotFound />;
    const defaultValues = buildBuildingEditData(building);
    return (
        <div className="sectionContainer">
            <SectionTop heading={`Edit Building`} />
            <section className="sectionStyles">
                <MultiStepForm
                    totalSteps={6}
                    renderStep={renderStep}
                    onFormSubmit={handleFormSubmit}
                    isSubmitting={isPending}
                    defaultValues={defaultValues}
                >
                    <div className="sectionDiv">
                        <MultiStepForm.ProgressBar
                            content={[
                                { title: "Location", svg: <SvgMap /> },
                                { title: "Information", svg: <SvgInfo /> },
                                {
                                    title: "Description",
                                    svg: <SvgDescription />,
                                },
                                { title: "Photos", svg: <SvgMedia /> },
                                { title: "Payment Plan", svg: <SvgCard /> },
                                { title: "Portals", svg: <SvgPortals /> },
                            ]}
                        />
                    </div>
                </MultiStepForm>
            </section>
        </div>
    );
}

export default EditNewBuilding;