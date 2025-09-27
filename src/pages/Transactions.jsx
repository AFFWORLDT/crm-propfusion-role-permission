import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import SectionTop from "../ui/SectionTop";
import styles from "./Transactions.module.css";
import TabBar from "../ui/TabBar";
import { KPI_CONTRACTS_TABS } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { 
    FaPlus, 
    FaEye, 
    FaEdit, 
    FaTrash, 
    FaCheck, 
    FaTimes,
    FaFileAlt,
    FaCalendarAlt,
    FaStickyNote,
    FaMapMarkerAlt,
    FaBuilding,
    FaUser,
    FaTag,
    FaReceipt,
    FaDollarSign
} from 'react-icons/fa';
import { 
    useTransactions, 
    useCreateTransaction, 
    useUpdateTransaction, 
    useDeleteTransaction, 
    useApproveTransaction,
} from "../features/transactions/useTransactions";
import { 
    TransactionType, 
    PropertyTransactionPurpose 
} from "../services/apiTransactions";
import { useMyPermissions } from "../hooks/useHasPermission";
import PageNotFound from "./PageNotFound";
import TransactionForm from "../components/TransactionForm";

const Transactions = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        page: 1,
        size: 10,
        transaction_type: "",
        internal_transaction: "",
        status: "",
        date_from: "",
        date_to: ""
    });
    
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const [formData, setFormData] = useState({
        date: new Date().toISOString().slice(0, 10),
        transaction_type: TransactionType.PROPERTY_TRANSACTION,
        internal_transaction: "",
        property_transaction: {
            property_transaction_purpose: PropertyTransactionPurpose.OFFPLAN_PRIMARY,
            lead_id: "",
            property_id: "",
            unit_number: "",
            property_name: "",
            property_address: "",
            deal_price: 0,
            total_commission: 0,
            total_commission_percentage: 0,
            commission_type: "",
            A2A_commission: 0,
            A2A_commission_percentage: 0,
            A2A_vat: 0,
            A2A_commission_reciver_name: "",
            buyer_commission_amount: 0,
            buyer_vat: 0,
            buyer_commission_percentage: 0,
            agent_commissions: [],
            seller_commission: 0,
            seller_commission_percentage: 0,
            sellers_vat: 0,
            tenant_commission: 0,
            tenant_commission_percentage: 0,
            tenant_vat: 0,
            landlord_commission: 0,
            landlord_commission_percentage: 0,
            landlord_vat: 0,
            other_commission: 0,
            other_commission_percentage: 0,
            other_vat: 0,
            company_total_commission: 0,
            company_total_commission_percentage: 0,
            payment_method: "",
            deposit_amount: 0,
            buyer_documents: [],
            seller_documents: [],
            tenant_documents: [],
            landlord_documents: [],
            property_documents: [],
            contract_documents: []
        },
        agent_salary: {
            agent_id: "",
            agent_name: "",
            salary_amount: 0,
            salary_type: "",
            notes: ""
        },
        agent_penalty: {
            agent_id: "",
            agent_name: "",
            penalty_amount: 0,
            penalty_type: "",
            notes: ""
        },
        company_expense: {
            expense_amount: 0,
            expense_type: "",
        },
        company_revenue: {
            revenue_amount: 0,
            revenue_type: "",
        },
        notes: "",
        status: "pending"
    });

    // Check permissions
    const { hasPermission } = useMyPermissions();
    const hasViewPermission = hasPermission("view_transactions");
    const hasCreatePermission = hasPermission("create_transactions");
    const hasUpdatePermission = hasPermission("update_transactions");
    const hasDeletePermission = hasPermission("delete_transactions");
    const hasApprovePermission = hasPermission("approve_transactions");

    // Queries and mutations - moved before conditional return
    const { data: transactionsData, isLoading, error } = useTransactions(filters);
    const createTransactionMutation = useCreateTransaction();
    const updateTransactionMutation = useUpdateTransaction();
    const deleteTransactionMutation = useDeleteTransaction();
    const approveTransactionMutation = useApproveTransaction();

    // Check permissions after hooks
    if (!hasViewPermission) {
        return <PageNotFound />;
    }

    const transactions = transactionsData?.items || [];
    const totalItems = transactionsData?.total || 0;
    const totalPages = Math.ceil(totalItems / filters.size);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filters change
        }));
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };

    // Build payload to include only relevant sections
    const buildTransactionPayload = (data) => {
        const base = {
            date: data.date || undefined,
            transaction_type: data.transaction_type,
            notes: data.notes || data.agent_salary?.notes || "",
            status: data.status,
            date_from: data.date_from || undefined,
            date_to: data.date_to || undefined,
        };

        if (data.transaction_type === TransactionType.PROPERTY_TRANSACTION) {
            const { property_transaction } = data;
            const sanitizedProperty = { ...property_transaction };
            delete sanitizedProperty.buyer_documents;
            delete sanitizedProperty.seller_documents;
            delete sanitizedProperty.tenant_documents;
            delete sanitizedProperty.landlord_documents;
            delete sanitizedProperty.property_documents;
            delete sanitizedProperty.contract_documents;
            return {
                ...base,
                property_transaction: sanitizedProperty,
            };
        }

        if (data.transaction_type === TransactionType.INTERNAL_TRANSACTION) {
            const internalType = data.internal_transaction;
            const payload = { ...base, internal_transaction: internalType };
            if (internalType === "agent_salary") {
                const { agent_id, agent_name, salary_amount, salary_type } = data.agent_salary || {};
                payload.agent_salary = {
                    agent_id: agent_id || undefined,
                    agent_name: agent_name || undefined,
                    salary_amount: salary_amount || 0,
                    salary_type: salary_type || undefined,
                };
            }
            if (internalType === "agent_penalty") payload.agent_penalty = data.agent_penalty;
            if (internalType === "company_expense") {
                const { expense_amount, expense_type } = data.company_expense || {};
                payload.company_expense = {
                    expense_amount: expense_amount || 0,
                    expense_type: expense_type || undefined,
                };
            }
            if (internalType === "company_income") {
                const { revenue_amount, revenue_type } = data.company_revenue || {};
                payload.company_revenue = {
                    revenue_amount: revenue_amount || 0,
                    revenue_type: revenue_type || undefined,
                };
            }
            return payload;
        }

        return base;
    };

    // Handle create transaction
    const handleCreateTransaction = async () => {
        try {
            const payload = buildTransactionPayload(formData);
            await createTransactionMutation.mutateAsync(payload);
            setShowCreateModal(false);
            setFormData({
                date: new Date().toISOString().slice(0, 10),
                transaction_type: TransactionType.PROPERTY_TRANSACTION,
                internal_transaction: "",
                property_transaction: {
                    property_transaction_purpose: PropertyTransactionPurpose.OFFPLAN_PRIMARY,
                    lead_id: "",
                    property_id: "",
                    unit_number: "",
                    property_name: "",
                    property_address: "",
                    deal_price: 0,
                    total_commission: 0,
                    total_commission_percentage: 0,
                    commission_type: "",
                    A2A_commission: 0,
                    A2A_commission_percentage: 0,
                    A2A_vat: 0,
                    A2A_commission_reciver_name: "",
                    buyer_commission_amount: 0,
                    buyer_vat: 0,
                    buyer_commission_percentage: 0,
                    agent_commissions: [],
                    seller_commission: 0,
                    seller_commission_percentage: 0,
                    sellers_vat: 0,
                    tenant_commission: 0,
                    tenant_commission_percentage: 0,
                    tenant_vat: 0,
                    landlord_commission: 0,
                    landlord_commission_percentage: 0,
                    landlord_vat: 0,
                    other_commission: 0,
                    other_commission_percentage: 0,
                    other_vat: 0,
                    company_total_commission: 0,
                    company_total_commission_percentage: 0,
                    payment_method: "",
                    deposit_amount: 0,
                    buyer_documents: [],
                    seller_documents: [],
                    tenant_documents: [],
                    landlord_documents: [],
                    property_documents: [],
                    contract_documents: []
                },
                agent_salary: {
                    agent_id: "",
                    agent_name: "",
                    salary_amount: 0,
                    salary_type: "",
                    notes: ""
                },
                agent_penalty: {
                    agent_id: "",
                    agent_name: "",
                    penalty_amount: 0,
                    penalty_type: "",
                    notes: ""
                },
                company_expense: {
                    expense_amount: 0,
                    expense_type: "",
                },
                company_revenue: {
                    revenue_amount: 0,
                    revenue_type: "",
                },
                notes: "",
                status: "pending"
            });
        } catch (error) {
            console.error("Error creating transaction:", error);
        }
    };

    // Handle update transaction
    const handleUpdateTransaction = async () => {
        try {
            const payload = buildTransactionPayload(formData);
            await updateTransactionMutation.mutateAsync({
                transactionId: selectedTransaction.id,
                transactionData: payload
            });
            setShowEditModal(false);
        } catch (error) {
            console.error("Error updating transaction:", error);
        }
    };

    // Handle delete transaction
    const handleDeleteTransaction = async () => {
        try {
            await deleteTransactionMutation.mutateAsync(selectedTransaction.id);
            setShowDeleteModal(false);
            setSelectedTransaction(null);
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    // Handle approve transaction
    const handleApproveTransaction = async (transactionId) => {
        try {
            await approveTransactionMutation.mutateAsync(transactionId);
        } catch (error) {
            console.error("Error approving transaction:", error);
        }
    };

    // Get transaction type label
    const getTransactionTypeLabel = (type) => {
        switch (type) {
            case TransactionType.PROPERTY_TRANSACTION:
                return "Property Transaction";
            case TransactionType.INTERNAL_TRANSACTION:
                return "Internal Transaction";
            default:
                return type;
        }
    };

    // Get status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return <span className={styles.statusBadgePending}>Pending</span>;
            case "approved":
                return <span className={styles.statusBadgeApproved}>Approved</span>;
            case "rejected":
                return <span className={styles.statusBadgeRejected}>Rejected</span>;
            default:
                return <span className={styles.statusBadgeDefault}>{status}</span>;
        }
    };

    if (error) {
        return (
            <div className="sectionContainer">
                <SectionTop>
                    <TabBar
                        activeTab="TRANSACTIONS"
                        tabs={KPI_CONTRACTS_TABS}
                        onTabClick={(tabId) => {
                            const tab = KPI_CONTRACTS_TABS.find((t) => t.id === tabId);
                            if (tab?.path) {
                                navigate(tab.path);
                            }
                        }}
                    />
                </SectionTop>
                <div className={styles.errorContainer}>
                    <div className={styles.errorMessage}>
                        <h3>Error Loading Transactions</h3>
                        <p>{error.message || "Failed to load transactions. Please try again later."}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    activeTab="TRANSACTIONS"
                    tabs={KPI_CONTRACTS_TABS}
                    onTabClick={(tabId) => {
                        const tab = KPI_CONTRACTS_TABS.find((t) => t.id === tabId);
                        if (tab?.path) {
                            navigate(tab.path);
                        }
                    }}
                />
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: "#ffffff" }}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h2 className={styles.title}>Transactions</h2>
                        <p className={styles.subtitle}>
                            Manage and track all property and internal transactions
                        </p>
                    </div>
                    {hasCreatePermission && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className={styles.createButton}
                        >
                            <FaPlus size={16} />
                            New Transaction
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className={styles.filtersSection}>
                    <div className={styles.filtersGrid}>
                        <div className={styles.filterGroup}>
                            <label>Transaction Type</label>
                            <select
                                value={filters.transaction_type}
                                onChange={(e) => handleFilterChange("transaction_type", e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">All Types</option>
                                <option value={TransactionType.PROPERTY_TRANSACTION}>Property Transaction</option>
                                <option value={TransactionType.INTERNAL_TRANSACTION}>Internal Transaction</option>
                            </select>
                        </div>
                        
                        <div className={styles.filterGroup}>
                            <label>Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange("status", e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        
                        <div className={styles.filterGroup}>
                            <label>Date From</label>
                            <input
                                type="date"
                                value={filters.date_from}
                                onChange={(e) => handleFilterChange("date_from", e.target.value)}
                                className={styles.filterInput}
                            />
                        </div>
                        
                        <div className={styles.filterGroup}>
                            <label>Date To</label>
                            <input
                                type="date"
                                value={filters.date_to}
                                onChange={(e) => handleFilterChange("date_to", e.target.value)}
                                className={styles.filterInput}
                            />
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className={styles.tableContainer}>
                    {isLoading ? (
                        <div className={styles.loaderContainer}>
                            <div className={styles.loader}>
                                <div className={styles.circle}></div>
                                <div className={styles.circle}></div>
                                <div className={styles.circle}></div>
                                <div className={styles.circle}></div>
                            </div>
                            <span className={styles.loaderText}>Loading transactions...</span>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FaFileAlt size={48} className={styles.emptyStateIcon} />
                            <h4 className={styles.emptyStateTitle}>No transactions found</h4>
                            <p className={styles.emptyStateText}>
                                {Object.values(filters).some(v => v !== "" && v !== 1 && v !== 10) 
                                    ? "Try adjusting your filters" 
                                    : "Get started by creating your first transaction"}
                            </p>
                        </div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Transaction Details</th>
                                        <th>Property/Lead Info</th>
                                        <th>Financial Details</th>
                                        <th>Commission Breakdown</th>
                                        <th>Status & Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction) => (
                                        <motion.tr
                                            key={transaction.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={styles.tableRow}
                                        >
                                            <td className={styles.transactionDetailsCell}>
                                                <div className={styles.transactionHeader}>
                                                    <div className={styles.transactionId}>#{transaction.id}</div>
                                                    <div className={styles.transactionType}>
                                                {getTransactionTypeLabel(transaction.transaction_type)}
                                                    </div>
                                                </div>
                                                <div className={styles.transactionMeta}>
                                                    <div className={styles.transactionDate}>
                                                        <FaCalendarAlt size={12} />
                                                        {new Date(transaction.date).toLocaleDateString()}
                                                    </div>
                                                    <div className={styles.transactionCreated}>
                                                        Created: {new Date(transaction.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                {transaction.notes && (
                                                    <div className={styles.transactionNotes}>
                                                        <FaStickyNote size={12} />
                                                        {transaction.notes.length > 60 
                                                            ? `${transaction.notes.substring(0, 60)}...` 
                                                            : transaction.notes
                                                        }
                                                    </div>
                                                )}
                                            </td>
                                            
                                            <td className={styles.propertyInfoCell}>
                                                {transaction.property_transaction ? (
                                                    <>
                                                        <div className={styles.propertyHeader}>
                                                            <div className={styles.propertyName}>
                                                                {transaction.property_transaction.property_name}
                                                            </div>
                                                            <div className={styles.propertyPurpose}>
                                                                {transaction.property_transaction.property_transaction_purpose?.replace('_', ' ').toUpperCase()}
                                                            </div>
                                                        </div>
                                                        <div className={styles.propertyDetails}>
                                                            <div className={styles.propertyAddress}>
                                                                <FaMapMarkerAlt size={12} />
                                                                {transaction.property_transaction.property_address}
                                                            </div>
                                                            <div className={styles.propertyUnit}>
                                                                <FaBuilding size={12} />
                                                                {transaction.property_transaction.unit_number}
                                                            </div>
                                                        </div>
                                                        <div className={styles.leadInfo}>
                                                            <div className={styles.leadId}>
                                                                <FaUser size={12} />
                                                                {transaction.property_transaction.lead_id}
                                                            </div>
                                                            <div className={styles.propertyId}>
                                                                <FaTag size={12} />
                                                                {transaction.property_transaction.property_id}
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className={styles.internalTransactionInfo}>
                                                        {transaction.agent_salary && (
                                                            <>
                                                                <div className={styles.internalType}>Agent Salary</div>
                                                                <div className={styles.agentName}>
                                                                    <FaUser size={12} />
                                                                    {transaction.agent_salary.agent_name || 'N/A'}
                                                                </div>
                                                            </>
                                                        )}
                                                        {transaction.company_expense && (
                                                            <>
                                                                <div className={styles.internalType}>Company Expense</div>
                                                                <div className={styles.expenseType}>
                                                                    <FaReceipt size={12} />
                                                                    {transaction.company_expense.expense_type || 'N/A'}
                                                                </div>
                                                            </>
                                                        )}
                                                        {transaction.company_revenue && (
                                                            <>
                                                                <div className={styles.internalType}>Company Revenue</div>
                                                                <div className={styles.revenueType}>
                                                                    <FaDollarSign size={12} />
                                                                    {transaction.company_revenue.revenue_type || 'N/A'}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            
                                            <td className={styles.financialDetailsCell}>
                                                {transaction.property_transaction ? (
                                                    <>
                                                        <div className={styles.dealPrice}>
                                                            <div className={styles.priceLabel}>Deal Price</div>
                                                            <div className={styles.priceValue}>
                                                                AED {transaction.property_transaction.deal_price?.toLocaleString() || '0'}
                                                            </div>
                                                        </div>
                                                        <div className={styles.commissionInfo}>
                                                            <div className={styles.commissionLabel}>Total Commission</div>
                                                            <div className={styles.commissionValue}>
                                                                AED {transaction.property_transaction.total_commission?.toLocaleString() || '0'}
                                                                <span className={styles.commissionPercentage}>
                                                                    ({transaction.property_transaction.total_commission_percentage || 0}%)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className={styles.internalAmount}>
                                                        <div className={styles.amountLabel}>Amount</div>
                                                        <div className={styles.amountValue}>
                                                            AED {(
                                                                transaction.agent_salary?.salary_amount ||
                                                                transaction.company_expense?.expense_amount ||
                                                                transaction.company_revenue?.revenue_amount ||
                                                                0
                                                            ).toLocaleString()}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            
                                            <td className={styles.commissionBreakdownCell}>
                                                {transaction.property_transaction ? (
                                                    <>
                                                        <div className={styles.commissionRow}>
                                                            <span className={styles.commissionType}>A2A:</span>
                                                            <span className={styles.commissionAmount}>
                                                                AED {transaction.property_transaction.A2A_commission?.toLocaleString() || '0'}
                                                            </span>
                                                        </div>
                                                        <div className={styles.commissionRow}>
                                                            <span className={styles.commissionType}>Company:</span>
                                                            <span className={styles.commissionAmount}>
                                                                AED {transaction.property_transaction.company_total_commission?.toLocaleString() || '0'}
                                                            </span>
                                                        </div>
                                                        {transaction.property_transaction.agent_commissions?.length > 0 && (
                                                            <div className={styles.agentCommissions}>
                                                                {transaction.property_transaction.agent_commissions.map((agent, index) => (
                                                                    <div key={index} className={styles.commissionRow}>
                                                                        <span className={styles.commissionType}>
                                                                            {agent.agent_name || `Agent ${index + 1}`}:
                                                                        </span>
                                                                        <span className={styles.commissionAmount}>
                                                                            AED {agent.commission_amount?.toLocaleString() || '0'}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className={styles.noCommission}>N/A</div>
                                                )}
                                            </td>
                                            
                                            <td className={styles.statusActionsCell}>
                                                <div className={styles.statusActionsContainer}>
                                                    <div className={styles.statusSection}>
                                                        <div className={styles.statusLabel}>Status</div>
                                                        {getStatusBadge(transaction.status)}
                                                    </div>
                                                    
                                                    <div className={styles.actionsSection}>
                                                        <div className={styles.actionsLabel}>Actions</div>
                                                        <div className={styles.actionButtons}>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedTransaction(transaction);
                                                                    setShowDetailModal(true);
                                                                }}
                                                                className={`${styles.actionButton} ${styles.viewButton}`}
                                                                title="View Details"
                                                            >
                                                                <FaEye size={14} />
                                                            </button>
                                                            
                                                            {hasUpdatePermission && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedTransaction(transaction);
                                                                        setFormData(transaction);
                                                                        setShowEditModal(true);
                                                                    }}
                                                                    className={`${styles.actionButton} ${styles.editButton}`}
                                                                    title="Edit Transaction"
                                                                >
                                                                    <FaEdit size={14} />
                                                                </button>
                                                            )}
                                                            
                                                            {hasApprovePermission && transaction.status === "pending" && (
                                                                <button
                                                                    onClick={() => handleApproveTransaction(transaction.id)}
                                                                    className={`${styles.actionButton} ${styles.approveButton}`}
                                                                    title="Approve Transaction"
                                                                >
                                                                    <FaCheck size={14} />
                                                                </button>
                                                            )}
                                                            
                                                            {hasDeletePermission && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedTransaction(transaction);
                                                                        setShowDeleteModal(true);
                                                                    }}
                                                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                                                    title="Delete Transaction"
                                                                >
                                                                    <FaTrash size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={styles.paginationContainer}>
                        <div className={styles.paginationInfo}>
                            Showing {((filters.page - 1) * filters.size) + 1} to {Math.min(filters.page * filters.size, totalItems)} of {totalItems} transactions
                        </div>
                        <div className={styles.pagination}>
                            <button
                                onClick={() => handlePageChange(filters.page - 1)}
                                disabled={filters.page === 1}
                                className={styles.paginationButton}
                            >
                                Previous
                            </button>
                            
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`${styles.paginationButton} ${filters.page === page ? styles.active : ''}`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            
                            <button
                                onClick={() => handlePageChange(filters.page + 1)}
                                disabled={filters.page === totalPages}
                                className={styles.paginationButton}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Create Transaction Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.modalOverlay}
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={styles.modal}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h3>Create New Transaction</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className={styles.closeButton}
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            <div className={styles.modalContent}>
                                <TransactionForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    isEdit={false}
                                    onSubmit={handleCreateTransaction}
                                    onCancel={() => setShowCreateModal(false)}
                                    isSubmitting={createTransactionMutation.isPending}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Transaction Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.modalOverlay}
                        onClick={() => setShowEditModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={styles.modal}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h3>Edit Transaction #{selectedTransaction?.id}</h3>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className={styles.closeButton}
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            <div className={styles.modalContent}>
                                <TransactionForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    isEdit={true}
                                    onSubmit={handleUpdateTransaction}
                                    onCancel={() => setShowEditModal(false)}
                                    isSubmitting={updateTransactionMutation.isPending}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Transaction Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedTransaction && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.modalOverlay}
                        onClick={() => setShowDetailModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={styles.modal}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h3>Transaction Details #{selectedTransaction.id}</h3>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className={styles.closeButton}
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            <div className={styles.modalContent}>
                                <div className={styles.detailGrid}>
                                    <div className={styles.detailItem}>
                                        <label>Transaction Type</label>
                                        <span>{getTransactionTypeLabel(selectedTransaction.transaction_type)}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <label>Status</label>
                                        <span>{getStatusBadge(selectedTransaction.status)}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <label>Created Date</label>
                                        <span>{new Date(selectedTransaction.created_at).toLocaleString()}</span>
                                    </div>
                                    {selectedTransaction.property_transaction && (
                                        <>
                                            <div className={styles.detailItem}>
                                                <label>Property Name</label>
                                                <span>{selectedTransaction.property_transaction.property_name || "N/A"}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <label>Deal Price</label>
                                                <span>${selectedTransaction.property_transaction.deal_price?.toLocaleString() || "0"}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <label>Commission</label>
                                                <span>${selectedTransaction.property_transaction.total_commission?.toLocaleString() || "0"}</span>
                                            </div>
                                        </>
                                    )}
                                    {selectedTransaction.notes && (
                                        <div className={styles.detailItem}>
                                            <label>Notes</label>
                                            <span>{selectedTransaction.notes}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className={styles.closeButton}
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && selectedTransaction && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.modalOverlay}
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={styles.modal}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h3>Delete Transaction</h3>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className={styles.closeButton}
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            <div className={styles.modalContent}>
                                <p>Are you sure you want to delete transaction #{selectedTransaction.id}?</p>
                                <p>This action cannot be undone.</p>
                            </div>
                            <div className={styles.modalFooter}>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteTransaction}
                                    disabled={deleteTransactionMutation.isPending}
                                    className={styles.deleteButton}
                                >
                                    {deleteTransactionMutation.isPending ? "Deleting..." : "Delete Transaction"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Transactions;
