import styles from "./NotificationFilters.module.css";
import useDeleteNotifications from "./useDeleteNotifications";
import { useSearchParams } from "react-router-dom";

const filterTypes = ["listings", "reminder", "commission", "transaction", "leads"]

function NotificationFilters({
    currentFilter,
    onFilter,
    selectedNotificationIds,
    unseenNotificationCountsByType
}) {
    const { removeNotifications, isPending } = useDeleteNotifications();
    const [searchParams, setSearchParams] = useSearchParams();

    function handleFilter(type) {
        searchParams.set("notification_type", type);
        setSearchParams(searchParams);
        onFilter(type);
    }

    return (
        <div className={styles.notificationFilters}>
            {filterTypes.map((type, i) => (
                <button
                    className={`${styles.btnFilter} ${currentFilter === type ? styles.activeFilterBtn : ""}`}
                    onClick={() => handleFilter(type)}
                    key={i}
                >
                    {type} {unseenNotificationCountsByType[type] > 0 && (
                        <span className={styles.badge}>
                            {unseenNotificationCountsByType[type]}
                        </span>
                    )}
                </button>
            ))}
            {selectedNotificationIds.length > 0 && (
                <button
                    className={styles.btnDeleteNotification}
                    onClick={() => removeNotifications(selectedNotificationIds)}
                    disabled={isPending}
                >
                    <img src="/icons/delete.svg" />
                    <span>Delete</span>
                </button>
            )}
        </div>
    );
}

export default NotificationFilters;
