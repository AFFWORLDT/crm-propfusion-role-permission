import { useGetWatchmenById } from "../../features/watchmen/useGetWatchmenById";
import SectionTop from "../../ui/SectionTop";
import styles from "./watchmenDetails.module.css";
import { Mail, Phone, MapPin, Calendar, Shield, User, FileText, Upload, FileImage, Trash2, Loader2, Edit2, XCircle } from "lucide-react";
import Spinner from "../../ui/Spinner";
import { useUploadWatchmanDocs } from "../../features/watchmen/useUploadWatchmendocs";
import { useState } from "react";
import { useDeleteWatchmanDocument } from "../../features/watchmen/useDeleteWatchmanDocument";
import useUpdateKycStatus from "../../features/watchmen/useUpdateKycStatus";
import Modal from "../../ui/Modal";
import AddWatchmenForm from "../../features/watchmen/AddWatchmenForm";
import { toast } from "react-hot-toast";

function getFileType(fileUrl) {
    const extension = fileUrl?.split('.').pop()?.toLowerCase();
    return {
        isImage: ['jpg', 'jpeg', 'png', 'gif'].includes(extension),
        isPDF: extension === 'pdf',
        extension
    };
}

function WatchmenDetails() {
    const { watchman, isLoading, isError, error } = useGetWatchmenById();
    const { uploadDocs, isPending } = useUploadWatchmanDocs();
    const { deleteDocument, isPending: isDeleting } = useDeleteWatchmanDocument();
    const { updateKycStatus, isUpdatingKyc } = useUpdateKycStatus();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);

    const isPendingVerification = watchman?.status === 'pending' || watchman?.status === 'inactive';

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            uploadDocs({ watchmanId: watchman.id, files });
        }
    };

    const handleDeleteClick = (docUrl) => {
        setDocumentToDelete(docUrl);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (documentToDelete) {
            deleteDocument({ watchmanId: watchman.id, documentUrl: documentToDelete });
            setShowDeleteModal(false);
            setDocumentToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setDocumentToDelete(null);
    };

    const handleKycToggle = async () => {
     
        if (isPendingVerification) {
            toast.error("Cannot modify KYC status while watchman is pending or inactive");
            return;
        }
        try {
            isUpdatingKyc && toast.loading("Updating KYC status...");
            updateKycStatus({ watchmanId: watchman.id, kycStatus: !watchman.kyc_verification });
        } catch (error) {
            console.error('Error updating KYC status:', error);
        }
    };

    if (isLoading) return <Spinner type="fullPage" />;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div>
            <div className="sectionContainer">
                <SectionTop heading="Watchmen Details"></SectionTop>
                <div className={"sectionStyles"}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.avatarContainer}>
                                {watchman?.profile_pic ? (
                                    <img
                                        src={watchman.profile_pic}
                                        alt={watchman.name}
                                        className={styles.avatar}
                                    />
                                ) : (
                                    <div className={styles.avatarFallback}>
                                        <User size={32} />
                                    </div>
                                )}
                            </div>

                            <div className={styles.headerContent}>
                                <div>
                                    <h2 className={styles.cardTitle}>{watchman?.name}</h2>
                                </div>
                                <div className={styles.badgeWrapper}>
                                    { (
                                        <div className={styles.kycSwitchWrapper}>
                                            <label className={`${styles.switch} ${isUpdatingKyc ? styles.updating : ''} ${isPendingVerification ? styles.pending : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={watchman?.kyc_verification}
                                                    onChange={handleKycToggle}
                                                    disabled={isUpdatingKyc }
                                                />
                                                <span className={styles.slider}>
                                                    {isUpdatingKyc && (
                                                        <span className={styles.loadingIndicator}>
                                                            <Loader2 size={14} />
                                                        </span>
                                                    )}
                                                    {isPendingVerification && (
                                                        <span className={styles.pendingIndicator}>
                                                            <XCircle size={14} />
                                                        </span>
                                                    )}
                                                </span>
                                            </label>
                                            <span className={`${styles.kycLabel} ${watchman?.kyc_verification ? styles.verified : styles.unverified} ${isPendingVerification ? styles.pending : ''}`}>
                                                {isPendingVerification
                                                    ? 'Verification Locked'
                                                    : watchman?.kyc_verification
                                                        ? 'KYC Verified'
                                                        : 'KYC Pending'
                                                }
                                            </span>
                                        </div>
                                    )  (
                                        <span className={`${styles.badge} ${watchman?.kyc_verification ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            <Shield size={14} className={styles.badgeIcon} />
                                            <span>{watchman?.kyc_verification ? "KYC Verified" : "KYC Not Verified"}</span>
                                        </span>
                                    )}

                                    { (
                                        <Modal>
                                            <Modal.Open openWindowName={`edit-watchman-${watchman?.id}`}>
                                                <button
                                                    className={styles.editButton}
                                                    aria-label="Edit watchman"
                                                >
                                                    <Edit2 size={20} />
                                                </button>
                                            </Modal.Open>
                                            <Modal.Window name={`edit-watchman-${watchman?.id}`}>
                                                <AddWatchmenForm watchmanToEdit={watchman} />
                                            </Modal.Window>
                                        </Modal>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardDivider} />

                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <Mail size={18} className={styles.infoIcon} />
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>Email</span>
                                    <span className={styles.infoValue}>{watchman?.email || "N/A"}</span>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <Phone size={18} className={styles.infoIcon} />
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>Contact Number</span>
                                    <span className={styles.infoValue}>{watchman?.contact_no || "N/A"}</span>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <MapPin size={18} className={styles.infoIcon} />
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>Address</span>
                                    <span className={styles.infoValue}>{watchman?.address || "N/A"}</span>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <Calendar size={18} className={styles.infoIcon} />
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>Created At</span>
                                    <span className={styles.infoValue}>
                                        {watchman?.created_at ? new Date(watchman.created_at).toLocaleDateString() : "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <Shield size={18} className={styles.infoIcon} />
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>ID</span>
                                    <span className={styles.infoValue}>{watchman?.id || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardDivider} />
                        <div className={styles.documentsSection}>
                            <div className={styles.documentsHeader}>
                                <div>
                                    <h3 className={styles.sectionTitle}>
                                        <FileText size={18} className={styles.sectionIcon} />
                                        <span>Documents</span>
                                    </h3>
                                    <p className={styles.subtitle}>Upload and manage watchman documents</p>
                                </div>
                                <div className={styles.uploadContainer}>
                                    <input
                                        type="file"
                                        id="document-upload"
                                        multiple
                                        accept="image/*,.pdf,.doc,.docx"
                                        onChange={handleFileUpload}
                                        className={styles.fileInput}
                                        disabled={isPending}
                                    />
                                    <label
                                        htmlFor="document-upload"
                                        className={`${styles.uploadButton} ${isPending ? styles.uploading : ''}`}
                                    >
                                        <div className={styles.uploadContent}>
                                            <div className={styles.uploadIcon}>
                                                <Upload size={18} />
                                            </div>
                                            <span className={styles.uploadText}>
                                                {isPending ? (
                                                    <>
                                                        <span className={styles.uploadingText}>Uploading...</span>
                                                        <div className={styles.uploadProgress}>
                                                            <div className={styles.progressBar}></div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Upload Documents</span>
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className={styles.documentGrid}>
                                {watchman?.documents?.length > 0 ? (
                                    watchman.documents.map((doc, index) => {
                                        const fileType = getFileType(doc);
                                        return (
                                            <div key={index} className={styles.documentCard}>
                                                <div className={styles.documentContent}>
                                                    {fileType.isImage ? (
                                                        <img src={doc} alt={`Document ${index + 1}`} />
                                                    ) : (
                                                        <div className={styles.documentIcon}>
                                                            {fileType.isPDF ? (
                                                                <FileText size={48} />
                                                            ) : (
                                                                <FileImage size={48} />
                                                            )}
                                                            <span className={styles.fileName}>
                                                                {doc.split('/').pop()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <button
                                                        className={`${styles.deleteButton} ${isDeleting ? styles.disabled : ''}`}
                                                        onClick={() => handleDeleteClick(doc)}
                                                        title="Delete document"
                                                        disabled={isDeleting}
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                                <a
                                                    href={doc}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.viewButton}
                                                >
                                                    <FileText size={16} />
                                                    View Document
                                                </a>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className={styles.emptyDocuments}>
                                        <FileText size={48} />
                                        <p>No documents uploaded yet</p>
                                        <p className={styles.emptySubtitle}>Upload documents to get started</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
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
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.modalButtonDelete}
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WatchmenDetails;
