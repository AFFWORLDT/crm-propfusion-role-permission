import { useState, useEffect } from "react";
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
    ChevronDown,
    ChevronUp,
    Users,
    AlertCircle,
    Loader2,
} from "lucide-react";
import styles from "./TenantTableView.module.css";
import { DeleteModal } from "../SmtpSetting/DeleteModal";
import TenantFormModal from "./TenantFormModal";
import { useDeleteTenant } from "./useDelete";
import { useNavigate } from "react-router-dom";
import Spinner from "../../ui/Spinner";
import { useSendTenantsCredential } from "./usesendTenantsCredetional";

function TenantTable({ tenants, onDelete, onEdit }) {
    const navigate = useNavigate();
    const { send, isPending } = useSendTenantsCredential();
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedTenants = [...tenants].sort((a, b) => {
        if (!sortField) return 0;
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('tenant_name')}>
                            Name {sortField === 'tenant_name' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                        </th>
                        <th onClick={() => handleSort('tenant_email')}>
                            Email {sortField === 'tenant_email' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                        </th>
                        <th onClick={() => handleSort('tenant_phone')}>
                            Phone {sortField === 'tenant_phone' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                        </th>
                        <th onClick={() => handleSort('tenant_emirates_id')}>
                            Emirates ID {sortField === 'tenant_emirates_id' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTenants.map((tenant) => (
                        <tr key={tenant.id}>
                            <td>
                                <div className={styles.tenantInfo}>
                                    {tenant.profile_pic ? (
                                        <img src={tenant.profile_pic} alt={tenant.tenant_name} className={styles.avatar} />
                                    ) : (
                                        <div className={styles.avatarPlaceholder}>
                                            <UserSquare2 size={24} />
                                        </div>
                                    )}
                                    <span>{tenant.tenant_name}</span>
                                </div>
                            </td>
                            <td>
                                <div className={styles.emailCell}>
                                    <Mail size={16} />
                                    <span>{tenant.tenant_email}</span>
                                </div>
                            </td>
                            <td>
                                <div className={styles.phoneCell}>
                                    <Phone size={16} />
                                    <span>{tenant.tenant_phone}</span>
                                </div>
                            </td>
                            <td>{tenant.tenant_emirates_id}</td>
                            <td>
                                <div className={styles.actions}>
                                    <button
                                        className={styles.sendButton}
                                        onClick={() => send(tenant.id)}
                                        disabled={isPending}
                                        title="Send Credentials"
                                    >
                                        <Send size={16} />
                                    </button>
                                    <button
                                        onClick={() => navigate(`/for-tenants/details/${tenant.id}`)}
                                        className={styles.actionButton}
                                        title="View Details"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => onEdit(tenant)}
                                        className={styles.actionButton}
                                        title="Edit"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(tenant.id)}
                                        className={styles.actionButton}
                                        title="Delete"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TenantTableView({ isLoading, error, tenants, fetchNextPage, hasNextPage, isFetchingNextPage, containerRef }) {
    const [selectedTenantId, setSelectedTenantId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showTenantModal, setShowTenantModal] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [modalMode, setModalMode] = useState("add");

    const { deleteTenant, isPending: isDeleting } = useDeleteTenant();

    // Infinite scroll effect
    useEffect(() => {
        const container = containerRef?.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

            if (isNearBottom && hasNextPage && !isFetchingNextPage && !isLoading) {
                fetchNextPage();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, containerRef]);

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
            <div className={styles.errorContainer}>
                <div className={styles.errorContent}>
                    <AlertCircle size={48} className={styles.errorIcon} />
                    <h3>Error Loading Data</h3>
                    <p>Error loading tenants data. Please try again later.</p>
                    <button 
                        className={styles.retryButton}
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingContent}>
                    <Loader2 size={48} className={styles.loadingSpinner} />
                    <h3>Loading Tenants...</h3>
                    <p>Please wait.</p>
                </div>
            </div>
        );
    }

    if (!tenants?.length) {
        return (
            <div className={styles.noDataContainer}>
                <div className={styles.noDataContent}>
                    <Users size={64} className={styles.noDataIcon} />
                    <h3>No Tenants Found</h3>
                    <p>No tenants have been added yet.</p>
                    <p>Click the &quot;Add Tenant&quot; button to add your first tenant.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <TenantTable
                tenants={tenants}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />

            {/* Loading indicator for infinite scroll */}
            {isFetchingNextPage && (
                <div className={styles.infiniteLoader}>
                    <Loader2 size={24} className={styles.infiniteSpinner} />
                    <span>Loading more tenants...</span>
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
        </>
    );
}

export default TenantTableView; 