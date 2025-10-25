import React, { useState, useEffect } from "react";
import { 
    Link, 
    QrCode, 
    Copy, 
    Download, 
    Share2, 
    Users, 
    Sparkles,
    ExternalLink,
    Check
} from "lucide-react";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import useAllDetails from "../../features/all-details/useAllDetails";
import styles from "./PremiumAffiliateLink.module.css";

const PremiumAffiliateLink = ({ colorCode }) => {
    const { data } = useAllDetails();
    const currentUser = data?.current_user_details;
    
    const [qrCodeDataURL, setQrCodeDataURL] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    // Generate affiliate registration URL
    const affiliateUrl = `https://partnership.onexproperty.com/apply?affiliate_id=${currentUser?.id}&roleid=108`;

    // Generate QR code
    useEffect(() => {
        const generateQRCode = async () => {
            if (!currentUser?.id) return;
            
            setIsGenerating(true);
            try {
                const qrDataURL = await QRCode.toDataURL(affiliateUrl, { 
                    width: 200,
                    margin: 2,
                    color: {
                        dark: '#1a1a1a',
                        light: '#ffffff'
                    }
                });
                setQrCodeDataURL(qrDataURL);
            } catch (error) {
                console.error('Error generating QR code:', error);
                toast.error('Failed to generate QR code');
            } finally {
                setIsGenerating(false);
            }
        };

        generateQRCode();
    }, [currentUser?.id, affiliateUrl]);

    // Copy affiliate link to clipboard
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(affiliateUrl);
            setCopied(true);
            toast.success('Affiliate link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
            toast.error('Failed to copy link');
        }
    };

    // Download QR code
    const handleDownloadQR = () => {
        if (!qrCodeDataURL) return;

        const link = document.createElement('a');
        link.download = `affiliate-qr-code-${currentUser?.name || 'user'}.png`;
        link.href = qrCodeDataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('QR code downloaded!');
    };

    // Share functionality
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join My Team',
                    text: 'Join my real estate team using this link',
                    url: affiliateUrl,
                });
            } catch (err) {
                console.error('Error sharing:', err);
                handleCopyLink();
            }
        } else {
            handleCopyLink();
        }
    };

    return (
        <div className={styles.premiumAffiliateLink}>
            <div className={styles.header}>
                <div className={styles.headerIcon}>
                    <Sparkles className={styles.sparkleIcon} />
                </div>
                <div className={styles.headerContent}>
                    <h2 className={styles.title}>Affiliate Network</h2>
                    <p className={styles.subtitle}>Grow your team with referrals</p>
                </div>
            </div>

            <div className={styles.contentGrid}>
                {/* Affiliate Link Card */}
                <div className={`${styles.linkCard} ${styles.primaryCard}`}>
                    <div className={styles.cardBackground}>
                        <div className={styles.cardContent}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconContainer}>
                                    <Link className={styles.cardIcon} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <h3>Your Affiliate Link</h3>
                                    <p>Share to invite new agents</p>
                                </div>
                            </div>
                            
                            <div className={styles.linkContainer}>
                                <div className={styles.linkDisplay}>
                                    <span className={styles.linkText}>{affiliateUrl}</span>
                                </div>
                                <button 
                                    className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
                                    onClick={handleCopyLink}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>

                            <div className={styles.actionButtons}>
                                <button 
                                    className={styles.actionButton}
                                    onClick={handleShare}
                                >
                                    <Share2 size={16} />
                                    <span>Share</span>
                                </button>
                                <button 
                                    className={styles.actionButton}
                                    onClick={() => window.open(affiliateUrl, '_blank')}
                                >
                                    <ExternalLink size={16} />
                                    <span>Preview</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* QR Code Card */}
                <div className={`${styles.qrCard} ${styles.secondaryCard}`}>
                    <div className={styles.cardBackground}>
                        <div className={styles.cardContent}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconContainer}>
                                    <QrCode className={styles.cardIcon} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <h3>QR Code</h3>
                                    <p>Easy mobile access</p>
                                </div>
                            </div>
                            
                            <div className={styles.qrContainer}>
                                {isGenerating ? (
                                    <div className={styles.qrLoading}>
                                        <div className={styles.loadingSpinner}></div>
                                        <p>Generating QR Code...</p>
                                    </div>
                                ) : qrCodeDataURL ? (
                                    <div className={styles.qrCodeWrapper}>
                                        <img 
                                            src={qrCodeDataURL} 
                                            alt="Affiliate QR Code" 
                                            className={styles.qrCodeImage}
                                        />
                                    </div>
                                ) : (
                                    <div className={styles.qrError}>
                                        <p>Failed to generate QR code</p>
                                    </div>
                                )}
                            </div>

                            <button 
                                className={styles.downloadButton}
                                onClick={handleDownloadQR}
                                disabled={!qrCodeDataURL}
                            >
                                <Download size={16} />
                                <span>Download QR</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Card */}
                <div className={`${styles.statsCard} ${styles.tertiaryCard}`}>
                    <div className={styles.cardBackground}>
                        <div className={styles.cardContent}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconContainer}>
                                    <Users className={styles.cardIcon} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <h3>Network Stats</h3>
                                    <p>Your referral performance</p>
                                </div>
                            </div>
                            
                            <div className={styles.statsGrid}>
                                <div className={styles.statItem}>
                                    <div className={styles.statValue}>0</div>
                                    <div className={styles.statLabel}>Total Referrals</div>
                                </div>
                                <div className={styles.statItem}>
                                    <div className={styles.statValue}>0</div>
                                    <div className={styles.statLabel}>Active Agents</div>
                                </div>
                                <div className={styles.statItem}>
                                    <div className={styles.statValue}>0</div>
                                    <div className={styles.statLabel}>This Month</div>
                                </div>
                                <div className={styles.statItem}>
                                    <div className={styles.statValue}>AED 0</div>
                                    <div className={styles.statLabel}>Earnings</div>
                                </div>
                            </div>

                            <div className={styles.quickTip}>
                                <div className={styles.tipIcon}>💡</div>
                                <p>Share your link on social media to grow your network faster</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumAffiliateLink;
