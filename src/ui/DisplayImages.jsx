import Modal from "./Modal";
import styles from "./DisplayImages.module.css";
import ImageGallery from "react-image-gallery";
import { useCallback, useRef } from "react";
import useUpdateProperty from "../features/properties/useUpdateProperty";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import useDeletePropertyImage from "../features/properties/useDeletePropertyImage";

const docsExtension = [".pdf", ".docx", ".xlsx", ".txt"];

function DisplayImages({ imagesData, onAction, isDoingAction, iconAction, iShowMultiSelect = true }) {
    const { changeProperty, isPending } = useUpdateProperty();
    const { removePropertyImage, isPending: isDeleting } = useDeletePropertyImage()
    const draggyImage = useRef(0);
    const draggedOverImage = useRef(0);
    const { propertyId } = useParams();
    const { getValues, setValue, watch } = useForm({
        defaultValues: { selectedImages: [], isEditMode: false },
    });

    const selectedImages = watch("selectedImages");
    const isEditMode = watch("isEditMode");
    const handleSubmitForDeleteImages = () => {
        const selectedImages = getValues("selectedImages");
        removePropertyImage({
            propertyId: propertyId,
            imageUrl: selectedImages
        }, {
            onSuccess: () => {
                setValue("selectedImages", []);
            }
        });

    }
    const handleEditModeToggle = () => {
        setValue("isEditMode", !isEditMode);
        if (isEditMode) {
            setValue("selectedImages", []);
        }
    };

    const toggleImageSelection = (imageUrl) => {
        const currentSelections = getValues("selectedImages");
        if (currentSelections.includes(imageUrl)) {
            setValue(
                "selectedImages",
                currentSelections.filter((url) => url !== imageUrl)
            );
        } else {
            setValue("selectedImages", [...currentSelections, imageUrl]);
        }
    };

    const handleSort = useCallback(() => {
        const isEditMode = watch("isEditMode");
        if (isEditMode) {
            return;
        }
        const imageClone = [...imagesData];
        const draggedItem = imageClone[draggyImage.current];
        imageClone.splice(draggyImage.current, 1);
        imageClone.splice(draggedOverImage.current, 0, draggedItem);

        changeProperty({
            id: propertyId,
            updatedProperty: {
                photos: imageClone,
            },
        });
    }, [watch, imagesData, changeProperty, propertyId]);



    const handleToggleSelectAll = () => {
        const currentSelections = getValues("selectedImages");
        if (currentSelections.length === imagesData.length) {
            setValue("selectedImages", []);
        } else {
            setValue("selectedImages", imagesData);
        }
    };


    return (
        <div className={styles.displayImages}>
            {imagesData?.map((imageUrl, i) => (
                <div
                    className={`${styles.displayImageContainer} ${selectedImages.includes(imageUrl) ? styles.selected : ""
                        }`}
                    key={i}
                    draggable={!isPending || isEditMode}
                    onDragStart={() => (draggyImage.current = i)}
                    onDragEnter={() => (draggedOverImage.current = i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnd={handleSort}
                    onClick={() => isEditMode && toggleImageSelection(imageUrl)}
                >
                    <div className="imgContainer">
                        {docsExtension?.some((extension) =>
                            imageUrl?.includes(extension)
                        ) ? (
                            <img
                                style={{
                                    width: "5.6rem",
                                    height: "5.6rem",
                                }}
                                src="/icons/document.svg"
                            />
                        ) : (
                            <img src={imageUrl} />
                        )}
                    </div>

                    <div className={styles.imgOperations}>
                        {docsExtension?.some((extension) =>
                            imageUrl?.includes(extension)
                        ) ? (
                            <button
                                type="button"
                                onClick={() => window.open(imageUrl, "_blank")}
                            >
                                <img src="/icons/download.svg" />
                            </button>
                        ) : (
                            <>
                                <BtnExpandImage
                                    isDoingAction={isDoingAction}
                                    imageUrl={imageUrl}
                                    imagesData={imagesData}
                                />
                                <button
                                    type="button"
                                    disabled={isDoingAction}
                                    onClick={() => window.open(imageUrl, "_blank")}
                                >
                                    <img src="/icons/download.svg" />
                                </button>
                            </>
                        )}

                        <button
                            type="button"
                            onClick={onAction(imageUrl)}
                            disabled={isDoingAction}
                        >
                            <img src={iconAction} />
                        </button>
                    </div>
                </div>
            ))}
            <div
                className={styles.displayImageContainer}
                style={{ cursor: "pointer" }}
                onClick={handleEditModeToggle}
            >
                {iShowMultiSelect && (
                    imagesData?.length > 0 ? (
                        <div className="imgContainer">
                            {
                                !isEditMode ? (
                                    <img src="/icons/edit.svg" style={{
                                        width: "30px",
                                        height: "30px",
                                        objectFit: "contain",
                                        color: "blue",
                                    }} />
                                ) : (
                                    <img src="/icons/cross.svg" style={{
                                        width: "30px",
                                        height: "30px",
                                        objectFit: "contain",
                                        color: "blue",
                                    }} />
                                )
                            }
                        </div>
                    ) : (<div className="imgContainer"></div>
                    )
                )}
            </div>

            {iShowMultiSelect && (isEditMode && imagesData?.length > 0) && (
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.submitButton}
                        disabled={selectedImages.length === 0}
                        onClick={handleSubmitForDeleteImages}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={handleToggleSelectAll}
                    >
                        {selectedImages.length === imagesData.length
                            ? "Deselect All"
                            : "Select All"}
                    </button>
                </div>
            )}
        </div>
    );
}

export function BtnExpandImage({ isDoingAction, imageUrl, imagesData }) {
    const selectedIndex = imagesData.findIndex((image) => image === imageUrl);
    return (
        <Modal>
            <Modal.Open openWindowName="imageExpand">
                <button type="button" disabled={isDoingAction}>
                    <img src="/icons/expand.svg" />
                </button>
            </Modal.Open>
            <Modal.Window name="imageExpand">
                <div
                    className="imgContainer"
                    style={{
                        borderTopRightRadius: 100,
                        marginRight: 10,
                    }}
                >
                    <ImageGallery
                        additionalClass="propertyImageGallery"
                        items={
                            imagesData?.map((imageUrl) => ({
                                original: imageUrl,
                                thumbnail: imageUrl,
                            })) || []
                        }
                        showNav={false}
                        thumbnailPosition="right"
                        showPlayButton={false}
                        autoPlay
                        startIndex={selectedIndex}
                        showBullets={true}
                    />
                </div>
            </Modal.Window>
        </Modal>
    );
}

export default DisplayImages;
