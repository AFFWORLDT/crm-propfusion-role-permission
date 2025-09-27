import styles from "./Listings.module.css";
import SyncButtonForPFCallTrackingAndBayutCallLogs from "../../leads/portalCalls/SyncButtonForPFCallTrackingAndBayutCallLogs";

function ListPortalCalls() {
    return (
        <>
            <div className={styles.listings}>
                <SyncButtonForPFCallTrackingAndBayutCallLogs
                    title={"Sync Portal Calls"}
                />
            </div>
        </>
    );
}

export default ListPortalCalls;
