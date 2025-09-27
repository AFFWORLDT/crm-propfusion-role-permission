import { useEffect, useState } from "react";
import styles from "./SubscriptionContainer.module.css";
import Spinner from "../../../ui/Spinner";
import toast from "react-hot-toast";
import { dateToYMD } from "../../../utils/utils";
import useAllDetails from "../../all-details/useAllDetails";
import { walletApi } from "../../../services/apiWallet";

function SubscriptionContainer() {
    const [services, setServices] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [offerCodes, setOfferCodes] = useState({});
    const { data: allData, isLoading: allDataLoading, error: allDataError } = useAllDetails()
    const subData = allData?.subscription_status;

    useEffect(() => {
        if (allDataError) return toast.error(allDataError.message);
    }, [allDataError]);

    useEffect(() => {
        const loadServicesAndSubscriptions = async () => {
            setIsLoading(true);
            try {
                const [servicesData, subscriptionsData] = await Promise.all([
                    walletApi.getServices(),
                    walletApi.getSubscriptions("active")
                ]);
                
                // Filter services to only show CRM subscriptions
                const crmServices = servicesData.filter(service => 
                    service.service_type === "crm_subscription"
                );
                
                setServices(crmServices);
                setSubscriptions(subscriptionsData);
            } catch (error) {
                toast.error(error.message || "Failed to load services");
            } finally {
                setIsLoading(false);
            }
        };

        loadServicesAndSubscriptions();
    }, []);

    const subscribe = async (service, method, autoRenew = true) => {
        try {
            const serviceId = service.id ?? service.service_id;
            const offerCodeValue = offerCodes[serviceId]?.trim() || undefined;
            
            if (method === "wallet") {
                await walletApi.subscribeWallet({ 
                    service_id: serviceId, 
                    auto_renew: !!autoRenew,
                    discount_code: offerCodeValue
                });
                toast.success("Subscribed from wallet");
                // Reload subscriptions to update the UI
                const updatedSubscriptions = await walletApi.getSubscriptions("active");
                setSubscriptions(updatedSubscriptions);
            } else {
                const res = await walletApi.subscribeStripe({ 
                    service_id: serviceId, 
                    auto_renew: !!autoRenew,
                    discount_code: offerCodeValue
                });
                if (res?.checkout_url) {
                    window.location.href = res.checkout_url;
                } else {
                    toast.error("No checkout URL returned");
                }
            }
        } catch (e) {
            // Extract error message from API response
            let errorMessage = "Failed to subscribe";
            
            if (e.message) {
                errorMessage = e.message;
            } else if (e.detail) {
                errorMessage = e.detail;
            } else if (e.error) {
                errorMessage = e.error;
            } else if (e.response?.data?.detail) {
                errorMessage = e.response.data.detail;
            } else if (e.response?.data?.message) {
                errorMessage = e.response.data.message;
            }
            
            if (errorMessage.toLowerCase().includes("insufficient")) {
                toast.error("Insufficient wallet balance. Please top up.");
            } else {
                toast.error(errorMessage);
            }
        }
    };

    const hasActiveSubscription = (serviceId) => {
        return subscriptions.some(sub => 
            sub.service_id === serviceId || sub.id === serviceId
        );
    };

    const updateOfferCode = (serviceId, code) => {
        setOfferCodes(prev => ({
            ...prev,
            [serviceId]: code
        }));
    };

    if (allDataLoading || isLoading) return <Spinner type="fullPage" />;

    return (
        <div className={styles.subscriptionContainer}>
            <p>
                <img src="/icons/sparkles.svg" />
                {subData?.is_active ? (
                    <span>
                        Subscription Ending on{" "}
                        {dateToYMD(subData?.subscription_end_date)}
                    </span>
                ) : (
                    <span>Your subscription has expired!</span>
                )}
            </p>

            <div className={styles.subscriptionCards}>
                {services.length > 0 ? (
                    services.map((service) => {
                        const serviceId = service.id ?? service.service_id;
                        const isSubscribed = hasActiveSubscription(serviceId);
                        return (
                            <div key={serviceId} className={styles.subscriptionCard}>
                                <div className={styles.subscriptionCardInner}>
                                    <h3>{service.name}</h3>
                                    <p className={styles.subscriptionPrice}>
                                        <span>{service.price} {service.currency}</span>
                                        <span>/{service.pricing_type}</span>
                                    </p>
                                    {service.description && (
                                        <p style={{ fontSize: '1.4rem', color: '#6b7280', textAlign: 'center' }}>
                                            {service.description}
                                        </p>
                                    )}
                                    
                                    {/* Offer Code Input */}
                                    {!isSubscribed && (
                                        <div style={{ 
                                            margin: '1.2rem 0',
                                            padding: '1rem',
                                            backgroundColor: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '0.6rem',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}>
                                            <label style={{ 
                                                display: 'block', 
                                                fontSize: '1.2rem', 
                                                fontWeight: '600', 
                                                marginBottom: '0.6rem',
                                                color: '#374151'
                                            }}>
                                                🎫 Offer Code (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={offerCodes[serviceId] || ''}
                                                onChange={(e) => updateOfferCode(serviceId, e.target.value.toUpperCase())}
                                                placeholder="e.g., SPEC30"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.6rem 0.8rem',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '0.4rem',
                                                    fontSize: '1.3rem',
                                                    outline: 'none',
                                                    transition: 'border-color 0.2s',
                                                    backgroundColor: offerCodes[serviceId] ? '#f0fdf4' : '#ffffff',
                                                    boxSizing: 'border-box'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                            />
                                            {offerCodes[serviceId] && (
                                                <p style={{ 
                                                    fontSize: '1.1rem', 
                                                    color: '#059669', 
                                                    marginTop: '0.4rem',
                                                    marginBottom: 0,
                                                    fontWeight: '500'
                                                }}>
                                                    ✅ {offerCodes[serviceId]} will be applied
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {isSubscribed ? (
                                        <button className={styles.btnBuySubscription} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                                            Already Subscribed
                                        </button>
                                    ) : (
                                        <div className={styles.subscriptionButtonsContainer}>
                                            <button 
                                                className={styles.btnBuySubscription}
                                                onClick={() => subscribe({ id: serviceId, ...service }, "wallet")}
                                                style={{
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {offerCodes[serviceId] && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '0.2rem',
                                                        right: '0.2rem',
                                                        background: 'rgba(16, 185, 129, 0.9)',
                                                        color: 'white',
                                                        fontSize: '0.8rem',
                                                        padding: '0.1rem 0.3rem',
                                                        borderRadius: '0.3rem',
                                                        fontWeight: '600'
                                                    }}>
                                                        -{offerCodes[serviceId]}
                                                    </div>
                                                )}
                                                Subscribe (Wallet)
                                            </button>
                                            <button 
                                                className={styles.btnBuySubscription}
                                                onClick={() => subscribe({ id: serviceId, ...service }, "stripe")}
                                                style={{
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {offerCodes[serviceId] && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '0.2rem',
                                                        right: '0.2rem',
                                                        background: 'rgba(16, 185, 129, 0.9)',
                                                        color: 'white',
                                                        fontSize: '0.8rem',
                                                        padding: '0.1rem 0.3rem',
                                                        borderRadius: '0.3rem',
                                                        fontWeight: '600'
                                                    }}>
                                                        -{offerCodes[serviceId]}
                                                    </div>
                                                )}
                                                Subscribe (Stripe)
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280', fontSize: '1.6rem' }}>
                        No CRM subscription services available.
                    </div>
                )}
            </div>
        </div>
    );
}

export default SubscriptionContainer;
