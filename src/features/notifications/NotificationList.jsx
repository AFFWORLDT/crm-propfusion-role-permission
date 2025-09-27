import { useNavigate } from "react-router-dom";
import { getDaysFromCurrentDate } from "../../utils/utils";
import styles from "./NotificationList.module.css";
import useUpdateNotification from "./useUpdateNotification";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useCallback, useEffect, useRef } from "react";
import Spinner from "../../ui/Spinner";


// Add this debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function NotificationList({ filteredData, onCheck, onUncheck ,  error, 
    isLoading,
    containerRef,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage }) {

    const debouncedFetch = useRef(
        debounce(() => fetchNextPage(), 300)
    ).current;

    const handleScroll = useCallback(() => {
        try {
            if (!containerRef?.current) {
                return;
            }
    
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
            const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
    
            if (scrollPercentage > 70 && hasNextPage && !isFetchingNextPage) {
                fetchNextPage(); // Call directly without debounce
            }
        } catch (error) {
            console.error("Error in scroll handler:", error);
        }
    }, [containerRef, hasNextPage, isFetchingNextPage, fetchNextPage]);
    useEffect(() => {
        const currentRef = containerRef?.current;
        if (!currentRef) return;
    
        currentRef.addEventListener("scroll", handleScroll);
        return () => currentRef.removeEventListener("scroll", handleScroll);
    }, [containerRef, handleScroll]);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    const { changeNotification, isPending } = useUpdateNotification();
    const navigate = useNavigate();
    function handleClick(notificationData) {
        if (!notificationData?.seen) {
            changeNotification({
                id: notificationData?._id,
                payload: { ...notificationData, seen: true },
            });
        }
        navigate(`${notificationData?.link}`);
    }

    function handleCheckbox(event, id) {
        event.target.checked ? onCheck(id) : onUncheck(id);
    }

    function handleEyeClick(notificationData) {
        changeNotification(
            {
                id: notificationData?._id,
                payload: { ...notificationData, seen: !notificationData?.seen },
            },
            {
                onSuccess: () => {
                    toast.success(
                        notificationData?.seen
                            ? "Notification marked as unseen!"
                            : "Notification marked as seen!"
                    );
                },
            }
        );
    }

    if (!filteredData?.length) {
        return (
            <div className={styles.noNotifications}>
                <h1>No Notifications Available</h1>
                <p>Please check back later for updates.</p>
            </div>
        );
    }
    if (isLoading) return <Spinner type="fullPage" />;
    return (
        <ul className={styles.notificationList}>
            {filteredData.map((item) => (
                <li
                    className={`${styles.notificationItem} ${item?.seen ? styles.seen : ""}`}
                    key={item?._id}
                >
                    <input
                        type="checkbox"
                        onChange={(event) => handleCheckbox(event, item?._id)}
                        disabled={isPending}
                    />
                    <div onClick={() => handleClick(item)}>
                        <h3>{item?.subject}</h3>
                        <p>{item?.description}</p>
                    </div>

                    <div>
                        <span>{`${getDaysFromCurrentDate(item?.timestamp)} days ago`}</span>
                        <span>
                            {new Date(item?.timestamp).toLocaleTimeString(
                                undefined,
                                {
                                    timeZone:
                                        Intl.DateTimeFormat().resolvedOptions()
                                            .timeZone,
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                }
                            )}
                        </span>
                    </div>
                    <button
                        onClick={() => handleEyeClick(item)}
                        className={styles.eyeButton}
                        disabled={isPending}
                        aria-label={item?.seen ? "Mark as unseen" : "Mark as seen"}
                    >
                        {item?.seen ? (
                            <FaEyeSlash size={24} color="#6b7280" />
                        ) : (
                            <FaEye size={24} color="#3b82f6" />
                        )}
                    </button>
                </li>
            ))}

{isFetchingNextPage && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    padding: '2rem',
                    backgroundColor: 'transparent' 
                }}>
                    <Spinner />
                </div>
            )}
        </ul>
    );
}

export default NotificationList;
