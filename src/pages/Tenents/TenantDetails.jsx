import { useParams, useNavigate } from "react-router-dom";
import { useTenant } from "./useTenants";
import {
    Phone,
    Mail,
    UserSquare2,
    Building2,
    FileText,
    Printer,
    Bell,
    MoreVertical,
    User,
    MapPin,
    Calendar,
    DollarSign,
    Shield,
    FileCheck,
    Upload,
    FileImage,
    FileText as FileTextIcon,
    Trash2,
} from "lucide-react";
import styles from "./TenantDetails.module.css";
import Spinner from "../../ui/Spinner";
import SectionTop from "../../ui/SectionTop";
import { useUploadTenantsDocs } from "./useUploadTenantsDocs";
import { useUpdateTenant } from "../../features/Tenants/useUpdate";
import { useDeleteTenantDocument } from "./useDeleteTenentDocument";
import { useState } from "react";
import AddRentalAgreeMent from "../../features/rental-agreement/AddRentalAgreeMent";

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-AE", {
        style: "currency",
        currency: "AED",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        notation: amount >= 1000000 ? "compact" : "standard",
    }).format(amount);
}

function getFileType(fileUrl) {
    const extension = fileUrl.split(".").pop().toLowerCase();
    return {
        isImage: ["jpg", "jpeg", "png", "gif"].includes(extension),
        isPDF: extension === "pdf",
        extension,
    };
}

function TenantDetails() {
    const { tenantId } = useParams();
    const navigate = useNavigate();
    const { update, isPending: isUpdating } = useUpdateTenant();
    const { deleteDocument, isPending: isDeleting } = useDeleteTenantDocument();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);

    const { tenant, isLoading } = useTenant(tenantId);
    const { uploadDocs, isPending, error } = useUploadTenantsDocs();

    const handleKycToggle = () => {
        update({
            id: tenantId,
            data: { kyc_verification: !tenant.kyc_verification },
        });
    };

    const handleViewDetails = (propertyId) => {
        navigate(`/for-rent/new-list/${propertyId}`);
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            uploadDocs({ tenantId, files });
        }
    };

    const handleDeleteClick = (docUrl) => {
        setDocumentToDelete(docUrl);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (documentToDelete) {
            deleteDocument({ tenantId, documentUrl: documentToDelete });
            setShowDeleteModal(false);
            setDocumentToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setDocumentToDelete(null);
    };

    if (isLoading)
        return (
            <div className={styles.loaderContainer}>
                <Spinner />
            </div>
        );
    if (!tenant)
        return (
            <div className={styles.error}>
                <p>Tenant not found.</p>
            </div>
        );

    return (
        <div className="sectionContainer">
            <SectionTop heading="Tenant Details" />
            <section className="sectionStyles">
                <div className={styles.header}>
                    <div>
                        <h1>Tenant Details</h1>
                        <p className={styles.subtitle}>
                            View and manage tenant information
                        </p>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.actionButton}>
                            <Printer size={16} />
                            Print
                        </button>
                        <button className={styles.actionButton}>
                            <Mail size={16} />
                            Email Tenant
                        </button>
                        <button className={styles.actionButton}>
                            <Bell size={16} />
                            Send Notification
                        </button>
                        <button
                            className={`${styles.actionButton} ${styles.moreActions}`}
                        >
                            <MoreVertical size={16} />
                            Actions
                        </button>
                    </div>
                </div>

                <div className={styles.tenantTypeSection}>
                    <div className={styles.tenantTypeHeader}>
                        <h2>Tenant Type</h2>
                        <p>
                            Switch between individual and company tenant views
                        </p>
                    </div>
                    <div className={styles.tenantTypeToggle}>
                        <label className={tenant.tenant_type === "individual" ? styles.active : ""}>
                            <UserSquare2 size={16} />
                            Individual
                        </label>
                        <label className={tenant.tenant_type === "company" ? styles.active : ""}>
                            <Building2 size={16} />
                            Company
                        </label>
                    </div>
                </div>

                <div className={styles.kycVerificationSection}>
                    <div className={styles.kycHeader}>
                        <h2>KYC Verification</h2>
                        <p>Toggle KYC verification status</p>
                    </div>
                    { (
                        <div className={styles.kycToggleContainer}>
                            <div
                                className={`${styles.kycToggle} ${tenant.kyc_verification ? styles.verified : styles.unverified} ${isUpdating ? styles.loading : ""}`}
                                onClick={
                                    !isUpdating ? handleKycToggle : undefined
                                }
                            >
                                <div className={styles.toggleTrack}>
                                    <div className={styles.toggleThumb} />
                                    {isUpdating && (
                                        <div
                                            className={styles.loadingSpinner}
                                        />
                                    )}
                                </div>
                                <div className={styles.toggleStatus}>
                                    <span className={styles.toggleLabel}>
                                        {isUpdating
                                            ? "Updating..."
                                            : tenant.kyc_verification
                                              ? "Verified"
                                              : "Unverified"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.profileCard}>
                    <div className={styles.profileInfo}>
                        {tenant?.profile_pic ? (
                            <img
                                src={tenant?.profile_pic}
                                alt="Tenant"
                                className={styles.avatar}
                            />
                        ) : (
                            <div className={styles.avatar}>
                                <User size={40} />
                            </div>
                        )}
                        <div className={styles.profileDetails}>
                            <div className={styles.nameSection}>
                                <h2>{tenant.tenant_name}</h2>
                                <div className={styles.badgeContainer}>
                                    <span className={styles.badge}>
                                        <UserSquare2 size={16} />
                                        Individual
                                    </span>
                                </div>
                            </div>
                            <div className={styles.tenantMeta}>
                                <span>Active Tenant</span>
                                <span>•</span>
                                <span>ID: {tenant.id}</span>
                            </div>
                            <div className={styles.contactInfo}>
                                <div>
                                    <Phone size={16} />
                                    {tenant?.tenant_phone}
                                </div>
                                <div>
                                    <Mail size={16} />
                                    {tenant?.tenant_email}
                                </div>
                                <div>
                                    <UserSquare2 size={16} />
                                    Emirates ID: {tenant?.tenant_emirates_id}
                                </div>
                            </div>
                            <div className={styles.additionalInfo}>
                                <div>
                                    <FileCheck size={16} />
                                    License: {tenant?.license_no}
                                </div>
                                <div>
                                    <Building2 size={16} />
                                    Authority: {tenant?.licensing_authority}
                                </div>
                            </div>
                        </div>
                        <div className={styles.balance}>Balance: 0.00 AED</div>
                    </div>
                </div>

                <div className={styles.documentsSection}>
                    <div className={styles.documentsHeader}>
                        <div>
                            <h2>Documents</h2>
                            <p className={styles.subtitle}>
                                Upload and manage tenant documents
                            </p>
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
                                className={`${styles.uploadButton} ${isPending ? styles.uploading : ""}`}
                            >
                                <div className={styles.uploadContent}>
                                    <div className={styles.uploadIcon}>
                                        <Upload size={18} />
                                    </div>
                                    <span className={styles.uploadText}>
                                        {isPending ? (
                                            <>
                                                <span
                                                    className={
                                                        styles.uploadingText
                                                    }
                                                >
                                                    Uploading...
                                                </span>
                                                <div
                                                    className={
                                                        styles.uploadProgress
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.progressBar
                                                        }
                                                    ></div>
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
                    {error && <p className={styles.error}>{error.message}</p>}
                    <div className={styles.documentGrid}>
                        {tenant?.documents?.length > 0 ? (
                            tenant?.documents?.map((doc, index) => {
                                const fileType = getFileType(doc);
                                return (
                                    <div
                                        key={index}
                                        className={styles.documentCard}
                                    >
                                        <div className={styles.documentContent}>
                                            {fileType.isImage ? (
                                                <img
                                                    src={doc}
                                                    alt={`Document ${index + 1}`}
                                                />
                                            ) : (
                                                <div
                                                    className={
                                                        styles.documentIcon
                                                    }
                                                >
                                                    {fileType.isPDF ? (
                                                        <FileTextIcon
                                                            size={48}
                                                        />
                                                    ) : (
                                                        <FileImage size={48} />
                                                    )}
                                                    <span
                                                        className={
                                                            styles.fileName
                                                        }
                                                    >
                                                        {doc.split("/").pop()}
                                                    </span>
                                                </div>
                                            )}
                                            <button
                                                className={`${styles.deleteButton} ${isDeleting ? styles.disabled : ""}`}
                                                onClick={() =>
                                                    handleDeleteClick(doc)
                                                }
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
                                <p className={styles.emptySubtitle}>
                                    Upload documents to get started
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {tenant?.rental_agreements?.length > 0 && (
                    <div className={styles.agreementsSection}>
                        <h2>Rental Agreements</h2>

                        <div className={styles.agreementGrid}>
                            <AddRentalAgreeMent>
                                <button
                                    style={{
                                        backgroundColor: "white",
                                        color: "black",
                                        padding: "10px 20px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        border: "1px solid black ",
                                    }}
                                >
                                    Add Rental Agreement
                                </button>
                            </AddRentalAgreeMent>
                            {tenant?.rental_agreements?.length > 0 &&
                                tenant?.rental_agreements.map((agreement) => (
                                    <div
                                        key={agreement.id}
                                        className={styles.agreementCard}
                                    >
                                        <div className={styles.agreementHeader}>
                                            <h3>
                                                {
                                                    agreement?.property_info
                                                        ?.title
                                                }
                                            </h3>
                                            <span
                                                className={`${styles.statusBadge} ${styles[agreement?.status?.toLowerCase()]}`}
                                            >
                                                {agreement?.status}
                                            </span>
                                        </div>
                                        <div
                                            className={styles.agreementDetails}
                                        >
                                            <div
                                                className={styles.agreementInfo}
                                            >
                                                <div>
                                                    <MapPin size={16} />
                                                    {agreement?.property_info
                                                        ?.location ||
                                                        "Location not specified"}
                                                </div>
                                                <div>
                                                    <Calendar size={16} />
                                                    {formatDate(
                                                        agreement?.start_date
                                                    )}{" "}
                                                    -{" "}
                                                    {formatDate(
                                                        agreement?.end_date
                                                    )}
                                                </div>
                                                <div>
                                                    <DollarSign size={16} />
                                                    {formatCurrency(
                                                        agreement?.rent_amount
                                                    )}{" "}
                                                    /{" "}
                                                    {
                                                        agreement?.payment_frequency
                                                    }
                                                </div>
                                                <div>
                                                    <Shield size={16} />
                                                    Security Deposit:{" "}
                                                    {formatCurrency(
                                                        agreement?.security_deposit
                                                    )}
                                                </div>
                                                <div>
                                                    <Building2 size={16} />
                                                    Unit number:{" "}
                                                    {agreement?.property_info
                                                        ?.houseNo || "N/A"}
                                                </div>
                                                {agreement?.property_info
                                                    ?.building && (
                                                    <>
                                                        <div>
                                                            <Building2
                                                                size={16}
                                                            />
                                                            Building Name:{" "}
                                                            {agreement
                                                                ?.property_info
                                                                ?.building
                                                                ?.building_name ||
                                                                "N/A"}
                                                        </div>

                                                        <div>
                                                            <Building2
                                                                size={16}
                                                            />
                                                            Building No :
                                                            {agreement
                                                                ?.property_info
                                                                ?.building
                                                                ?.building_no &&
                                                                ` (${agreement.property_info.building.building_no})`}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "8px",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <button
                                                    className={
                                                        styles.viewDetailsButton
                                                    }
                                                    onClick={() =>
                                                        handleViewDetails(
                                                            agreement?.property_id
                                                        )
                                                    }
                                                >
                                                    Property Details
                                                </button>

                                                <button
                                                    className={
                                                        styles.viewDetailsButton
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/rental-agreement/list/${agreement?.id}`
                                                        )
                                                    }
                                                >
                                                    Rental Details
                                                </button>

                                                {agreement?.property_info
                                                    ?.building?.id && (
                                                    <button
                                                        className={
                                                            styles.viewDetailsButton
                                                        }
                                                        onClick={() =>
                                                            navigate(
                                                                `/new-building/list/${agreement.property_info.building.id}`
                                                            )
                                                        }
                                                    >
                                                        Building Details
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </section>

            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Delete Document</h3>
                        <p>
                            Are you sure you want to delete this document? This
                            action cannot be undone.
                        </p>
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
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TenantDetails;
