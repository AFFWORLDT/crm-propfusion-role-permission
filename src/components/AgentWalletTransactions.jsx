import React, { useState, useEffect } from "react";
import { agentWalletApi } from "../services/apiAgentWallet";
import { Receipt, Calendar, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import styles from "./AgentWalletTransactions.module.css";

function AgentWalletTransactions({ selectedAgent }) {
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        size: 10
    });
    const [loading, setLoading] = useState(false);

    // Fetch transactions when agent is selected
    useEffect(() => {
        if (selectedAgent) {
            fetchTransactions(selectedAgent.id, 1);
        } else {
            setTransactions([]);
            setPagination({ total: 0, page: 1, size: 10 });
        }
    }, [selectedAgent]);

    const fetchTransactions = async (agentId, page = 1) => {
        setLoading(true);
        try {
            const data = await agentWalletApi.getAgentWalletTransactions(agentId, page, pagination.size);
            setTransactions(data.items || []);
            setPagination({
                total: data.total || 0,
                page: data.page || 1,
                size: data.size || 10
            });
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast.error("Failed to fetch transactions");
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (selectedAgent) {
            fetchTransactions(selectedAgent.id, newPage);
        }
    };

    const handleRefresh = () => {
        if (selectedAgent) {
            fetchTransactions(selectedAgent.id, pagination.page);
        }
    };

    const formatCurrency = (amount, currency = "AED") => {
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-AE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTransactionIcon = (transaction) => {
        // You can customize this based on transaction type
        if (transaction.type === 'credit') {
            return <ArrowUpRight className="w-4 h-4 text-green-600" />;
        } else {
            return <ArrowDownLeft className="w-4 h-4 text-red-600" />;
        }
    };

    const getTransactionColor = (transaction) => {
        if (transaction.type === 'credit') {
            return "text-green-600 bg-green-50";
        } else {
            return "text-red-600 bg-red-50";
        }
    };

    const totalPages = Math.ceil(pagination.total / pagination.size);

    if (!selectedAgent) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerIcon}>
                        <Receipt />
                    </div>
                    <div className={styles.headerContent}>
                        <h2>Transaction History</h2>
                        <p>Transaction history for {selectedAgent.name}</p>
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

            {/* Transactions Display */}
            <div className={styles.content}>
                {/* Transactions Summary */}
                <div className={styles.summaryCard}>
                    <div className={styles.summaryContent}>
                        <div className={styles.summaryLeft}>
                            <p>Total Transactions</p>
                            <p className={styles.summaryTotal}>{pagination.total}</p>
                        </div>
                        <div className={styles.summaryRight}>
                            <p>Page {pagination.page} of {totalPages}</p>
                            <p className={styles.summaryPageInfo}>{pagination.size} per page</p>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <span className={styles.loadingText}>Loading transactions...</span>
                    </div>
                ) : transactions.length > 0 ? (
                    <div className={styles.tableContainer}>
                        <table className={styles.transactionsTable}>
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Type</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction, index) => (
                                    <tr key={transaction._id || index} className={styles.tableRow}>
                                        <td className={styles.transactionId}>
                                            #{transaction.wallet_tx_id || transaction._id || index + 1}
                                        </td>
                                        <td className={styles.transactionDate}>
                                            {transaction.created_at ? formatDate(transaction.created_at) : 'N/A'}
                                        </td>
                                        <td className={styles.transactionDescription}>
                                            {transaction.description || 'No description'}
                                        </td>
                                        <td className={`${styles.transactionAmount} ${transaction.type === 'credit' ? styles.positive : styles.negative}`}>
                                            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency || 'AED')}
                                        </td>
                                        <td className={styles.transactionType}>
                                            <span className={`${styles.typeBadge} ${transaction.type === 'credit' ? styles.positive : styles.negative}`}>
                                                {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                                            </span>
                                        </td>
                                        <td className={styles.balanceInfo}>
                                            <div className={styles.balanceBefore}>
                                                <span className={styles.balanceLabel}>Before:</span>
                                                <span className={styles.balanceValue}>{formatCurrency(transaction.balance_before, transaction.currency || 'AED')}</span>
                                            </div>
                                            <div className={styles.balanceAfter}>
                                                <span className={styles.balanceLabel}>After:</span>
                                                <span className={styles.balanceValue}>{formatCurrency(transaction.balance_after, transaction.currency || 'AED')}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <Receipt className={styles.emptyStateIcon} />
                        <p className={styles.emptyStateText}>No transactions found for this agent</p>
                        <p className={styles.emptyStateSubtext}>Transactions will appear here once the agent starts using their wallet</p>
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
            </div>
        </div>
    );
}

export default AgentWalletTransactions;
