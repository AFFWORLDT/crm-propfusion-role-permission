import React, { useState, useEffect } from "react";
import { agentWalletApi } from "../services/apiAgentWallet";
import { Wallet, TrendingDown } from "lucide-react";
import toast from "react-hot-toast";
import styles from "./AgentWalletBalance.module.css";

function AgentWalletBalance({ selectedAgent }) {
    const [walletBalance, setWalletBalance] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch wallet balance when agent is selected
    useEffect(() => {
        if (selectedAgent) {
            const fetchWalletBalance = async () => {
                setLoading(true);
                try {
                    const balance = await agentWalletApi.getAgentWalletBalance(selectedAgent.id);
                    setWalletBalance(balance);
                } catch (error) {
                    console.error("Error fetching wallet balance:", error);
                    toast.error("Failed to fetch wallet balance");
                    setWalletBalance(null);
                } finally {
                    setLoading(false);
                }
            };

            fetchWalletBalance();
        } else {
            setWalletBalance(null);
        }
    }, [selectedAgent]);

    const formatCurrency = (amount, currency = "AED") => {
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    };

    if (!selectedAgent) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerIcon}>
                    <Wallet />
                </div>
                <div className={styles.headerContent}>
                    <h2>Wallet Balance</h2>
                    <p>Current balance</p>
                </div>
            </div>

            {/* Balance Card */}
            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <span className={styles.loadingText}>Loading balance...</span>
                </div>
            ) : walletBalance ? (
                <div className={styles.balanceCard}>
                    <div className={styles.balanceHeader}>
                        <div className={styles.balanceInfo}>
                            <p>Current Balance</p>
                            <p className={styles.balanceAmount}>
                                {formatCurrency(walletBalance.current_balance, walletBalance.currency)}
                            </p>
                            <p className={styles.balanceAgentId}>
                                Agent ID: {walletBalance.agent_id}
                            </p>
                        </div>
                        <div className={styles.balanceIcon}>
                            <Wallet />
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.errorCard}>
                    <div className={styles.errorContent}>
                        <div className={styles.errorIcon}>
                            <TrendingDown />
                        </div>
                        <div>
                            <p className={styles.errorTitle}>Unable to load wallet balance</p>
                            <p className={styles.errorMessage}>
                                Please check if the agent has a wallet or try again later.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AgentWalletBalance;
