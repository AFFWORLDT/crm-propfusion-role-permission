import MultiStepForm from "../../ui/MultiStepForm";
import SectionTop from "../../ui/SectionTop";
import SvgInfo from "../../assets/info.svg?react";
import SvgDescription from "../../assets/description.svg?react";
import SvgMedia from "../../assets/media.svg?react";
import SvgPortals from "../../assets/portals.svg?react";
import useCreateProperty from "../../features/properties/useCreateProperty";
import {
    buildEditPropertyData,
    buildPropertyData,
} from "../../utils/buildFormData";
import StepInfo from "../../features/properties/StepInfo";
import StepDescription from "../../features/properties/StepDescription";
import StepMedia from "../../features/properties/StepMedia";
import StepPortals from "../../features/properties/StepPortals";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AMENITIES_OPTIONS } from "../../utils/constants";
import useImagesStore from "../../store/imagesStore";
import useDeleteImageStore from "../../store/deleteImageStore";
import { useDeleteImage } from "../../features/Extra/useDeleteImage";

function AddProperty({ listingType }) {
    const { addProperty, isPending } = useCreateProperty();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { images: deleteImages } = useDeleteImageStore();
    const { deleteImage } = useDeleteImage();
    const { images } = useImagesStore();

    const { state: defaultState } = useLocation();
    const defaultValues = defaultState
        ? buildEditPropertyData(defaultState, AMENITIES_OPTIONS)
        : {};

    function handleFormSubmit(data, handleReset) {
        const newProperty = buildPropertyData(data, listingType);

        newProperty.status = searchParams.get("save") ?? "ACTIVE";

        if (defaultState) {
            newProperty.ownerDocs = defaultState.ownerDocs;
            newProperty.photos = defaultState.photos;
        }

        delete newProperty.telCodePrimary;
        delete newProperty.telCodeSecondary;

        addProperty(
            {
                newProperty: {
                    ...newProperty,
                    photos: images,
                },
                ownerDocs: data.ownerDocs,
                photos: data.photos,
                video: data.video,
                permit_qr_code: data?.permit_qr_code,
            },
            {
                onSettled: data
                    ? () =>
                          navigate(`/for-${listingType.toLowerCase()}/new-list`)
                    : handleReset,
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
                        isEditSession={defaultState ? true : false}
                        propertyData={defaultState}
                    />
                );
            case 4:
                return <StepPortals />;
            default:
                return null;
        }
    }

    return (
        <div className="sectionContainer">
            <SectionTop
                heading={`Add ${listingType[0] + listingType.toLowerCase().slice(1)}`}
            />
            <section className="sectionStyles">
                <MultiStepForm
                    totalSteps={4}
                    renderStep={renderStep}
                    onFormSubmit={handleFormSubmit}
                    isSubmitting={isPending}
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

export default AddProperty;
