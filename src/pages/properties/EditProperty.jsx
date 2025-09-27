import MultiStepForm from "../../ui/MultiStepForm";
import SectionTop from "../../ui/SectionTop";
import SvgInfo from "../../assets/info.svg?react";
import SvgDescription from "../../assets/description.svg?react";
import SvgMedia from "../../assets/media.svg?react";
import SvgPortals from "../../assets/portals.svg?react";
import useNewProperty from "../../features/properties/useNewProperty";
import useUpdateProperty from "../../features/properties/useUpdateProperty";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import {
    buildEditPropertyData,
    buildPropertyData,
} from "../../utils/buildFormData";
import StepInfo from "../../features/properties/StepInfo";
import StepDescription from "../../features/properties/StepDescription";
import StepMedia from "../../features/properties/StepMedia";
import StepPortals from "../../features/properties/StepPortals";
import PageNotFound from "../PageNotFound";
import useStaff from "../../features/admin/staff/useStaff";
import { AMENITIES_OPTIONS, PROPERTY_TYPES_02 } from "../../utils/constants";
import useImagesStore from "../../store/imagesStore";
import useDeleteImageStore from "../../store/deleteImageStore";
import { useDeleteImage } from "../../features/Extra/useDeleteImage";
import { useMyPermissions } from "../../hooks/useHasPermission";

function EditProperty({ listingType }) {
    const { hasPermission } = useMyPermissions();

    const { images, setImages } = useImagesStore();
    const { images: deleteImages } = useDeleteImageStore();
    const { deleteImage } = useDeleteImage();
    let propertyTypesOptions = {};
    Object.keys(PROPERTY_TYPES_02 || {}).map((optGroupKey) => {
        propertyTypesOptions[optGroupKey] = [
            {
                value: "",
                label: "SELECT PROPERTY".toLowerCase(),
            },
            ...PROPERTY_TYPES_02[optGroupKey].map((item) => ({
                value: item.label,
                label: item.label.toLowerCase(),
            })),
        ];
    });

    const {
        data: propertyData,
        isLoading: isLoadingProperty,
        error: errorProperty,
    } = useNewProperty();
    const { changeProperty, isPending: isUpdatingProperty } =
        useUpdateProperty();

    useEffect(() => {
        if (propertyData?.[0]?.photos) {
            setImages(propertyData[0].photos);
        }
    }, []);

    const navigate = useNavigate();
    const { data: staffData } = useStaff();

    useEffect(() => {
        if (errorProperty) toast.error(errorProperty.message);
    }, [errorProperty]);

    function handleFormSubmit(data) {
        const updatedProperty = buildPropertyData(data, listingType);
        changeProperty(
            {
                id: data.id,
                updatedProperty: {
                    ...updatedProperty,
                    photos: images,
                },
                ownerDocs: data.ownerDocs,
                photos: data.photos,
                video: data.video,
                staff_qr_code_id: data.staff_qr_code_id
                    ? data.staff_qr_code_id?.value
                    : null,
                permit_qr_code: data?.permit_qr_code,
            },
            {
                onSettled: () =>
                    navigate(
                        `/for-${listingType.toLowerCase()}/new-list/${data.id}`
                    ),
                onSuccess: () => {
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
                return <StepInfo type={listingType} />;
            case 2:
                return <StepDescription />;
            case 3:
                return (
                    <StepMedia
                        isEditSession={true}
                        propertyData={propertyData[0]}
                    />
                );
            case 4:
                return <StepPortals />;
            default:
                return null;
        }
    }

    if (isLoadingProperty) return <Spinner type="fullPage" />;
    if (propertyData.length === 0) return <PageNotFound />;

    const defaultValues = buildEditPropertyData(
        propertyData[0],
        AMENITIES_OPTIONS,
        staffData,
        propertyTypesOptions
    );

    if (!hasPermission("update_properties")) {
        return <PageNotFound />;
    }
    return (
        <div className="sectionContainer">
            <SectionTop
                heading={`Edit ${listingType[0] + listingType.toLowerCase().slice(1)}`}
            />
            <section className="sectionStyles">
                <MultiStepForm
                    totalSteps={4}
                    renderStep={renderStep}
                    onFormSubmit={handleFormSubmit}
                    isSubmitting={isUpdatingProperty}
                    defaultValues={defaultValues}
                >
                    <div className="sectionDiv">
                        <MultiStepForm.ProgressBar
                            content={[
                                { title: "Information", svg: <SvgInfo /> },
                                {
                                    title: "Description",
                                    svg: <SvgDescription />,
                                },
                                {
                                    title: "Media",
                                    svg: <SvgMedia />,
                                },
                                { title: "Portals", svg: <SvgPortals /> },
                            ]}
                        />
                    </div>
                </MultiStepForm>
            </section>
        </div>
    );
}

export default EditProperty;
