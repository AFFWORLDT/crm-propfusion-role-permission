import React, { useState, useEffect } from "react";
import { agentWalletApi } from "../services/apiAgentWallet";
import { getStaff } from "../services/apiStaff";
import { Receipt, Filter, Check, X, RefreshCw, Calendar, User, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import styles from "./PayoutListTable.module.css";

function PayoutListTable() {
    const [payouts, setPayouts] = useState([]);
    const [agents, setAgents] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        size: 10
    });
    const [loading, setLoading] = useState(false);
    const [loadingAgents, setLoadingAgents] = useState(true);
    const [filters, setFilters] = useState({
        status_filter: "",
        agent_id: "",
        page: 1,
        size: 10
    });
    const [processingRequest, setProcessingRequest] = useState(null);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [noteText, setNoteText] = useState("");

    // Fetch agents for filter dropdown
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                setLoadingAgents(true);
                const staffData = await getStaff();
                setAgents(staffData);
            } catch (error) {
                console.error("Error fetching agents:", error);
                toast.error("Failed to load agents.");
            } finally {
                setLoadingAgents(false);
            }
        };

        fetchAgents();
    }, []);

    // Fetch payouts when filters change
    useEffect(() => {
        fetchPayouts();
    }, [filters]);

    const fetchPayouts = async () => {
        setLoading(true);
        try {
            const data = await agentWalletApi.getAgentWalletPayouts(filters);
            setPayouts(data.items);
            setPagination({
                total: data.total,
                page: data.page,
                size: data.size
            });
        } catch (error) {
            console.error("Error fetching payouts:", error);
            toast.error("Failed to fetch payouts");
            setPayouts([]);
            setPagination({ total: 0, page: 1, size: 10 });
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filters change
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleRefresh = () => {
        fetchPayouts();
    };

    const handleDecideRequest = (requestId, approve) => {
        setSelectedRequest({ requestId, approve });
        setNoteText("");
        setShowNoteModal(true);
    };

    const confirmDecision = async () => {
        if (!selectedRequest) return;
        
        setProcessingRequest(selectedRequest.requestId);
        try {
            await agentWalletApi.decidePayoutRequest(selectedRequest.requestId, selectedRequest.approve, noteText);
            toast.success(`Payout request ${selectedRequest.approve ? 'approved' : 'rejected'} successfully`);
            fetchPayouts(); // Refresh the list
            setShowNoteModal(false);
            setSelectedRequest(null);
            setNoteText("");
        } catch (error) {
            console.error("Error deciding payout request:", error);
            toast.error(`Failed to ${selectedRequest.approve ? 'approve' : 'reject'} payout request`);
        } finally {
            setProcessingRequest(null);
        }
    };

    const cancelDecision = () => {
        setShowNoteModal(false);
        setSelectedRequest(null);
        setNoteText("");
    };

    const formatCurrency = (amount, currency = "AED") => {
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return styles.statusPending;
            case 'approved':
                return styles.statusApproved;
            case 'rejected':
                return styles.statusRejected;
            default:
                return styles.statusDefault;
        }
    };

    const totalPages = Math.ceil(pagination.total / pagination.size);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerIcon}>
                        <Receipt />
                    </div>
                    <div className={styles.headerContent}>
                        <h2>Payout Requests</h2>
                        <p>Manage agent payout requests</p>
                    </div>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className={styles.refreshButton}
                >
                    <RefreshCw className={`${styles.refreshIcon} ${loading ? styles.spinning : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className={styles.filtersContainer}>
                <div className={styles.filtersHeader}>
                    <Filter className={styles.filterIcon} />
                    <h3>Filters</h3>
                </div>
                <div className={styles.filtersGrid}>
                    <div className={styles.filterGroup}>
                        <label htmlFor="status-filter" className={styles.filterLabel}>
                            Status
                        </label>
                        <select
                            id="status-filter"
                            value={filters.status_filter}
                            onChange={(e) => handleFilterChange('status_filter', e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label htmlFor="agent-filter" className={styles.filterLabel}>
                            Agent
                        </label>
                        <select
                            id="agent-filter"
                            value={filters.agent_id}
                            onChange={(e) => handleFilterChange('agent_id', e.target.value)}
                            disabled={loadingAgents}
                            className={styles.filterSelect}
                        >
                            <option value="">All Agents</option>
                            {agents.map((agent) => (
                                <option key={agent.id} value={agent.id}>
                                    {agent.name} ({agent.email})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Summary Card */}
            <div className={styles.summaryCard}>
                <div className={styles.summaryContent}>
                    <div className={styles.summaryLeft}>
                        <p>Total Requests</p>
                        <p className={styles.summaryTotal}>{pagination.total}</p>
                    </div>
                    <div className={styles.summaryRight}>
                        <p>Page {pagination.page} of {totalPages}</p>
                        <p className={styles.summaryPageInfo}>{pagination.size} per page</p>
                    </div>
                </div>
            </div>

            {/* Payouts Table */}
            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <span className={styles.loadingText}>Loading payouts...</span>
                </div>
            ) : payouts.length > 0 ? (
                <div className={styles.tableContainer}>
                    <table className={styles.payoutsTable}>
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>Agent</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Note</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payouts.map((payout) => (
                                <tr key={payout._id} className={styles.tableRow}>
                                    <td className={styles.requestId}>
                                        #{payout.request_id}
                                    </td>
                                    <td className={styles.agentInfo}>
                                        <div className={styles.agentDetails}>
                                            <User className={styles.agentIcon} />
                                            <div>
                                                <div className={styles.agentName}>
                                                    {agents.find(a => a.id === payout.agent_id)?.name || `Agent ${payout.agent_id}`}
                                                </div>
                                                <div className={styles.agentId}>
                                                    ID: {payout.agent_id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.amount}>
                                        <div className={styles.amountContainer}>
                                            <DollarSign className={styles.amountIcon} />
                                            <span className={styles.amountValue}>
                                                {formatCurrency(payout.amount, payout.currency)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={styles.status}>
                                        <span className={`${styles.statusBadge} ${getStatusBadgeClass(payout.status)}`}>
                                            {payout.status}
                                        </span>
                                    </td>
                                    <td className={styles.note}>
                                        {payout.note || 'No note'}
                                    </td>
                                    <td className={styles.createdAt}>
                                        <div className={styles.dateContainer}>
                                            <Calendar className={styles.dateIcon} />
                                            <span>{formatDate(payout.created_at)}</span>
                                        </div>
                                    </td>
                                    <td className={styles.actions}>
                                        {payout.status === 'pending' && (
                                            <div className={styles.actionButtons}>
                                                <button
                                                    onClick={() => handleDecideRequest(payout.request_id, true)}
                                                    disabled={processingRequest === payout.request_id}
                                                    className={`${styles.actionButton} ${styles.approveButton}`}
                                                >
                                                    <Check className={styles.buttonIcon} />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleDecideRequest(payout.request_id, false)}
                                                    disabled={processingRequest === payout.request_id}
                                                    className={`${styles.actionButton} ${styles.rejectButton}`}
                                                >
                                                    <X className={styles.buttonIcon} />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {payout.status !== 'pending' && (
                                            <span className={styles.processedStatus}>
                                                {payout.status === 'approved' ? 'Approved' : 'Rejected'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <Receipt className={styles.emptyStateIcon} />
                    <p className={styles.emptyStateText}>No payout requests found</p>
                    <p className={styles.emptyStateSubtext}>Payout requests will appear here when agents submit them</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <div className={styles.paginationLeft}>
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1 || loading}
                            className={styles.paginationButton}
                        >
                            Previous
                        </button>
                        <span className={styles.paginationInfo}>
                            Page {pagination.page} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= totalPages || loading}
                            className={styles.paginationButton}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Note Modal */}
            {showNoteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>
                                {selectedRequest?.approve ? 'Approve' : 'Reject'} Payout Request
                            </h3>
                            <button
                                onClick={cancelDecision}
                                className={styles.modalCloseButton}
                            >
                                <X className={styles.closeIcon} />
                            </button>
                        </div>
                        
                        <div className={styles.modalBody}>
                            <p className={styles.modalDescription}>
                                Please provide a note for this {selectedRequest?.approve ? 'approval' : 'rejection'}:
                            </p>
                            
                            <div className={styles.noteInputGroup}>
                                <label htmlFor="note-input" className={styles.noteLabel}>
                                    Note
                                </label>
                                <textarea
                                    id="note-input"
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Enter your note here..."
                                    className={styles.noteTextarea}
                                    rows={4}
                                />
                            </div>
                        </div>
                        
                        <div className={styles.modalFooter}>
                            <button
                                onClick={cancelDecision}
                                className={styles.modalCancelButton}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDecision}
                                disabled={processingRequest === selectedRequest?.requestId}
                                className={`${styles.modalConfirmButton} ${selectedRequest?.approve ? styles.approveButton : styles.rejectButton}`}
                            >
                                {processingRequest === selectedRequest?.requestId ? (
                                    <>
                                        <div className={styles.buttonSpinner}></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {selectedRequest?.approve ? (
                                            <>
                                                <Check className={styles.buttonIcon} />
                                                Approve
                                            </>
                                        ) : (
                                            <>
                                                <X className={styles.buttonIcon} />
                                                Reject
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PayoutListTable;
