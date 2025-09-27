import { fetchBayutCallLogs, fetchPropertyFinderCallTrackings } from "../../../services/apiIntegrations";

import toast from "react-hot-toast";

function SyncButtonForPFCallTrackingAndBayutCallLogs({ title = "Sync" }) {
    const handleSyncLeads = async () => {
        await toast.promise(
            Promise.all([
                fetchPropertyFinderCallTrackings(),
                fetchBayutCallLogs(),
            ]).then(() => { }),
            {
                loading: "Syncing Call Tracking and Bayut Call Logs...",
                success: "Call Tracking and Bayut Call Logs synced successfully!",
                error: "Could not sync Call Tracking and Bayut Call Logs",
            }
        );
    };
    return (
        <div>
            <button
                onClick={handleSyncLeads}
                className="btnNormalSmall"
                style={{
                    fontSize: "1.5rem",
                    fontFamily: 100,
                }}
            >
                {title}
            </button>
        </div>
    );
}

export default SyncButtonForPFCallTrackingAndBayutCallLogs;
