import React, { useState, useEffect } from "react";
import { 
    Wallet, 
    TrendingUp, 
    Users, 
    DollarSign, 
    RefreshCw, 
    Crown,
    Star,
    Target,
    Home,
    ArrowUpRight,
    Sparkles,
    Coins,
    Banknote
} from "lucide-react";
import { getWalletSummary } from "../../services/apiAffiliateWallet";
import { useNavigate } from "react-router-dom";
import styles from "./PremiumWalletBalance.module.css";

const PremiumWalletBalance = ({ colorCode }) => {
    const navigate = useNavigate();
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWalletData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getWalletSummary();
            setWalletData(data);
        } catch (err) {
            console.error("Error fetching wallet data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    const handleWalletClick = () => {
        navigate("/wallet");
    };

    const handleAffiliateClick = () => {
        navigate("/affiliate-wallet");
    };

    if (loading) {
        return (
            <div className={styles.premiumWalletBalance}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}>
                        <RefreshCw className={styles.spinningIcon} />
                    </div>
                    <p className={styles.loadingText}>Loading wallet data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.premiumWalletBalance}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <p className={styles.errorText}>Failed to load wallet data</p>
                    <button 
                        className={styles.retryButton}
                        onClick={fetchWalletData}
                    >
                        <RefreshCw size={16} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const walletBalance = walletData?.wallet?.current_balance || 0;
    const totalBalance = walletBalance;
    const currency = walletData?.wallet?.currency || "AED";
    
    // Get transaction and payout counts
    const transactionCount = walletData?.transactions?.total || 0;
    const payoutCount = walletData?.payouts?.total || 0;
    
    // Get dashboard stats for more useful information
    const dashboardStats = walletData?.dashboard || {};
    const totalProperties = dashboardStats?.total_properties || 0;
    const totalLeads = dashboardStats?.total_leads || 0;

    return (
        <div className={styles.premiumWalletBalance}>
            <div className={styles.header}>
                <div className={styles.headerIcon}>
                    <Sparkles className={styles.sparkleIcon} />
                </div>
                <div className={styles.headerContent}>
                    <h2 className={styles.title}>Wallet Overview</h2>
                    <p className={styles.subtitle}>Your financial summary</p>
                </div>
                <button 
                    className={styles.refreshButton}
                    onClick={fetchWalletData}
                    disabled={loading}
                    title="Refresh"
                >
                    <RefreshCw 
                        size={18} 
                        className={loading ? styles.spinning : ""} 
                    />
                </button>
            </div>

            <div className={styles.walletGrid}>
                {/* Total Balance Card */}
                <div className={`${styles.walletCard} ${styles.totalBalanceCard}`}>
                    <div className={styles.cardBackground}>
                        <div className={styles.cardContent}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconContainer}>
                                    <Banknote className={styles.cardIcon} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <h3>Total Balance</h3>
                                    <p>Combined earnings</p>
                                </div>
                            </div>
                            
                            <div className={styles.balanceAmount}>
                                <span className={styles.currency}>{currency}</span>
                                <span className={styles.amount}>
                                    {totalBalance.toLocaleString()}
                                </span>
                            </div>

                            <div className={styles.balanceBreakdown}>
                                <div className={styles.breakdownItem}>
                                    <span className={styles.breakdownLabel}>Available</span>
                                    <span className={styles.breakdownValue}>
                                        {currency} {walletBalance.toLocaleString()}
                                    </span>
                                </div>
                                <div className={styles.breakdownItem}>
                                    <span className={styles.breakdownLabel}>Transactions</span>
                                    <span className={styles.breakdownValue}>
                                        {transactionCount} Total
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Agent Wallet Card */}
                <div className={`${styles.walletCard} ${styles.agentWalletCard}`}>
                    <div className={styles.cardBackground}>
                        <div className={styles.cardContent}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconContainer}>
                                    <Wallet className={styles.cardIcon} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <h3>Agent Wallet</h3>
                                    <p>Commission earnings</p>
                                </div>
                            </div>
                            
                            <div className={styles.balanceAmount}>
                                <span className={styles.currency}>{currency}</span>
                                <span className={styles.amount}>
                                    {walletBalance.toLocaleString()}
                                </span>
                            </div>

                            <div className={styles.cardStats}>
                                <div className={styles.statItem}>
                                    <TrendingUp size={16} />
                                    <span>{transactionCount} Transactions</span>
                                </div>
                                <div className={styles.statItem}>
                                    <RefreshCw size={16} />
                                    <span>{payoutCount} Payouts</span>
                                </div>
                            </div>

                            <button 
                                className={styles.actionButton}
                                onClick={handleWalletClick}
                            >
                                <span>View Details</span>
                                <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats Card */}
                <div className={`${styles.walletCard} ${styles.dashboardStatsCard}`}>
                    <div className={styles.cardBackground}>
                        <div className={styles.cardContent}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconContainer}>
                                    <TrendingUp className={styles.cardIcon} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <h3>Dashboard Stats</h3>
                                    <p>Property & lead overview</p>
                                </div>
                            </div>
                            
                            <div className={styles.balanceAmount}>
                                <span className={styles.currency}>Total</span>
                                <span className={styles.amount}>
                                    {totalProperties + totalLeads}
                                </span>
                            </div>

                            <div className={styles.cardStats}>
                                <div className={styles.statItem}>
                                    <Home size={16} />
                                    <span>{totalProperties} Properties</span>
                                </div>
                                <div className={styles.statItem}>
                                    <Users size={16} />
                                    <span>{totalLeads} Leads</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className={`${styles.walletCard} ${styles.quickActionsCard}`}>
                    <div className={styles.cardBackground}>
                        <div className={styles.cardContent}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconContainer}>
                                    <Coins className={styles.cardIcon} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <h3>Quick Actions</h3>
                                    <p>Manage your funds</p>
                                </div>
                            </div>
                            
                            <div className={styles.quickActions}>
                                <button 
                                    className={styles.quickActionButton}
                                    onClick={handleWalletClick}
                                >
                                    <Wallet size={18} />
                                    <span>Request Payout</span>
                                </button>
                                <button 
                                    className={styles.quickActionButton}
                                    onClick={() => navigate('/dashboard')}
                                >
                                    <TrendingUp size={18} />
                                    <span>View Stats</span>
                                </button>
                            </div>

                            <div className={styles.statusIndicator}>
                                <div className={styles.statusDot}></div>
                                <span>All systems operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumWalletBalance;
