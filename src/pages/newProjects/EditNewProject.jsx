import SectionTop from "../../ui/SectionTop";
import MultiStepForm from "../../ui/MultiStepForm";
import SvgMap from "../../assets/map.svg?react";
import SvgInfo from "../../assets/info.svg?react";
import SvgDescription from "../../assets/description.svg?react";
import SvgMedia from "../../assets/media.svg?react";
import SvgHome from "../../assets/home.svg?react";
import SvgCard from "../../assets/card.svg?react";
import SvgPortals from "../../assets/portals.svg?react";
import StepFloorPlans from "../../features/newProjects/StepFloorPlans";
import StepLocation from "../../features/newProjects/StepLocation";
import StepPayment from "../../features/newProjects/StepPayment";
import StepPhotos from "../../features/newProjects/StepPhotos";
import StepDescription from "../../features/newProjects/StepDescription";
import StepInfo from "../../features/newProjects/StepInfo";
import StepPortals from "../../features/newProjects/StepPortals";
import useUpdateProject from "../../features/newProjects/useUpdateProject";
import useProject from "../../features/newProjects/useProject";
import { buildProjectData } from "../../utils/buildFormData";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import { AMENITIES_OPTIONS, PROPERTY_TYPES } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import PageNotFound from "../PageNotFound";
import useImagesStore from "../../store/imagesStore";
import useDeleteImageStore from "../../store/deleteImageStore";
import { useDeleteImage } from "../../features/Extra/useDeleteImage";
import { formatLocationsOptions } from "../../utils/utils";

function EditNewProject() {
    const { images, setImages } = useImagesStore();
    const { images: deleteImages } = useDeleteImageStore();
    const { deleteImage } = useDeleteImage();
    const {
        data: projectData,
        isLoading: isLoadingProject,
        error: errorProject,
    } = useProject();
    const { changeProject, isPending: isUpdatingProject } = useUpdateProject();

    const navigate = useNavigate();
    const [floorPlanList, setFloorPlanList] = useState([]);
    const [paymentPlanList, setPaymentPlanList] = useState([]);

    // Floor plans added by user
    const newFloorPlans = floorPlanList.filter(
        (floorPlan) => !Object.keys(floorPlan).includes("id")
    );

    // Payment plans added by user
    const newPaymentPlans = paymentPlanList.filter(
        (paymentPlan) => !Object.keys(paymentPlan).includes("id")
    );

    useEffect(() => {
        if (errorProject) toast.error(errorProject.message);
    }, [errorProject]);

    useEffect(() => {
        if (projectData?.[0]?.photos) {
            setImages(projectData[0].photos);
        }
    }, [projectData, setImages]);

    // Initialize floor plans and payment plans only once when projectData is first loaded
    useEffect(() => {
        if (projectData?.[0] && floorPlanList.length === 0) {
            setFloorPlanList(projectData[0].floor_plans ?? []);
        }
        if (projectData?.[0] && paymentPlanList.length === 0) {
            setPaymentPlanList(projectData[0].payment_plans ?? []);
        }
    }, [projectData]);

    function handleFormSubmit(data) {
        const updatedProject = buildProjectData(data);

        changeProject(
            {
                projectId: data.id,
                photos: data.photos,
                updatedProject: {
                    ...updatedProject,
                    photos: images,
                },
                newFloorPlans,
                Brochure: data.brochure,
                masterPlans: data.masterPlans,
                video: data?.video,
                paymentPlanList: newPaymentPlans,
                permit_qr_code:data?.permit_qr_code
            },
            {
                onSettled: () => {
                    if (deleteImages.length > 0) {
                        deleteImage(deleteImages);
                    }
                    navigate(`/new-projects/list/${data.id}`);
                },
            },
            {
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
                return (
                    <StepPhotos
                        isEditSession={true}
                        projectData={projectData[0]}
                    />
                );
            case 5:
                return (
                    <StepFloorPlans
                        floorPlanList={floorPlanList}
                        setFloorPlanList={setFloorPlanList}
                        isEditSession={true}
                        projectId={projectData[0].id}
                    />
                );
            case 6:
                return (
                    <StepPayment
                        paymentPlanList={paymentPlanList}
                        setPaymentPlanList={setPaymentPlanList}
                        isEditSession={true}
                        projectId={projectData[0].id}
                    />
                );
            case 7:
                return <StepPortals />;
            default:
                return null;
        }
    }

    if (isLoadingProject) return <Spinner type="fullPage" />;
    if (projectData.length === 0) return <PageNotFound />;

    const paramObj = projectData[0].newParam;

    const defaultValues = {
        ...projectData[0],
        ...projectData[0].payment_planParam,
        payment_plans: paymentPlanList,
        ...paramObj,
        governmentFees: projectData[0].governmentFees,
        handoverTime: paramObj.handoverTime
            ? new Date(paramObj.handoverTime)
            : "",
        agent_Id: projectData[0].agent_Id
            ? {
                  label: projectData[0]?.agent?.name,
                  value: projectData[0]?.agent_Id,
              }
            : null,
        area_id: projectData[0].area_id
            ? {
                  label: projectData[0]?.area?.name,
                  value: projectData[0]?.area_id,
              }
            : null,
        developerId: projectData[0]?.developerId
            ? {
                  label: projectData[0]?.developer?.name,
                  value: projectData[0]?.developerId,
              }
            : null,
        propertyTypes: PROPERTY_TYPES.filter((obj) =>
            projectData[0].propertyTypes?.includes(obj.value)
        ).map((obj) => {
            return {
                label: obj.label,
                value: obj.value,
            };
        }),
        amenities: AMENITIES_OPTIONS.filter((obj) =>
            paramObj.amenities?.includes(obj.code)
        ).map((obj) => {
            return {
                label: obj.label,
                value: obj.code,
            };
        }),
        pool_type: projectData[0].pool_type
            ? {
                  label: projectData[0].pool_type,
                  value: projectData[0].pool_type,
              }
            : null,
        location: projectData[0]?.location
            ? formatLocationsOptions([projectData[0]?.location])[0]
            : "",
        saleStartDate: projectData[0].saleStartDate
            ? new Date(projectData[0].saleStartDate)
            : "",
    };

    delete defaultValues.photos;
    delete defaultValues.newParam;
    delete defaultValues.payment_planParam;
    delete defaultValues.floor_plans;
    delete defaultValues.masterPlans;
    delete defaultValues.video;

    return (
        <div className="sectionContainer">
            <SectionTop heading={`Edit New Project`} />
            <section className="sectionStyles">
                <MultiStepForm
                    totalSteps={7}
                    renderStep={renderStep}
                    onFormSubmit={handleFormSubmit}
                    isSubmitting={isUpdatingProject}
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

export default EditNewProject;
