import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Globe, Wallet, Package, CreditCard, Sparkles } from "lucide-react";
import ProfileBusinessCardGenerator from "../ProfileBusinessCardGenerator";
import styles from "./LuxuryProfileActions.module.css";

const LuxuryProfileActions = ({ colorCode }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const handleGeneratePortfolio = () => {
        const agentId = currentUser?.id;
        if (agentId) {
            navigate(`/portfolio/${agentId}`);
        }
    };

    const handleWallet = () => {
        navigate("/wallet");
    };

    const profileActions = [
        {
            id: "portfolio",
            title: "Generate My Portfolio Website",
            description: "Create your professional portfolio",
            icon: Globe,
            onClick: handleGeneratePortfolio
        },
        {
            id: "ledger",
            title: "Ledger",
            description: "View your financial transactions",
            icon: Wallet,
            onClick: handleWallet
        },
        {
            id: "packages",
            title: "Packages",
            description: "Explore available packages",
            icon: Package,
            onClick: () => navigate('/packages')
        },
        {
            id: "business-card",
            title: "Generate Business Card",
            description: "Create your digital business card",
            icon: CreditCard,
            onClick: null
        }
    ];

    return (
        <div className={styles.luxuryProfileActions}>
            <div className={styles.header}>
                <div className={styles.headerIcon}>
                    <Sparkles className={styles.sparkleIcon} />
                </div>
                <div className={styles.headerContent}>
                    <h2 className={styles.title}>Quick Actions</h2>
                    <p className={styles.subtitle}>Access your essential tools</p>
                </div>
            </div>

            <div className={styles.actionsGrid}>
                {profileActions.map((action, index) => (
                    <div key={action.id} className={styles.actionCard}>
                        <div className={styles.cardBackground}>
                            <div className={styles.cardContent}>
                                <div className={styles.iconContainer}>
                                    <action.icon className={styles.actionIcon} />
                                </div>
                                
                                <div className={styles.textContent}>
                                    <h3 className={styles.actionTitle}>{action.title}</h3>
                                    <p className={styles.actionDescription}>{action.description}</p>
                                </div>

                                <div className={styles.actionButton}>
                                    {action.id === "business-card" ? (
                                        <ProfileBusinessCardGenerator
                                            currentUser={currentUser}
                                            colorCode={colorCode}
                                            isLuxury={true}
                                        />
                                    ) : (
                                        <button
                                            className={styles.luxuryButton}
                                            onClick={action.onClick}
                                            style={{
                                                background: "rgba(255, 255, 255, 0.2)",
                                                backdropFilter: "blur(10px)",
                                                border: "1px solid rgba(255, 255, 255, 0.3)"
                                            }}
                                        >
                                            <span className={styles.buttonText}>Access</span>
                                            <div className={styles.buttonGlow}></div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LuxuryProfileActions;
