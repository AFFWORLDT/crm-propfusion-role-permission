// NewTenants.jsx
import { useState, useEffect, useRef } from "react";
import {
    Phone,
    Mail,
    UserSquare2,
    Building2,
    Pencil,
    Trash,
    FileText,
    Send,
    Eye,
    Calendar,
    Loader2,
} from "lucide-react";
import styles from "./NewTenants.module.css";
import { DeleteModal } from "../SmtpSetting/DeleteModal";
import TenantFormModal from "./TenantFormModal";
import { useDeleteTenant } from "./useDelete";
import { useNavigate } from "react-router-dom";
import Spinner from "../../ui/Spinner";
import { useSendTenantsCredential } from "./usesendTenantsCredetional";

function TenantCard({ tenant, onDelete, onEdit }) {
    const navigate = useNavigate();
    const { send, isPending } = useSendTenantsCredential();
    const handelSend = (id) => {
        send(id);
    };
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                    {tenant.tenant_name}&apos;s Details{" "}
                    <span className={styles.id}>({tenant.id})</span>
                </h2>
                <div className={styles.actions}>
                    <button
                        className={styles.sendButton}
                        onClick={() => handelSend(tenant.id)}
                        disabled={isPending}
                    >
                        <Send />
                    </button>
                    <button
                        onClick={() =>
                            navigate(`/for-tenants/details/${tenant.id}`)
                        }
                        className={styles.actionButton}
                        title="View Details"
                    >
                        <Eye size={20} className={styles.viewIcon} />
                    </button>
                    <button
                        onClick={() => onEdit(tenant)}
                        className={styles.actionButton}
                        title="Edit"
                    >
                        <Pencil size={20} className={styles.editIcon} />
                    </button>
                    <button
                        onClick={() => onDelete(tenant.id)}
                        className={styles.actionButton}
                        title="Delete"
                    >
                        <Trash size={20} className={styles.deleteIcon} />
                    </button>
                </div>
            </div>

            <div className={styles.cardContent}>
                <div className={styles.infoRow}>
                    <div className={styles.infoItem}>
                        <div className={styles.iconWrapper}>
                            <UserSquare2 className={styles.icon} />
                        </div>
                        <div className={styles.infoContent}>
                            <label>Tenant Name</label>
                            <span>{tenant.tenant_name}</span>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.iconWrapper}>
                            <UserSquare2 className={styles.icon} />
                        </div>
                        <div className={styles.infoContent}>
                            <label>Tenant Emirates Id</label>
                            <span>{tenant.tenant_emirates_id}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.infoRow}>
                    <div className={styles.infoItem}>
                        <div className={styles.iconWrapper}>
                            <FileText className={styles.icon} />
                        </div>
                        <div className={styles.infoContent}>
                            <label>License No</label>
                            <span>{tenant.license_no}</span>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.iconWrapper}>
                            <Building2 className={styles.icon} />
                        </div>
                        <div className={styles.infoContent}>
                            <label>Licensing Authority</label>
                            <span>{tenant.licensing_authority}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.infoRow}>
                    <div className={styles.infoItem}>
                        <div className={styles.iconWrapper}>
                            <Mail className={styles.icon} />
                        </div>
                        <div className={styles.infoContent}>
                            <label>Tenant Email</label>
                            <span>{tenant.tenant_email}</span>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.iconWrapper}>
                            <Phone className={styles.icon} />
                        </div>
                        <div className={styles.infoContent}>
                            <label>Tenant Phone</label>
                            <span>{tenant.tenant_phone}</span>
                        </div>
                    </div>
                    <div className={styles.infoItem}>
                        <div className={styles.iconWrapper}>
                            <Calendar className={styles.icon} />
                        </div>
                        <div className={styles.infoContent}>
                            <label>Date of Birth</label>
                            <span>
                                {tenant?.dob
                                    ? new Date(tenant?.dob).toLocaleDateString()
                                    : "N/A"}
                            </span>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.iconWrapper}>
                            <UserSquare2 className={styles.icon} />
                        </div>
                        <div className={styles.infoContent}>
                            <label>Tenant Type</label>
                            <span>{tenant.tenant_type || "N/A"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// function LoadingSkeleton() {
//   return (
//     <div className={styles.loadingCard}>
//       <div className={styles.loadingHeader}></div>
//       <div className={styles.loadingContent}>
//         <div className={styles.loadingItem}></div>
//         <div className={styles.loadingItem}></div>
//         <div className={styles.loadingItem}></div>
//         <div className={styles.loadingItem}></div>
//       </div>
//     </div>
//   );
// }

function NewTenants({ isLoading, error, tenants ,fetchNextPage, hasNextPage,isFetchingNextPage,containerRef}) {
    const [selectedTenantId, setSelectedTenantId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showTenantModal, setShowTenantModal] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [modalMode, setModalMode] = useState("add");
    const sentinelRef = useRef(null);

    const { deleteTenant, isPending: isDeleting } = useDeleteTenant();

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (!sentinelRef.current || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    console.log('Sentinel intersecting, fetching next page...');
                    fetchNextPage();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
            }
        );

        observer.observe(sentinelRef.current);

        return () => {
            observer.disconnect();
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handleDelete = (tenantId) => {
        setSelectedTenantId(tenantId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteTenant(selectedTenantId);
            setShowDeleteModal(false);
            setSelectedTenantId(null);
        } catch (error) {
            console.error("Error deleting tenant:", error);
        }
    };

    const handleEdit = (tenant) => {
        setSelectedTenant(tenant);
        setModalMode("edit");
        setShowTenantModal(true);
    };

    if (error) {
        return (
            <div className={styles.error}>
                <p>Error loading tenants data. Please try again later.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={styles.loaderContainer}>
                <Spinner />
            </div>
        );
    }

    if (!tenants?.length) {
        return (
            <div className={styles.noData}>
                <p>No tenants found.</p>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.grid}>
                {tenants.map((tenant) => (
                    <TenantCard
                        key={tenant.id}
                        tenant={tenant}
                        onDelete={handleDelete}
                        onEdit={() => handleEdit(tenant)}
                    />
                ))}
            </div>

            {/* Sentinel element for intersection observer */}
            {hasNextPage && !isFetchingNextPage && (
                <div ref={sentinelRef} className={styles.sentinel} />
            )}

            {/* Bottom loader when fetching next page */}
            {isFetchingNextPage && (
                <div className={styles.bottomLoader}>
                    <Loader2 className={styles.spinner} size={24} />
                    <span>Loading more tenants...</span>
                </div>
            )}

            {/* No more data message */}
            {!hasNextPage && tenants?.length > 0 && (
                <div className={styles.noMoreData}>
                    <p>All tenants have been loaded.</p>
                </div>
            )}

            <DeleteModal
                onConfirm={handleConfirmDelete}
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedTenantId(null);
                }}
                title="Tenant"
                message="Are you sure you want to delete this tenant? This action cannot be undone."
                isDeleting={isDeleting}
            />

            <TenantFormModal
                isOpen={showTenantModal}
                onClose={() => {
                    setShowTenantModal(false);
                    setSelectedTenant(null);
                }}
                tenant={selectedTenant}
                mode={modalMode}
            />
        </div>
    );
}

export default NewTenants;
