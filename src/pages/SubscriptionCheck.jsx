import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./SubscriptionCheck.module.css";
import Spinner from "../ui/Spinner";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import useAllDetails from "../features/all-details/useAllDetails";

function SubscriptionCheck() {
    const { data: allData, isLoading: allDataLoading, error: allDataError } = useAllDetails()
    const subData = allData?.subscription_status;

    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        if (allDataError) toast.error(allDataError.message);
    }, [allDataError]);

    const clearCacheAndReload = async () => {
        try {
            // Clear localStorage
            localStorage.clear();
            
            // Clear sessionStorage
            sessionStorage.clear();
            
            // Clear cookies (if possible)
            document.cookie.split(";").forEach((c) => {
                const eqPos = c.indexOf("=");
                const name = eqPos > -1 ? c.substr(0, eqPos) : c;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + window.location.hostname;
            });
            
            // Clear cache if service worker is available
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let registration of registrations) {
                    await registration.unregister();
                }
            }
            
            // Clear browser cache (if possible)
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }
            
            toast.success("Cache and cookies cleared successfully!");
            
            // Reload the page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (error) {
            console.error('Error clearing cache:', error);
            toast.error("Error clearing cache, but reloading anyway...");
            window.location.reload();
        }
    };

    if (allDataLoading) return <Spinner type="fullPage" />;

    // Handle server errors separately from subscription expiration
    if (allDataError) {
        return (
            <>
                {createPortal(
                    <div className={styles.modalSubscription}>
                        <div className={styles.modalSubscriptionContainer}>
                            <img src="/images/oops.png" />
                            <p>
                                Looks like there is an issue, please contact admin
                            </p>
                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="btnSubmit"
                                >
                                    Retry
                                </button>
                                <button
                                    onClick={clearCacheAndReload}
                                    className="btnSubmit"
                                    style={{ backgroundColor: '#6c757d', borderColor: '#6c757d' }}
                                >
                                    Clear Cache & Retry
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </>
        );
    }

    // Handle subscription expiration
    if (!subData?.is_active && pathname !== "/admin/general/subscription") {
        return (
            <>
                {createPortal(
                    <div className={styles.modalSubscription}>
                        <div className={styles.modalSubscriptionContainer}>
                            <img src="/images/oops.png" />
                            <p>
                                Your subscription has expired! Renew your subscription to continue 😢
                            </p>
                            <button
                                onClick={() =>
                                    navigate("/admin/general/subscription")
                                }
                                className="btnSubmit"
                            >
                                Renew Subscription
                            </button>
                        </div>
                    </div>,
                    document.body
                )}
            </>
        );
    }

    return <Outlet />;
}

export default SubscriptionCheck;
