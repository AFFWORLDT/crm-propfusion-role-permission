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
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank');
    
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
            price: 100,
            currency: "$",
            description: "Perfect for getting started",
            features: [
                "Basic lead management",
                "Property listings",
                "Email support",
                "Standard reports"
            ],
            paymentLink: "https://business.mamopay.com/pay/affworldfzllc-2ad088",
            refund: "7-day money-back guarantee",
            popular: false
        },
        {
            id: "premium",
            name: "Premium",
            price: 1500,
            currency: "$",
            description: "Advanced features for growing businesses",
            features: [
                "Everything in Essential",
                "Advanced analytics",
                "Priority support",
                "Custom integrations",
                "Team collaboration",
                "API access"
            ],
            paymentLink: "https://business.mamopay.com/pay/affworldfzllc-c431ba",
            refund: "14-day money-back guarantee",
            popular: true
        },
        {
            id: "exclusive",
            name: "Exclusive",
            price: 3000,
            currency: "$",
            description: "Full-featured solution for enterprises",
            features: [
                "Everything in Premium",
                "White-label solution",
                "Dedicated account manager",
                "Custom development",
                "24/7 phone support",
                "Advanced security"
            ],
            paymentLink: "https://business.mamopay.com/pay/affworldfzllc-5134df",
            refund: "30-day money-back guarantee",
            popular: false
        }
    ];

    // Bank details
    const bankDetails = {
        accountName: "ONE X REAL ESTATE LLC",
        accountNumber: "019101816816",
        iban: "AE110330000019101816816",
        bankName: "Mashreq Bank",
        swiftCode: "BOMLAEAD",
        branchCode: "033",
        currency: "AED"
    };

    const handleBuyNow = (pkg) => {
        setSelectedPackage(pkg);
        setShowPaymentDetails(true);
    };

    const handleBackToPackages = () => {
        setShowPaymentDetails(false);
        setSelectedPackage(null);
    };

    const copyToClipboard = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${label} copied to clipboard!`);
        } catch (err) {
            toast.error('Failed to copy to clipboard');
        }
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
                            {/* Payment Method Selection */}
                            <div className={styles.paymentMethodSelection}>
                                <h3>Choose Payment Method</h3>
                                <div className={styles.paymentOptions}>
                                    <label className={`${styles.paymentOption} ${selectedPaymentMethod === 'bank' ? styles.selected : ''}`}>
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value="bank"
                                            checked={selectedPaymentMethod === 'bank'}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        />
                                        <div className={styles.optionIcon}>
                                            <Banknote size={24} />
                                        </div>
                                        <div className={styles.optionContent}>
                                            <div className={styles.optionTitle}>Bank Transfer</div>
                                            <div className={styles.optionDescription}>Direct bank transfer</div>
                                        </div>
                                    </label>

                                    <label className={`${styles.paymentOption} ${selectedPaymentMethod === 'card' ? styles.selected : ''}`}>
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value="card"
                                            checked={selectedPaymentMethod === 'card'}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        />
                                        <div className={styles.optionIcon}>
                                            <CreditCard size={24} />
                                        </div>
                                        <div className={styles.optionContent}>
                                            <div className={styles.optionTitle}>Credit/Debit Card</div>
                                            <div className={styles.optionDescription}>Secure payment with Visa, MasterCard</div>
                                        </div>
                                    </label>

                                    <label className={`${styles.paymentOption} ${selectedPaymentMethod === 'crypto' ? styles.selected : ''}`}>
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value="crypto"
                                            checked={selectedPaymentMethod === 'crypto'}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        />
                                        <div className={styles.optionIcon}>
                                            <Coins size={24} />
                                        </div>
                                        <div className={styles.optionContent}>
                                            <div className={styles.optionTitle}>USDT TRC20</div>
                                            <div className={styles.optionDescription}>Cryptocurrency payment</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Bank Transfer Section */}
                            {selectedPaymentMethod === 'bank' && (
                                <div className={styles.paymentSection}>
                                    <div className={styles.sectionHeader}>
                                        <Banknote className={styles.icon} />
                                        <h3>Bank Transfer Details</h3>
                                    </div>
                                    <div className={styles.bankDetails}>
                                        <div className={styles.bankInfo}>
                                            <div className={styles.bankRow}>
                                                <span className={styles.label}>Account Holder:</span>
                                                <span className={styles.value}>{bankDetails.accountName}</span>
                                                <button 
                                                    className={styles.copyButton}
                                                    onClick={() => copyToClipboard(bankDetails.accountName, 'Account Name')}
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                            <div className={styles.bankRow}>
                                                <span className={styles.label}>Bank Name:</span>
                                                <span className={styles.value}>{bankDetails.bankName}</span>
                                                <button 
                                                    className={styles.copyButton}
                                                    onClick={() => copyToClipboard(bankDetails.bankName, 'Bank Name')}
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                            <div className={styles.bankRow}>
                                                <span className={styles.label}>Account Number:</span>
                                                <span className={styles.value}>{bankDetails.accountNumber}</span>
                                                <button 
                                                    className={styles.copyButton}
                                                    onClick={() => copyToClipboard(bankDetails.accountNumber, 'Account Number')}
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                            <div className={styles.bankRow}>
                                                <span className={styles.label}>IBAN:</span>
                                                <span className={styles.value}>{bankDetails.iban}</span>
                                                <button 
                                                    className={styles.copyButton}
                                                    onClick={() => copyToClipboard(bankDetails.iban, 'IBAN')}
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                            <div className={styles.bankRow}>
                                                <span className={styles.label}>SWIFT Code:</span>
                                                <span className={styles.value}>{bankDetails.swiftCode}</span>
                                                <button 
                                                    className={styles.copyButton}
                                                    onClick={() => copyToClipboard(bankDetails.swiftCode, 'SWIFT Code')}
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className={styles.paymentInstructions}>
                                            <h4>Payment Instructions:</h4>
                                            <ul>
                                                <li>Transfer exactly <strong>{selectedPackage.currency} {selectedPackage.price}</strong> to the account above</li>
                                                <li>Include your user ID (<strong>{data?.current_user_details?.id || currentUser?.id || 'Loading...'}</strong>) in the payment reference</li>
                                                <li>Keep the bank receipt as proof of payment</li>
                                                <li>Payment confirmation may take 1-3 business days</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Credit/Debit Card Section */}
                            {selectedPaymentMethod === 'card' && (
                                <div className={styles.paymentSection}>
                                    <div className={styles.sectionHeader}>
                                        <CreditCard className={styles.icon} />
                                        <h3>Credit/Debit Card Payment</h3>
                                    </div>
                                    <div className={styles.cardPayment}>
                                        <p>Pay securely with your credit or debit card using our secure payment gateway.</p>
                                        <a 
                                            href={selectedPackage.paymentLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.paymentLinkButton}
                                        >
                                            <ExternalLink size={20} />
                                            Pay {selectedPackage.currency}{selectedPackage.price} Now
                                        </a>
                                        <div className={styles.cardInstructions}>
                                            <h4>Important:</h4>
                                            <ul>
                                                <li>You will be redirected to a secure payment page</li>
                                                <li>Include your user ID (<strong>{data?.current_user_details?.id || currentUser?.id || 'Loading...'}</strong>) in the payment reference</li>
                                                <li>Payment is processed securely and encrypted</li>
                                                <li>You will receive a confirmation email after payment</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cryptocurrency Payment Section */}
                            {selectedPaymentMethod === 'crypto' && (
                                <div className={styles.paymentSection}>
                                    <div className={styles.sectionHeader}>
                                        <Coins className={styles.icon} />
                                        <h3>USDT TRC20 Payment</h3>
                                    </div>
                                    <div className={styles.cryptoPayment}>
                                        <p>Pay securely with USDT TRC20. Scan QR code or copy wallet address below.</p>
                                        
                                        <div className={styles.cryptoDetails}>
                                            <div className={styles.qrCodeSection}>
                                                <div className={styles.qrContainer}>
                                                    <img 
                                                        src="/images/trc20.jpeg" 
                                                        alt="USDT TRC20 QR Code" 
                                                        className={styles.qrCode}
                                                    />
                                                    <p className={styles.qrNote}>Scan QR code with your USDT wallet</p>
                                                </div>
                                            </div>
                                            
                                            <div className={styles.cryptoAddress}>
                                                <label>USDT TRC20 Wallet Address:</label>
                                                <div className={styles.addressInputContainer}>
                                                    <input 
                                                        type="text" 
                                                        value="TQBMmDHfpeJ5R2PMLW3usqePTqvZ3WQpM6"
                                                        readOnly
                                                        className={styles.cryptoAddressInput}
                                                    />
                                                    <button 
                                                        className={styles.copyButton}
                                                        onClick={() => copyToClipboard('TQBMmDHfpeJ5R2PMLW3usqePTqvZ3WQpM6', 'USDT TRC20 Address')}
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                                
                                                <div className={styles.cryptoInstructions}>
                                                    <h4>Important:</h4>
                                                    <ul>
                                                        <li>Send exactly <strong>{selectedPackage.currency} {selectedPackage.price}</strong> USDT</li>
                                                        <li>Use <strong>TRC20 network only</strong></li>
                                                        <li>Include your user ID (<strong>{data?.current_user_details?.id || currentUser?.id || 'Loading...'}</strong>) in memo</li>
                                                        <li>Payment confirmation may take 10-30 minutes</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className={styles.contactSection}>
                                <h3>Need Help?</h3>
                                <p>If you have any questions about payment or need assistance, please contact our support team.</p>
                                <button className={styles.contactButton}>
                                    Contact Support
                                </button>
                            </div>
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
                            <div key={pkg.id} className={`${styles.packageCard} ${pkg.popular ? styles.popular : ''}`}>
                                {pkg.popular && (
                                    <div className={styles.popularBadge}>
                                        <Star size={16} />
                                        Most Popular
                                    </div>
                                )}
                                
                                <div className={styles.packageHeader}>
                                    <h3>{pkg.name}</h3>
                                    <div className={styles.price}>
                                        <span className={styles.currency}>{pkg.currency}</span>
                                        <span className={styles.amount}>{pkg.price}</span>
                                    </div>
                                    <p className={styles.description}>{pkg.description}</p>
                                </div>
                                
                                <div className={styles.features}>
                                    <h4>What&apos;s included:</h4>
                                    <ul>
                                        {pkg.features.map((feature, index) => (
                                            <li key={index}>
                                                <CheckCircle className={styles.checkIcon} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className={styles.refund}>
                                    <p>{pkg.refund}</p>
                                </div>
                                
                                <button 
                                    className={styles.selectButton}
                                    onClick={() => handleBuyNow(pkg)}
                                >
                                    Select {pkg.name}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Packages;