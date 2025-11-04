import { useState } from 'react';
import SectionTop from '../ui/SectionTop';
import useAllDetails from '../features/all-details/useAllDetails';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Star, CheckCircle, ExternalLink, Copy, Banknote, Coins } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './Packages.module.css';

const Packages = () => {
    const { data } = useAllDetails();
    const { currentUser } = useAuth();
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);
    
    // Debug: Log user data to console
    console.log('Packages - User data:', {
        currentUserDetails: data?.current_user_details,
        currentUser,
        userId: data?.current_user_details?.id || currentUser?.id
    });
    
    const companySettings = data?.company_settings || {};
    const colorCode = companySettings.sidebar_color_code || "#020079";

    // Real packages with actual payment links
    const packages = [
        {
            id: "essential",
            name: "Essential",
            price: "100",
            currency: "USD",
            description: "",
            refund: "Bonus $100 refund after first property sale.",
            features: [
                "10% Commission on property sales",
                "3 qualified leads per year",
                "10% Commission on Package Sale",
                "6-Level Income on team sales",
                "Bonus $100 refund after first property sale.",
                "Training through ONEX Academy (from basics to leadership)",
                "Access for CRM Software"
            ],
            paymentLink: "https://business.mamopay.com/pay/affworldfzllc-f8fb25",
            popular: false,
            color: "#3B82F6"
        },
        {
            id: "premium",
            name: "Premium",
            price: "1500",
            currency: "USD",
            description: "All Essential features plus premium benefits",
            refund: "Bonus $1500 Refund After First Property Sale",
            features: [
                "All Essential features included",
                "Kings Global Academy UK Real Estate Manager Certified Course",
                "International Tour 3N/4D Fully (Dubai/Thailand)",
                "Award with Bollywood Celebrity",
                "Bonus $1500 Refund After First Property Sale",
                "Up to 80% Commission",
                "9 qualified leads per year",
                "10% Commission on Package Sale",
                "Weekly Payout",
                "CRM of Choice: Now in your OneX tech stack!",
                "Dubai Office Access",
                "More Benefits. Ask me!"
            ],
            paymentLink: "https://business.mamopay.com/pay/affworldfzllc-b0fe38",
            popular: true,
            color: "#10B981"
        },
        {
            id: "exclusive",
            name: "Exclusive",
            price: "3000",
            currency: "USD",
            description: "All Premium features plus exclusive benefits",
            refund: "Bonus $3000 Refund After First Property Sale",
            features: [
                "All Premium features included",
                "Kings Global Academy UK Real Estate Expert Certified Course",
                "International Tour 3N/4D Fully (UK/Europe)",
                "Award with Bollywood Celebrity",
                "Bonus $3000 Refund After First Property Sale",
                "Up to 80% Commission",
                "15 qualified leads per year",
                "10% Commission on Package Sale",
                "Weekly Payout",
                "CRM of Choice: Now in your OneX tech stack!",
                "Dubai Office Access",
                "More Benefits. Ask me!"
            ],
            paymentLink: "https://business.mamopay.com/pay/affworldfzllc-3a57e4",
            popular: false,
            color: "#8B5CF6"
        }
    ];

    // Real bank account details
    const bankDetails = {
        accountName: "ONE X REAL ESTATE LLC",
        accountNumber: "019101816816",
        iban: "AE110330000019101816816",
        bankName: "Mashreq Bank",
        swiftCode: "BOMLAEAD",
        branchCode: "033",
        currency: "AED"
    };

    const handleSelectPackage = (pkg) => {
        setSelectedPackage(pkg);
        setShowPaymentDetails(true);
    };

    const handleBackToPackages = () => {
        setShowPaymentDetails(false);
        setSelectedPackage(null);
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success(`${label} copied to clipboard!`);
        }).catch(() => {
            toast.error('Failed to copy to clipboard');
        });
    };


    if (showPaymentDetails && selectedPackage) {
        return (
            <div className="sectionContainer">
                <SectionTop heading="Payment Details" />
                <div className="sectionStyles">
                    <div className={styles.paymentContainer}>
                        <div className={styles.paymentHeader}>
                            <button 
                                className={styles.backButton}
                                onClick={handleBackToPackages}
                            >
                                ← Back to Packages
                            </button>
                            <h2>Complete Your Payment</h2>
                            <div className={styles.selectedPackage}>
                                <h3>{selectedPackage.name}</h3>
                                <div className={styles.price}>
                                    {selectedPackage.currency} {selectedPackage.price}
                                </div>
                                <div className={styles.refund}>
                                    {selectedPackage.refund}
                                </div>
                            </div>
                        </div>

                        <div className={styles.paymentMethods}>
                            {/* Bank Transfer Section */}
                            <div className={styles.paymentSection}>
                                <div className={styles.sectionHeader}>
                                    <Banknote className={styles.icon} />
                                    <h3>Bank Transfer</h3>
                                </div>
                                <div className={styles.bankDetails}>
                                    <div className={styles.bankDetailItem}>
                                        <label>Account Name:</label>
                                        <div className={styles.detailValue}>
                                            <span>{bankDetails.accountName}</span>
                                            <button 
                                                className={styles.copyButton}
                                                onClick={() => copyToClipboard(bankDetails.accountName, 'Account name')}
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.bankDetailItem}>
                                        <label>Account Number:</label>
                                        <div className={styles.detailValue}>
                                            <span>{bankDetails.accountNumber}</span>
                                            <button 
                                                className={styles.copyButton}
                                                onClick={() => copyToClipboard(bankDetails.accountNumber, 'Account number')}
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.bankDetailItem}>
                                        <label>IBAN:</label>
                                        <div className={styles.detailValue}>
                                            <span>{bankDetails.iban}</span>
                                            <button 
                                                className={styles.copyButton}
                                                onClick={() => copyToClipboard(bankDetails.iban, 'IBAN')}
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.bankDetailItem}>
                                        <label>Bank Name:</label>
                                        <div className={styles.detailValue}>
                                            <span>{bankDetails.bankName}</span>
                                        </div>
                                    </div>
                                    <div className={styles.bankDetailItem}>
                                        <label>Swift Code:</label>
                                        <div className={styles.detailValue}>
                                            <span>{bankDetails.swiftCode}</span>
                                            <button 
                                                className={styles.copyButton}
                                                onClick={() => copyToClipboard(bankDetails.swiftCode, 'Swift code')}
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.bankDetailItem}>
                                        <label>Currency:</label>
                                        <div className={styles.detailValue}>
                                            <span>{bankDetails.currency}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.paymentInstructions}>
                                    <h4>Payment Instructions:</h4>
                                    <ol>
                                        <li>Transfer {selectedPackage.currency} {selectedPackage.price} to the account details above</li>
                                        <li>Include your user ID (<strong>{data?.current_user_details?.id || currentUser?.id || 'Loading...'}</strong>) in the payment reference</li>
                                        <li>Send payment confirmation to support@company.com</li>
                                        <li>Your subscription will be activated within 24 hours</li>
                                    </ol>
                                </div>
                            </div>

                            {/* Online Payment Section */}
                            <div className={styles.paymentSection}>
                                <div className={styles.sectionHeader}>
                                    <CreditCard className={styles.icon} />
                                    <h3>Online Payment</h3>
                                </div>
                                <div className={styles.onlinePayment}>
                                    <p>Click the button below to complete your payment securely:</p>
                                    <a 
                                        href={selectedPackage.paymentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.paymentLinkButton}
                                        style={{ background: colorCode }}
                                    >
                                        <ExternalLink size={20} />
                                        Pay ${selectedPackage.price} Online
                                    </a>
                                    <p className={styles.paymentNote}>
                                        You will be redirected to our secure payment gateway
                                    </p>
                                </div>
                            </div>

                            {/* Cryptocurrency Payment Section removed as per request */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sectionContainer">
            <SectionTop heading="Choose Your Plan" />
            <div className="sectionStyles">
                <div className={styles.packagesContainer}>
                    <div className={styles.packagesHeader}>
                        <h2>Select the Perfect Plan for Your Business</h2>
                        <p>Choose from our flexible pricing plans designed to grow with your real estate business</p>
                    </div>

                    <div className={styles.packagesGrid}>
                        {packages.map((pkg) => (
                            <div 
                                key={pkg.id} 
                                className={`${styles.packageCard} ${pkg.popular ? styles.popular : ''}`}
                            >
                                {pkg.popular && (
                                    <div className={styles.popularBadge}>
                                        <Star size={16} />
                                        Most Popular
                                    </div>
                                )}
                                
                                <div className={styles.packageHeader}>
                                    <h3>{pkg.name}</h3>
                                    <div className={styles.price}>
                                        <span className={styles.currency}>$</span>
                                        <span className={styles.amount}>{pkg.price}</span>
                                    </div>
                                    <div className={styles.refund}>
                                        {pkg.refund}
                                    </div>
                                    <p className={styles.description}>{pkg.description}</p>
                                </div>

                                <div className={styles.features}>
                                    <h4>What&apos;s included:</h4>
                                    <ul>
                                        {pkg.features.map((feature, index) => (
                                            <li key={index}>
                                                <CheckCircle size={16} className={styles.checkIcon} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button 
                                    className={styles.selectButton}
                                    style={{ 
                                        background: colorCode,
                                        borderColor: colorCode
                                    }}
                                    onClick={() => handleSelectPackage(pkg)}
                                >
                                    Select Plan
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={styles.packagesFooter}>
                        <h3>Need a custom solution?</h3>
                        <p>Contact our sales team for enterprise pricing and custom features</p>
                        <button 
                            className={styles.contactButton}
                            onClick={() => window.open('mailto:support@company.com', '_blank')}
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Packages;
