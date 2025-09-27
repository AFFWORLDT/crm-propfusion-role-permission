import useInfiniteViewingsLists from "./useGetInfniteViewingsLists";
import styles from "./ViewingList.module.css";
import { format } from "date-fns";
import EditViewingFrom from "./EditViewingFrom";
import { Watch } from "lucide-react";
import AddViewingFrom from "./AddViewingFrom";

function ViewingList({ propertyId }) {
    const { viewings } = useInfiniteViewingsLists(propertyId, true);

    const formatDate = (dateString) => {
        return format(new Date(dateString), "MMM dd, yyyy h:mm a");
    };

    return (
        <div
            className={`${styles.viewingList} sectionDiv`}
            style={{ maxHeight: "800px", overflow: "auto" }}
        >
            <h3>
                <Watch size={24} />
                <span>Viewing</span>
                <AddViewingFrom propertyId={propertyId} />
            </h3>
            {viewings?.map((viewing) => (
                <div key={viewing.id} className={styles.viewingCard}>
                    <div className={styles.viewingInfo}>
                        <div className={styles.viewingDate}>
                            {formatDate(viewing.viewing_date)}
                        </div>
                        <div className={styles.clientInfo}>
                            <div>Client: {viewing.client_name}</div>
                            <div>Email: {viewing.client_email}</div>
                            <div>Phone: {viewing.client_phone}</div>
                            <div>
                                Duration: {viewing.duration_minutes} minutes
                            </div>
                        </div>
                    </div>
                    <div
                        className={
                            styles.viewingStatus +
                            " " +
                            (viewing.status === "completed"
                                ? styles.statusCompleted
                                : styles.statusPending)
                        }
                    >
                        {viewing.status}
                    </div>
                    <div className={styles.actions}>
                        <EditViewingFrom viewingId={viewing.id} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ViewingList;
