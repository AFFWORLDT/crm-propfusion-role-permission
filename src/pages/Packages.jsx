import { useState } from 'react';
import SectionTop from '../ui/SectionTop';
import useAllDetails from '../features/all-details/useAllDetails';
import { useAuth } from '../context/AuthContext';
import { CreditCard, CheckCircle, ExternalLink, Copy, Banknote, Building2, Users, Check, ArrowRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './Packages.module.css';

const Packages = () => {
    const { data } = useAllDetails();
    const { currentUser } = useAuth();
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedType, setSelectedType] = useState('partners'); // 'brokers' or 'partners' - default to 'partners'
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [modalPlan, setModalPlan] = useState(null);
    
    const companySettings = data?.company_settings || {};
    const colorCode = companySettings.sidebar_color_code || "#020079";

    // Broker plans
    const brokerPlans = [
        {
            id: 'broker-essential',
            name: 'Essential',
            price: '100',
            originalPrice: null,
            discount: null,
            bonus: 'Bonus: $100 refund after your first property sale',
            region: null,
            features: [
                'Up to 80% commission on property sales',
                '3-level commission income on team sales',
                'Up to 15% commission on membership package sales (3 levels)',
                'Weekly commission payouts',
                '4 qualified leads per year',
                'Limited access to OneX CRM and advanced client management tools',
                'Comprehensive Real Estate training (recorded) through OneX Academy',
                'Company Branding Kit'
            ],
            bestFor: 'New brokers entering the Dubai property market',
            paymentLink: "https://business.mamopay.com/pay/affworldfzllc-f8fb25"
        },
        {
            id: 'broker-premium',
            name: 'Premium',
            price: '750',
            originalPrice: '1000',
            discount: '25% discount applied',
            bonus: 'Bonus: Membership Package refund after first property sale',
            region: 'UAE',
            features: [
                'Up to 80% commission on property sales',
                'Kings Global Academy (UK) — Real Estate Professional Certified Course',
                'Award ceremony with Bollywood celebrity',
                '3-level commission income on team sales',
                'Up to 15% commission on membership package sales (3 levels)',
                'Weekly commission payouts',
                '8 qualified leads per year',
                'Full access to OneX CRM and advanced client management tools',
                'Dubai office access',
                'Branding kit'
            ],
            bestFor: 'UAE-based brokers seeking professional certification and local office access',
            paymentLink: "https://business.mamopay.com/pay/affworldfzllc-53c101"
        },
        {
            id: 'broker-exclusive',
            name: 'Exclusive',
            price: '2000',
            originalPrice: null,
            discount: null,
            bonus: 'Bonus: $3,000 refund after your first property sale',
            region: 'Asia',
            features: [
                'Up to 80% commission on property sales',
                'Kings Global Academy (UK) Real Estate Manager Certified Course',
                'Fully sponsored international tour: 3 nights/4 days Thailand/Georgia',
                'Award ceremony with Bollywood celebrity',
                '3-level commission income on team sales',
                'Up to 15% commission on membership package sales (3 levels)',
                'Weekly commission payouts',
                '12 qualified leads per year',
                'Full access to OneX CRM and advanced client management tools',
                'Dubai office access',
                'Branding kit',
                'Additional exclusive benefits'
            ],
            bestFor: 'Mid-level brokers ready to expand internationally',
            paymentLink: "https://business.mamopay.com/pay/affworldfzllc-b83acc"
        }
    ];

    // Common features for all partner plans - Multiple Income Streams & High Commission Payouts
    const commonIncomeFeatures = [
        'Earn on both membership packages and property sales',
        'Up to 80% commission on property sales',
        'Up to 15% commission on membership package referrals',
        '3-level team income',
        'Weekly commission payout'
    ];

    // Common features for all partner plans - Advanced Platform Access
    const commonPlatformFeatures = [
        'Full access to OneX CRM and advanced client management tools',
        'Advance AI tools',
        'Real-time commission tracking with transparent payout system',
        'Instant access to elite profile and exclusive property portfolio',
        'Company Branding Kit',
        'Dubai office access',
        'Additional exclusive benefits'
    ];

    // Partner plans
    const partnerPlans = [
        {
            id: 'partner-essential',
            name: 'Essential',
            price: '100',
            originalPrice: null,
            discount: null,
            popular: false,
            bonus: 'Fee Scholarship After the First Property Sale',
            region: null,
            certification: 'Real Estate Basic Awareness - Recognition certification from OneX',
            internationalTour: null,
            awardCeremony: null,
            additionalBenefit: '5 Leads Yearly',
            bestFor: 'New partners testing the real estate model',
            paymentLink: "https://business.mamopay.com/pay/affworldfzllc-f8fb25"
        },
        {
            id: 'partner-premium',
            name: 'Premium',
            price: '500',
            originalPrice: null,
            discount: null,
            popular: false,
            bonus: 'Fee Scholarship After the First Property Sale',
            region: null,
            certification: 'Kings Global Academy (UK) - Real Estate Professional Certified Course',
            internationalTour: null,
            awardCeremony: null,
            additionalBenefit: 'Broker Club',
            bestFor: 'Indian influencers and leaders with established audiences',
            paymentLink: "https://business.mamopay.com/pay/affworldfzllc-a061dc"
        },
        {
            id: 'partner-premium-plus',
            name: 'Premium Plus',
            price: '1500',
            originalPrice: '3000',
            discount: '50% OFF',
            popular: true,
            bonus: 'Fee Scholarship After the First Property Sale',
            region: null,
            certification: 'Kings Global Academy (UK) - Real Estate Manager Certified Course',
            internationalTour: 'Fully sponsored international tour: 3 nights/4 days (Dubai)',
            awardCeremony: 'Award ceremony with Bollywood celebrity',
            additionalBenefit: 'Job Assurance',
            bestFor: 'Asian partners ready to scale their network internationally',
            paymentLink: "https://business.mamopay.com/pay/affworldfzllc-b0fe38"
        },
        {
            id: 'partner-exclusive',
            name: 'Exclusive',
            price: '3000',
            originalPrice: '4500',
            discount: '33% OFF',
            popular: false,
            bonus: 'Fee Scholarship After the First Property Sale',
            region: null,
            certification: 'Kings Global Academy (UK) - Real Estate Expert Certified Course',
            internationalTour: 'Fully sponsored international tour: 3 nights/4 days Dubai/Europe/UK',
            awardCeremony: 'Award ceremony with Bollywood celebrity',
            additionalBenefit: 'Job Assurance',
            bestFor: 'Elite partners building large-scale international networks',
            paymentLink: "https://business.mamopay.com/pay/affworldfzllc-3a57e4"
        }
    ];

    // Broker type data
    const brokerData = {
        id: 'brokers',
        title: 'Brokers',
        description: 'For agents and brokers seeking to expand their portfolio with exclusive Dubai properties and maximize their earning potential.',
        icon: Building2,
        features: [
            'Up to 80% commission on property sales',
            '3-level team income structure',
            'Weekly commission payouts after SPA signing',
            'SUBSCRIPTION REFUNDED after your first property sale',
            'Start building global team with just $100',
            'Up to 15% commission on membership package referrals (3 levels)',
            'Full access to OneX CRM and advanced client management tools',
            'Company Branding Kit',
            'Comprehensive Real Estate training through OneX Academy',
            'Certifications from Kings Global Academy (UK) - A globally recognized training organization, offering internationally accredited certifications in real estate professional development',
            'Global team building - Recruit from Canada, UAE, India, Thailand, Philippines & beyond'
        ]
    };

    // Partner type data
    const partnerData = {
        id: 'partners',
        title: 'Partners',
        description: 'For professionals, influencers, networkers, and content creators with engaged audiences interested in the world of real estate.',
        icon: Users,
        features: [
            'Up to 50% commission on property sales',
            'Start building global team with just $100',
            'Weekly Commission Payout',
            'SUBSCRIPTION REFUNDED after your first sale',
            '6-level income structure on team property sales',
            '3-level team income on membership package sales',
            'Up to 15% commission on membership package referrals',
            'Full access to OneX CRM and advanced client management tools',
            'Company Branding Kit',
            'Comprehensive training through OneX Academy (webinars & recorded sessions)',
            'Access to Kings Global Academy (UK) certifications - Internationally recognized professional development programs',
            'Global team building - Recruit from Canada, UAE, India, Thailand, Philippines & beyond'
        ]
    };

    // Bank account details
    const bankDetails = {
        accountName: "ONE X REAL ESTATE LLC",
        accountNumber: "019101816816",
        iban: "AE110330000019101816816",
        bankName: "Mashreq Bank",
        swiftCode: "BOMLAEAD",
        branchCode: "033",
        currency: "AED"
    };

    const handleSelectType = (type) => {
        setSelectedType(type);
        setSelectedPackage(null);
    };

    const handleSelectPlan = (plan) => {
        setSelectedPackage(plan);
        setShowPaymentDetails(true);
    };

    const handleViewDetails = (plan) => {
        setModalPlan(plan);
        setShowDetailsModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setModalPlan(null);
    };

    const handleChooseFromModal = (plan) => {
        handleCloseModal();
        handleSelectPlan(plan);
    };

    const handleBackToPlans = () => {
        setShowPaymentDetails(false);
        setSelectedPackage(null);
    };

    const handleBackToTypes = () => {
        setSelectedType(null);
        setSelectedPackage(null);
        setShowPaymentDetails(false);
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
                                onClick={handleBackToPlans}
                            >
                                ← Back to Plans
                            </button>
                            <h2>Complete Your Payment</h2>
                            <div className={styles.selectedPackage}>
                                <h3>{selectedPackage.name}</h3>
                                <div className={styles.price}>
                                    ${selectedPackage.price}
                                </div>
                                <div className={styles.refund}>
                                    {selectedPackage.bonus}
                                </div>
                            </div>
                        </div>

                        <div className={styles.paymentMethods}>
                            <div className={styles.paymentSection}>
                                <div className={styles.sectionHeader}>
                                    <Banknote className={styles.icon} />
                                    <h3>Bank Transfer</h3>
                                </div>
                                <div className={styles.bankDetails}>
                                    {Object.entries(bankDetails).map(([key, value]) => (
                                        <div key={key} className={styles.bankDetailItem}>
                                            <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
                                            <div className={styles.detailValue}>
                                                <span>{value}</span>
                                                {key !== 'bankName' && key !== 'currency' && (
                                                    <button 
                                                        className={styles.copyButton}
                                                        onClick={() => copyToClipboard(value, key)}
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.paymentInstructions}>
                                    <h4>Payment Instructions:</h4>
                                    <ol>
                                        <li>Transfer {bankDetails.currency} ${selectedPackage.price} to the account details above</li>
                                        <li>Include your user ID (<strong>{data?.current_user_details?.id || currentUser?.id || 'Loading...'}</strong>) in the payment reference</li>
                                        <li>Send payment confirmation to support@company.com</li>
                                        <li>Your subscription will be activated within 24 hours</li>
                                    </ol>
                                </div>
                            </div>

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
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show plans if type is selected
    if (selectedType === 'brokers' || selectedType === 'partners') {
        const plans = selectedType === 'brokers' ? brokerPlans : partnerPlans;
        const typeLabel = selectedType === 'brokers' ? 'Brokers' : 'Partners';
        
        return (
            <div className="sectionContainer">
                <SectionTop heading="Choose Your Plan" />
                <div className="sectionStyles">
                    <div className={styles.packagesContainer}>
                        <div className={styles.packagesHeader}>
                            <h2>Choose Your Plan</h2>
                            <p>All plans include full refund after your first property sale</p>
                        </div>

                        <div className={styles.plansGrid}>
                            {plans.map((plan) => (
                                <div key={plan.id} className={`${styles.planCard} ${plan.popular ? styles.popularPlan : ''}`}>
                                    {plan.discount && (
                                        <div className={styles.discountBadge}>
                                            {plan.discount}
                                        </div>
                                    )}
                                    
                                    {plan.popular && (
                                        <div className={styles.popularBadge}>
                                            Most Popular
                                        </div>
                                    )}
                                    
                                    <h3 className={styles.planName}>{plan.name}</h3>
                                    
                                    <div className={styles.priceSection}>
                                        {plan.originalPrice && (
                                            <div className={styles.originalPrice}>
                                                ${plan.originalPrice}
                                            </div>
                                        )}
                                        <div className={styles.currentPrice}>
                                            ${plan.price}
                                        </div>
                                    </div>
                                    
                                    <div className={styles.bonusBadge}>
                                        {plan.bonus}
                                    </div>
                                    
                                    <div className={styles.cardSummary}>
                                        <p className={styles.summaryText}>
                                            {plan.certification}
                                        </p>
                                    </div>
                                    
                                    <button 
                                        className={styles.viewDetailsButton}
                                        onClick={() => handleViewDetails(plan)}
                                    >
                                        View Full Details
                                    </button>
                                    
                                    <button 
                                        className={styles.chooseButton}
                                        onClick={() => handleSelectPlan(plan)}
                                        style={{ background: colorCode }}
                                    >
                                        Choose {plan.name} <ArrowRight size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Common Features Section */}
                        <div className={styles.commonBenefitsSection}>
                            <h3 className={styles.commonBenefitsTitle}>Additional Benefits for all packages</h3>
                            
                            <div className={styles.commonBenefitsGrid}>
                                <div className={styles.benefitCategory}>
                                    <h4 className={styles.categoryTitle}>Multiple Income Streams & High Commission Payouts:</h4>
                                    <ul className={styles.benefitList}>
                                        {commonIncomeFeatures.map((feature, index) => (
                                            <li key={index} className={styles.benefitItem}>
                                                <CheckCircle size={16} className={styles.checkIcon} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className={styles.benefitCategory}>
                                    <h4 className={styles.categoryTitle}>Advanced Platform Access and Exclusive Member Privileges:</h4>
                                    <ul className={styles.benefitList}>
                                        {commonPlatformFeatures.map((feature, index) => (
                                            <li key={index} className={styles.benefitItem}>
                                                <CheckCircle size={16} className={styles.checkIcon} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Modal */}
                {showDetailsModal && modalPlan && (
                    <div className={styles.modalOverlay} onClick={handleCloseModal}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.modalCloseButton} onClick={handleCloseModal}>
                                <X size={24} />
                            </button>
                            
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>{modalPlan.name} Plan</h2>
                                {modalPlan.discount && (
                                    <div className={styles.modalDiscountBadge}>
                                        {modalPlan.discount}
                                    </div>
                                )}
                                <div className={styles.modalPriceSection}>
                                    {modalPlan.originalPrice && (
                                        <div className={styles.modalOriginalPrice}>
                                            ${modalPlan.originalPrice}
                                        </div>
                                    )}
                                    <div className={styles.modalPrice}>
                                        ${modalPlan.price}
                                    </div>
                                </div>
                                {modalPlan.popular && (
                                    <div className={styles.modalPopularBadge}>Most Popular</div>
                                )}
                            </div>

                            <div className={styles.modalBody}>
                                <div className={styles.modalBonusBadge}>
                                    {modalPlan.bonus}
                                </div>

                                <div className={styles.modalFeaturesSection}>
                                    <h3 className={styles.modalSectionTitle}>Plan Details</h3>
                                    
                                    <div className={styles.modalFeatureRow}>
                                        <div className={styles.modalFeatureLabel}>Certification/Course:</div>
                                        <div className={styles.modalFeatureValue}>{modalPlan.certification}</div>
                                    </div>
                                    
                                    <div className={styles.modalFeatureRow}>
                                        <div className={styles.modalFeatureLabel}>International Tour:</div>
                                        <div className={styles.modalFeatureValue}>
                                            {modalPlan.internationalTour || '-'}
                                        </div>
                                    </div>
                                    
                                    <div className={styles.modalFeatureRow}>
                                        <div className={styles.modalFeatureLabel}>Award Ceremony:</div>
                                        <div className={styles.modalFeatureValue}>
                                            {modalPlan.awardCeremony || '-'}
                                        </div>
                                    </div>
                                    
                                    <div className={styles.modalFeatureRow}>
                                        <div className={styles.modalFeatureLabel}>Fee Scholarship:</div>
                                        <div className={styles.modalFeatureValue}>{modalPlan.bonus}</div>
                                    </div>
                                    
                                    <div className={styles.modalFeatureRow}>
                                        <div className={styles.modalFeatureLabel}>Additional Benefit:</div>
                                        <div className={styles.modalFeatureValue}>{modalPlan.additionalBenefit}</div>
                                    </div>
                                </div>

                                <div className={styles.modalBestFor}>
                                    <strong>Best For:</strong> {modalPlan.bestFor}
                                </div>

                                <div className={styles.modalActions}>
                                    <button 
                                        className={styles.modalChooseButton}
                                        onClick={() => handleChooseFromModal(modalPlan)}
                                        style={{ background: colorCode }}
                                    >
                                        Choose {modalPlan.name} <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Show partnership type selection
    return (
        <div className="sectionContainer">
            <SectionTop heading="Choose Your Partnership Type" />
            <div className="sectionStyles">
                <div className={styles.packagesContainer}>
                    <div className={styles.packagesHeader}>
                        <h2>Choose Your Partnership Type</h2>
                        <p>Select the program that best fits your goals and expertise</p>
                    </div>

                    <div className={styles.partnershipCards}>
                        {/* Brokers Card */}
                        <div 
                            className={`${styles.partnershipCard} ${selectedType === 'brokers' ? styles.selected : ''}`}
                            onClick={() => handleSelectType('brokers')}
                        >
                            <div className={styles.cardIcon}>
                                <brokerData.icon size={36} />
                            </div>
                            
                            <h3 className={styles.cardTitle}>{brokerData.title}</h3>
                            
                            <p className={styles.cardDescription}>{brokerData.description}</p>
                            
                            {selectedType === 'brokers' ? (
                                <div className={styles.selectedBadge}>
                                    <Check size={20} />
                                    Selected
                                </div>
                            ) : (
                                <button 
                                    className={styles.selectButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectType('brokers');
                                    }}
                                >
                                    Select This Option
                                </button>
                            )}
                            
                            <div className={styles.featuresList}>
                                {brokerData.features.map((feature, index) => (
                                    <div key={index} className={styles.featureItem}>
                                        <CheckCircle size={16} className={styles.checkIcon} />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Partners Card */}
                        <div 
                            className={`${styles.partnershipCard} ${selectedType === 'partners' ? styles.selected : ''}`}
                            onClick={() => handleSelectType('partners')}
                        >
                            <div className={styles.cardIcon}>
                                <partnerData.icon size={36} />
                            </div>
                            
                            <h3 className={styles.cardTitle}>{partnerData.title}</h3>
                            
                            <p className={styles.cardDescription}>{partnerData.description}</p>
                            
                            {selectedType === 'partners' ? (
                                <div className={styles.selectedBadge}>
                                    <Check size={20} />
                                    Selected
                                </div>
                            ) : (
                                <button 
                                    className={styles.selectButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectType('partners');
                                    }}
                                >
                                    Select This Option
                                </button>
                            )}
                            
                            <div className={styles.featuresList}>
                                {partnerData.features.map((feature, index) => (
                                    <div key={index} className={styles.featureItem}>
                                        <CheckCircle size={16} className={styles.checkIcon} />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Packages;
