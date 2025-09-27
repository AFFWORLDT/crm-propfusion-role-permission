import MultiStepForm from "../../ui/MultiStepForm";
import SectionTop from "../../ui/SectionTop";
import SvgInfo from "../../assets/info.svg?react";
import SvgBody from "../../assets/body.svg?react";
import SvgEngine from "../../assets/engine.svg?react";
import SvgGlass from "../../assets/glass.svg?react";
import SvgOBD from "../../assets/obd.svg?react";
import SvgEngineCompartment from "../../assets/engine-compartment.svg?react";
import SvgBrakes from "../../assets/brakes.svg?react";
import SvgElectricalControls from "../../assets/electrical-controls.svg?react";
import SvgSuspensionSteering from "../../assets/suspension-steering.svg?react";
import SvgInteriors from "../../assets/interiors.svg?react";
import SvgTyres from "../../assets/tyres.svg?react";
import SvgExteriors from "../../assets/exteriors.svg?react";
import SvgRoadTest from "../../assets/road-test.svg?react";
import SvgPhotos from "../../assets/photos.svg?react";
import StepBasicInfo from "./StepBasicInfo";
import StepBodyInspection from "./StepBodyInspection";
import StepBrakesInspection from "./StepBrakesInspection";
import StepElectricalControlsInspection from "./StepElectricalControlsInspection";
import StepEngineCompartmentInspection from "./StepEngineCompartmentInspection";
import StepEngineInspection from "./StepEngineInspection";
import StepExteriorsInspection from "./StepExteriorsInspection";
import StepGlassACInspection from "./StepGlassACInspection";
import StepInteriorsInspection from "./StepInteriorsInspection";
import StepOBDInspection from "./StepOBDInspection";
import StepPhotosAndComments from "./StepPhotosAndComments";
import StepRoadTestInspection from "./StepRoadTestInspection";
import StepSuspensionSteeringInspection from "./StepSuspensionSteeringInspection";
import StepTyresInspection from "./StepTyresInspection";
import { buildEditVehicle, buildVehicleData } from "../../utils/buildFormData";
import useImagesStore, { useSingleImageStore } from "../../store/imagesStore";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useVehicle from "./useVehicle";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../../pages/PageNotFound";
import useUpdateVehicle from "./useUpdateVehicle";
import useDeleteImageStore from "../../store/deleteImageStore";
import { useDeleteImage } from "../Extra/useDeleteImage";
import { useMyPermissions } from "../../hooks/useHasPermission";

function EditNewVehicle({ listingType }) {
    const { editVehicle, isPending } = useUpdateVehicle();
    const { images, setImages } = useImagesStore();
    const { images: deleteImages } = useDeleteImageStore();
    const { setImage, imageUrl } = useSingleImageStore();
    const { hasPermission } = useMyPermissions();

    const { deleteImage } = useDeleteImage();

    const { vehicleId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useVehicle(vehicleId);

    function renderStep(step) {
        switch (step) {
            case 1:
                return <StepBasicInfo listingType={listingType} />;
            case 2:
                return <StepBodyInspection />;
            case 3:
                return <StepEngineInspection />;
            case 4:
                return <StepGlassACInspection />;
            case 5:
                return <StepOBDInspection />;
            case 6:
                return <StepEngineCompartmentInspection />;
            case 7:
                return <StepBrakesInspection />;
            case 8:
                return <StepElectricalControlsInspection />;
            case 9:
                return <StepSuspensionSteeringInspection />;
            case 10:
                return <StepInteriorsInspection />;
            case 11:
                return <StepTyresInspection />;
            case 12:
                return <StepExteriorsInspection />;
            case 13:
                return <StepRoadTestInspection />;
            case 14:
                return <StepPhotosAndComments />;
            default:
                return null;
        }
    }

    useEffect(() => {
        if (data?.obd_report?.file_url) {
            setImage(data?.obd_report?.file_url);
        }
    }, []);

    function handleFormSubmit(data) {
        const newVehicle = buildVehicleData(data);
        const mainData = {
            ...newVehicle,
            obd_report: {
                diagnostic_report: data?.diagnostic_report?.value,
                file_url: imageUrl || null,
            },
        };
        editVehicle(
            {
                vehicleData: {
                    ...mainData,
                    listingType,
                    photos: images,
                },
                vehicleId: data.id,
            },
            {
                onSuccess: () => {
                    navigate(`/vehicles/${data.id}`);
                    if (deleteImages.length > 0) {
                        deleteImage(deleteImages);
                    }
                },
            }
        );
    }
    useEffect(() => {
        if (data?.photos) {
            setImages(data?.photos);
        }
    }, [data]);

    const defaultValues = buildEditVehicle(data);
    if (isLoading) return <Spinner type="fullPage" />;
    if (data === null) return <PageNotFound />;
    if (!hasPermission("update_vehicles")) return <PageNotFound />;

    return (
        <div className="sectionContainer">
            <SectionTop title="Add New Vehicle" />
            <section className="sectionStyles">
                <MultiStepForm
                    totalSteps={14}
                    renderStep={renderStep}
                    isSubmitting={isPending}
                    onFormSubmit={handleFormSubmit}
                    defaultValues={defaultValues}
                >
                    <div className="sectionDiv">
                        <MultiStepForm.ProgressBar
                            content={[
                                { title: "Basic", svg: <SvgInfo /> },
                                { title: "Body", svg: <SvgBody /> },
                                { title: "Engine", svg: <SvgEngine /> },
                                { title: "Glass/AC", svg: <SvgGlass /> },
                                { title: "OBD", svg: <SvgOBD /> },
                                {
                                    title: "Engine Comp.",
                                    svg: <SvgEngineCompartment />,
                                },
                                { title: "Brakes", svg: <SvgBrakes /> },
                                {
                                    title: "Electrical",
                                    svg: <SvgElectricalControls />,
                                },
                                {
                                    title: "Suspension",
                                    svg: <SvgSuspensionSteering />,
                                },
                                { title: "Interior", svg: <SvgInteriors /> },
                                { title: "Tyres", svg: <SvgTyres /> },
                                { title: "Exterior", svg: <SvgExteriors /> },
                                { title: "Road Test", svg: <SvgRoadTest /> },
                                { title: "Photos", svg: <SvgPhotos /> },
                            ]}
                        />
                    </div>
                </MultiStepForm>
            </section>
        </div>
    );
}

export default EditNewVehicle;
