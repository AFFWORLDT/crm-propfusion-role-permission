import Modal from "./Modal";
import styles from "./DisplayImages.module.css";
import ImageGallery from "react-image-gallery";
import { useCallback, useRef } from "react";
import { useImagesStore } from "../store/imagesStore";
import useDeleteImageStore from "../store/deleteImageStore";
import { useForm } from "react-hook-form";
import { useUploadImage } from "../features/Extra/useUploadImage";

const docsExtension = [".pdf", ".docx", ".xlsx", ".txt"];

function DisplayImagesOnAdd({
    // onAction,
    isDoingAction,
    iconAction,
}) {
    const { images, reorderImages, removeImage } = useImagesStore();
    const { addImage: addDeleteImage } = useDeleteImageStore();
    const { isUploading } = useUploadImage();
    const draggyImage = useRef(0);
    const draggedOverImage = useRef(0);
    const { getValues, setValue, watch } = useForm({
        defaultValues: { selectedImages: [], isEditMode: false },
    });
    const { addImage } = useDeleteImageStore();

    const selectedImages = watch("selectedImages");
    const isEditMode = watch("isEditMode");

    const handleSubmitForDeleteImages = () => {
        const selectedImages = getValues("selectedImages");
        addImage(selectedImages);
        selectedImages.forEach((imageUrl) => {
            removeImage(imageUrl);
        });
    };

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

    const handleToggleSelectAll = () => {
        const currentSelections = getValues("selectedImages");
        if (currentSelections.length === images.length) {
            setValue("selectedImages", []);
        } else {
            setValue("selectedImages", images);
        }
    };

    const handleSort = useCallback(() => {
        const isEditMode = watch("isEditMode");
        if (isEditMode) {
            return;
        }
        const imageClone = [...images];
        const startIndex = draggyImage.current;
        const endIndex = draggedOverImage.current;
        const temp = imageClone[startIndex];
        imageClone[startIndex] = imageClone[endIndex];
        imageClone[endIndex] = temp;

        reorderImages(imageClone);
    }, [images, reorderImages, watch]);

    const handleDelete = (imageUrl) => {
        return () => {
            removeImage(imageUrl);
            addDeleteImage(imageUrl, {
                onSuccess: () => {
                    removeImage(imageUrl);
                },
            });
        };
    };

    return (
        <>
            <div className={`${images.length > 0 ? styles.displayImages : styles.displayImagesEmpty} ${isUploading ? styles.uploading : ''}`}>
                {images?.map((imageUrl, i) => (
                    <div
                        className={`${styles.displayImageContainer} ${
                            selectedImages.includes(imageUrl) ? styles.selected : ""
                        }`}
                        key={i}
                        draggable
                        onDragStart={() => (draggyImage.current = i)}
                        onDragEnter={() => (draggedOverImage.current = i)}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnd={handleSort}
                        onClick={() => isEditMode && toggleImageSelection(imageUrl)}
                    >
                        <div className="imgContainer">
                            {docsExtension.some((extension) =>
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
                            {docsExtension.some((extension) =>
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
                                        imagesData={images}
                                    />
                                    <button
                                        type="button"
                                        disabled={isDoingAction}
                                        onClick={() =>
                                            window.open(imageUrl, "_blank")
                                        }
                                    >
                                        <img src="/icons/download.svg" />
                                    </button>
                                </>
                            )}

                            <button
                                type="button"
                                onClick={handleDelete(imageUrl)}
                                disabled={isDoingAction}
                            >
                                <img src={iconAction} />
                            </button>
                        </div>
                    </div>
                ))}
                
                <div
                    className={`${images.length > 0 ? styles.displayImageContainer : styles.displayImagesEmpty}`}
                    style={{ cursor: "pointer" }}
                    onClick={handleEditModeToggle}
                >
                    <div className="imgContainer">
                        {!isEditMode ? (
                            <img
                                src="/icons/edit.svg"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    objectFit: "contain",
                                    color: "blue",
                                }}
                            />
                        ) : (
                            <img
                                src="/icons/cross.svg"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    objectFit: "contain",
                                    color: "blue",
                                }}
                            />
                        )}
                    </div>
                </div>

                {isEditMode && images?.length > 0 && (
                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.submitButton}
                            disabled={selectedImages.length === 0}
                            onClick={handleSubmitForDeleteImages}
                        >
                            {"Delete"}
                        </button>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={handleToggleSelectAll}
                        >
                            {selectedImages.length === images.length
                                ? "Deselect All"
                                : "Select All"}
                        </button>
                    </div>
                )}
            </div>
            
            {isUploading && (
                <div className={styles.uploadOverlay}>
                    <img src="/icons/spinner.svg" alt="Uploading..." />
                    <span>Uploading images...</span>
                </div>
            )}
        </>
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

export default DisplayImagesOnAdd;
