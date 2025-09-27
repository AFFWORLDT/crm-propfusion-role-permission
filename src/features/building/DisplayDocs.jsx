import Modal from "../../ui/Modal";
import ImageGallery from "react-image-gallery";
import useDeleteImageStore from "../../store/deleteImageStore";
import { useForm } from "react-hook-form";
import { useUploadImage } from "../../features/Extra/useUploadImage";
import styles from "./DisplayDocs.module.css";
import { useDocumentsStore } from "../../store/imagesStore";

const docsExtension = [".pdf", ".docx", ".xlsx", ".txt"];

function DisplayDocs({ isDoingAction, iconAction, filter = 'all' }) {
    const { documents, removeArrayDocument, setDocument } = useDocumentsStore();
    const { addImage: addDeleteImage } = useDeleteImageStore();
    const { isUploading } = useUploadImage();
    const { getValues, setValue, watch } = useForm({
        defaultValues: { selectedDocs: [], isEditMode: false },
    });

    const handleRemoveDoc = (doc) => {
        // Add to delete store
        addDeleteImage(doc.url);
        
        // Remove from documents state
        if (Array.isArray(documents[doc.type])) {
            removeArrayDocument(doc.type, doc.url);
        } else {
            setDocument(doc.type, "");
        }
    };

    // Get all documents as a flat array for display
    const getAllDocuments = () => {
        // If filter is 'all', return all documents
        if (filter === 'all') {
            const singleDocs = Object.entries(documents)
                .filter(([key, value]) => !Array.isArray(value) && value !== "")
                .map(([key, value]) => ({ type: key, url: value }));
                
            const arrayDocs = Object.entries(documents)
                .filter(([key, value]) => Array.isArray(value))
                .flatMap(([key, value]) => 
                    value.map(url => ({ type: key, url }))
                );

            return [...singleDocs, ...arrayDocs];
        }

        // If filter is specified, return only documents of that type
        if (Array.isArray(documents[filter])) {
            return documents[filter].map(url => ({ type: filter, url }));
        } else if (documents[filter] && documents[filter] !== "") {
            return [{ type: filter, url: documents[filter] }];
        }
        
        return [];
    };

    const allDocs = getAllDocuments();

    // If no documents, return null
    if (allDocs.length === 0 && !isUploading) {
        return null;
    }

    return (
        <div className={`${styles.docsContainer} ${isUploading ? styles.uploading : ''}`}>
            <div className={styles.docsGrid}>
                {allDocs.map((doc, i) => (
                    <div
                        className={styles.docItem}
                        key={i}
                    >
                        <div className={styles.docContent}>
                            {docsExtension.some((extension) =>
                                doc.url?.includes(extension)
                            ) ? (
                                <img
                                    className={styles.docIcon}
                                    src="/icons/document.svg"
                                    alt={doc.type}
                                />
                            ) : (
                                <img 
                                    className={styles.docImage} 
                                    src={doc.url} 
                                    alt={doc.type}
                                />
                            )}
                            <span className={styles.docType}>
                                {doc.type.replace(/_/g, ' ')}
                            </span>
                        </div>

                        <div className={styles.docActions}>
                            <button
                                type="button"
                                onClick={() => window.open(doc.url, "_blank")}
                                disabled={isDoingAction}
                                className={styles.actionButton}
                            >
                                <img src="/icons/download.svg" alt="Download" />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleRemoveDoc(doc)}
                                disabled={isDoingAction}
                                className={styles.actionButton}
                            >
                                <img src="/icons/delete.svg" alt="Remove" />
                            </button>

                            {!docsExtension.some((extension) =>
                                doc.url?.includes(extension)
                            ) && (
                                <BtnExpandImage
                                    isDoingAction={isDoingAction}
                                    imageUrl={doc.url}
                                    imagesData={allDocs.map(d => d.url)}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            {isUploading && (
                <div className={styles.uploadOverlay}>
                    <img src="/icons/spinner.svg" alt="Uploading..." />
                    <span>Uploading documents...</span>
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
                <button type="button" disabled={isDoingAction} className={styles.actionButton}>
                    <img src="/icons/expand.svg" alt="Expand" />
                </button>
            </Modal.Open>
            <Modal.Window name="imageExpand">
                <div className={styles.galleryContainer}>
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

export default DisplayDocs;
