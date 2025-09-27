import { useQuery } from "@tanstack/react-query";
import { getOwner } from "../../services/apiOwner";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./OwnerDetails.module.css";
import SectionTop from "../../ui/SectionTop";
import {
    User,
    Phone,
    Mail,
    CreditCard,
    FileText,
    MapPin,
    UserCircle,
    Info,
    Shield,
    Loader2,
    Upload,
    FileImage,
    Trash2,
} from "lucide-react";
import useUpdateOwner from "./useUpdateOwner";
import { useOwnerUploadDocs } from "./useOwnerUploadDocs";
import { useDeleteOwnerDocs } from "./useDeleteOwnerDocs";
import { useState } from "react";

function getFileType(fileUrl) {
    const extension = fileUrl?.split('.').pop()?.toLowerCase();
    return {
        isImage: ['jpg', 'jpeg', 'png', 'gif'].includes(extension),
        isPDF: extension === 'pdf',
        extension
    };
}

function OwnerDetails() {
    const { ownerId } = useParams();
  
    const { updateOwnerMutation, isPending } = useUpdateOwner();
    const { uploadDocs, isPending: isUploading } = useOwnerUploadDocs();
    const { deleteDocs, isPending: isDeleting } = useDeleteOwnerDocs();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);

    const {
        data: owner,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["owner", ownerId],
        queryFn: () => getOwner(ownerId),
        onError: (err) => {
            toast.error(err.message || "Failed to fetch owner details");
        },
    });

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            uploadDocs({ ownerId, files });
            event.target.value = '';
        }
    };

    const handleDeleteClick = (docUrl) => {
        setDocumentToDelete(docUrl);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (documentToDelete) {
            deleteDocs({ ownerId, documentUrl: documentToDelete });
            setShowDeleteModal(false);
            setDocumentToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setDocumentToDelete(null);
    };

    const handleKycToggle = () => {
     
        updateOwnerMutation({
            id: ownerId,
            data: {
                ...owner,
                kyc_verification: !owner?.kyc_verification,
            },
        });
    };
    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading owner details...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={styles.errorContainer}>
                <p>Error: {error?.message || "Failed to load owner data"}</p>
            </div>
        );
    }

    return (
        <>
            <div className="sectionContainer">
                <SectionTop title={`Owner Details`} />
                <section className="sectionStyles">
                    <div className={styles.ownerCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.headerLeft}>
                                {owner?.profile_pic ? (
                                    <img
                                        src={owner.profile_pic}
                                        alt="Owner Profile"
                                        className={styles.profileImage}
                                    />
                                ) : (
                                    <UserCircle className={styles.headerIcon} />
                                )}
                                <div className={styles.headerInfo}>
                                    <h3 className={styles.ownerName}>
                                        {owner?.owner_name || "N/A"}
                                    </h3>
                                    <p className={styles.ownerId}>
                                        ID: #{owner?.id}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.headerRight}>
                                <span className={styles.ownerType}>
                                    <Info className={styles.typeIcon} />
                                    {owner?.owner_type || "N/A"}
                                </span>
                                {owner?.kyc_verification !== undefined ? (
                                    <div className={styles.kycSwitchWrapper}>
                                        <label
                                            className={`${styles.switch} ${isPending ? styles.updating : ""}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    owner?.kyc_verification
                                                }
                                                onChange={handleKycToggle}
                                                disabled={isPending}
                                            />
                                            <span className={styles.slider}>
                                                {isPending && (
                                                    <span
                                                        className={
                                                            styles.loadingIndicator
                                                        }
                                                    >
                                                        <Loader2 size={14} />
                                                    </span>
                                                )}
                                            </span>
                                        </label>
                                        <span
                                            className={`${styles.kycLabel} ${owner?.kyc_verification ? styles.verified : styles.unverified}`}
                                        >
                                            {owner?.kyc_verification
                                                ? "KYC Verified"
                                                : "KYC Pending"}
                                        </span>
                                    </div>
                                ) : (
                                    <span
                                        className={`${styles.kycBadge} ${owner?.kyc_verification ? styles.verified : styles.unverified}`}
                                    >
                                        <Shield
                                            size={14}
                                            className={styles.badgeIcon}
                                        />
                                        {owner?.kyc_verification
                                            ? "KYC Verified"
                                            : "KYC Not Verified"}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className={styles.detailsGrid}>
                            <div className={styles.detailSection}>
                                <h4 className={styles.sectionTitle}>
                                    Basic Information
                                </h4>
                                <div className={styles.detailItem}>
                                    <User className={styles.detailIcon} />
                                    <div className={styles.detailContent}>
                                        <span className={styles.label}>
                                            Lessor Name
                                        </span>
                                        <span className={styles.value}>
                                            {owner?.lessor_name || "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.detailItem}>
                                    <CreditCard className={styles.detailIcon} />
                                    <div className={styles.detailContent}>
                                        <span className={styles.label}>
                                            Emirates ID
                                        </span>
                                        <span className={styles.value}>
                                            {owner?.lessor_emirates_id || "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.detailItem}>
                                    <FileText className={styles.detailIcon} />
                                    <div className={styles.detailContent}>
                                        <span className={styles.label}>
                                            License Number
                                        </span>
                                        <span className={styles.value}>
                                            {owner?.license_no || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.detailSection}>
                                <h4 className={styles.sectionTitle}>
                                    Contact Information
                                </h4>
                                <div className={styles.detailItem}>
                                    <Mail className={styles.detailIcon} />
                                    <div className={styles.detailContent}>
                                        <span className={styles.label}>
                                            Email
                                        </span>
                                        <span className={styles.value}>
                                            {owner?.lessor_email || "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.detailItem}>
                                    <Phone className={styles.detailIcon} />
                                    <div className={styles.detailContent}>
                                        <span className={styles.label}>
                                            Phone
                                        </span>
                                        <span className={styles.value}>
                                            {owner?.lessor_phone || "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.detailItem}>
                                    <Phone className={styles.detailIcon} />
                                    <div className={styles.detailContent}>
                                        <span className={styles.label}>
                                            Secondary Phone
                                        </span>
                                        <span className={styles.value}>
                                            {owner?.secondryPhone || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.detailSection}>
                                <h4 className={styles.sectionTitle}>
                                    Additional Information
                                </h4>
                                <div className={styles.detailItem}>
                                    <MapPin className={styles.detailIcon} />
                                    <div className={styles.detailContent}>
                                        <span className={styles.label}>
                                            Nationality
                                        </span>
                                        <span className={styles.value}>
                                            {owner?.nationality || "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.detailItem}>
                                    <User className={styles.detailIcon} />
                                    <div className={styles.detailContent}>
                                        <span className={styles.label}>
                                            Assigned Agent
                                        </span>
                                        <span className={styles.value}>
                                            {owner?.agent_name || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardDivider} />
                        <div className={styles.documentsSection}>
                            <div className={styles.documentsHeader}>
                                <div>
                                    <h3 className={styles.sectionTitle}>
                                        <FileText size={20} className={styles.sectionIcon} />
                                        <span>Documents</span>
                                    </h3>
                                    <p className={styles.subtitle}>Upload and manage owner documents</p>
                                </div>
                                <div className={styles.uploadContainer}>
                                    <input
                                        type="file"
                                        id="document-upload"
                                        multiple
                                        accept="image/*,.pdf,.doc,.docx"
                                        onChange={handleFileUpload}
                                        className={styles.fileInput}
                                        disabled={isUploading}
                                    />
                                    <label
                                        htmlFor="document-upload"
                                        className={`${styles.uploadButton} ${isUploading ? styles.uploading : ''}`}
                                    >
                                        <div className={styles.uploadIcon}>
                                            {isUploading ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : (
                                                <Upload size={20} />
                                            )}
                                        </div>
                                        <span className={styles.uploadText}>
                                            {isUploading ? 'Uploading...' : 'Upload Documents'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className={styles.documentGrid}>
                                {owner?.documents?.length > 0 ? (
                                    owner.documents.map((doc, index) => {
                                        const fileType = getFileType(doc);
                                        const fileName = doc.split('/').pop();
                                        return (
                                            <div key={index} className={styles.documentCard}>
                                                <div className={styles.documentContent}>
                                                    {fileType.isImage ? (
                                                        <img 
                                                            src={doc} 
                                                            alt={`Document ${index + 1}`}
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className={styles.documentIcon}>
                                                            {fileType.isPDF ? (
                                                                <FileText size={48} />
                                                            ) : (
                                                                <FileImage size={48} />
                                                            )}
                                                        </div>
                                                    )}
                                                    <button
                                                        className={`${styles.deleteButton} ${isDeleting && documentToDelete === doc ? styles.disabled : ''}`}
                                                        onClick={() => handleDeleteClick(doc)}
                                                        title="Delete document"
                                                        disabled={isDeleting}
                                                    >
                                                        {isDeleting && documentToDelete === doc ? (
                                                            <Loader2 size={20} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={20} />
                                                        )}
                                                    </button>
                                                </div>
                                                <div className={styles.documentFooter}>
                                                    <div className={styles.fileName}>
                                                        {fileName}
                                                    </div>
                                                    <a
                                                        href={doc}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.viewButton}
                                                    >
                                                        <FileText size={16} />
                                                        View
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className={styles.emptyDocuments}>
                                        <div className={styles.emptyIcon}>
                                            <FileText size={64} />
                                        </div>
                                        <h4>No documents uploaded yet</h4>
                                        <p className={styles.emptySubtitle}>
                                            Upload documents by clicking the button above
                                        </p>
                                        <label
                                            htmlFor="document-upload-empty"
                                            className={styles.emptyUploadButton}
                                        >
                                            <Upload size={16} />
                                            <span>Upload Now</span>
                                        </label>
                                        <input
                                            type="file"
                                            id="document-upload-empty"
                                            multiple
                                            accept="image/*,.pdf,.doc,.docx"
                                            onChange={handleFileUpload}
                                            className={styles.fileInput}
                                            disabled={isUploading}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Delete Document</h3>
                        <p>Are you sure you want to delete this document? This action cannot be undone.</p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.modalButtonCancel}
                                onClick={handleCancelDelete}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.modalButtonDelete}
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin mr-2" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default OwnerDetails;
