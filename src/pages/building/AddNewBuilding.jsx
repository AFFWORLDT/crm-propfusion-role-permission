import MultiStepForm from "../../ui/MultiStepForm";
import SectionTop from "../../ui/SectionTop";
import { buildBuildingData } from "../../utils/buildFormData";
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
// import { useDeleteImage } from "../../features/Extra/useDeleteImage";
import useImagesStore from "../../store/imagesStore";
import { useDocumentsStore } from "../../store/imagesStore";
import { useNavigate } from "react-router-dom";
import useCreateBuilding from "../../features/building/useCreateBuilding";
import { useDeleteImage } from "../../features/Extra/useDeleteImage";

function AddNewbuilding() {
    const { addBuilding, isPending } = useCreateBuilding();
    const { images: deleteImages } = useDeleteImageStore();
    const { deleteImage } = useDeleteImage();
    // const { deleteImage } = useDeleteImage();
    const { images } = useImagesStore();
    const { documents, clearAllDocuments } = useDocumentsStore();
    const navigate = useNavigate();

    function handleFormSubmit(data, handleReset) {
        const newProject = buildBuildingData(data);
        newProject.building_status = "ACTIVE";

        addBuilding(
            {
                newProject: {
                    ...newProject,
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
                photos: data.photos,

            },
            {
                onSettled: data
                    ? () =>
                        navigate(-1)
                    : handleReset,

                onSuccess: () => {
                    localStorage.removeItem("documents-storage");
                    clearAllDocuments();

                    if (deleteImages.length > 0) {
                        deleteImage(deleteImages);
                    }
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
                return <StepPhotos />;
            case 5:
                return <StepPayment />;
            case 6:
                return <StepPortals />;
            default:
                return null;
        }
    }

    return (
        <div className="sectionContainer">
            <SectionTop heading={`Add New Building`} />
            <section className="sectionStyles">
                <MultiStepForm
                    totalSteps={6}
                    renderStep={renderStep}
                    onFormSubmit={handleFormSubmit}
                    isSubmitting={isPending}
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

export default AddNewbuilding;
