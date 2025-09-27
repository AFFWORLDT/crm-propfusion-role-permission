import useCreateProject from "../../features/newProjects/useCreateProject";
import MultiStepForm from "../../ui/MultiStepForm";
import SectionTop from "../../ui/SectionTop";
import { buildProjectData } from "../../utils/buildFormData";
import SvgMap from "../../assets/map.svg?react";
import SvgInfo from "../../assets/info.svg?react";
import SvgDescription from "../../assets/description.svg?react";
import SvgMedia from "../../assets/media.svg?react";
import SvgHome from "../../assets/home.svg?react";
import SvgCard from "../../assets/card.svg?react";
import SvgPortals from "../../assets/portals.svg?react";
import StepLocation from "../../features/newProjects/StepLocation";
import StepInfo from "../../features/newProjects/StepInfo";
import StepDescription from "../../features/newProjects/StepDescription";
import StepPhotos from "../../features/newProjects/StepPhotos";
import StepFloorPlans from "../../features/newProjects/StepFloorPlans";
import StepPayment from "../../features/newProjects/StepPayment";
import StepPortals from "../../features/newProjects/StepPortals";
import { useState } from "react";
import useDeleteImageStore from "../../store/deleteImageStore";
import { useDeleteImage } from "../../features/Extra/useDeleteImage";
import useImagesStore from "../../store/imagesStore";
import { useNavigate } from "react-router-dom";
import { useMyPermissions } from "../../hooks/useHasPermission";
import PageNotFound from "../PageNotFound";

function AddNewProject() {
    const { addProject, isPending } = useCreateProject();
    const [floorPlanList, setFloorPlanList] = useState([]);
    const [paymentPlanList, setPaymentPlanList] = useState([]);
    const { images: deleteImages } = useDeleteImageStore();
    const { deleteImage } = useDeleteImage();
    const { images } = useImagesStore();
    const navigate = useNavigate();
    const { hasPermission } = useMyPermissions();

    if (!hasPermission("create_transactions")) return <PageNotFound />;

    function handleFormSubmit(data, handleReset) {
        const newProject = buildProjectData(data);
        newProject.projectStatus = "ACTIVE";

        addProject(
            {
                newProject: {
                    ...newProject,
                    photos: images,
                },
                photos: data.photos,
                floorPlanList,

                brochure: data?.brochure,
                master_plans: data?.master_plans,
                video: data?.video,
                paymentPlanList,
                permit_qr_code: data?.permit_qr_code,
            },
            {
                onSettled: data ? () => navigate(-1) : handleReset,

                onSuccess: () => {
                    if (deleteImages.length > 0) {
                        deleteImage(deleteImages);
                    }
                },
            }
        );

        setFloorPlanList([]);
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
                return (
                    <StepFloorPlans
                        floorPlanList={floorPlanList}
                        setFloorPlanList={setFloorPlanList}
                    />
                );
            case 6:
                return (
                    <StepPayment
                        paymentPlanList={paymentPlanList}
                        setPaymentPlanList={setPaymentPlanList}
                    />
                );
            case 7:
                return <StepPortals />;
            default:
                return null;
        }
    }

    return (
        <div className="sectionContainer">
            <SectionTop heading={`Add New Project`} />
            <section className="sectionStyles">
                <MultiStepForm
                    totalSteps={7}
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
                                { title: "Floor Plans", svg: <SvgHome /> },
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

export default AddNewProject;
