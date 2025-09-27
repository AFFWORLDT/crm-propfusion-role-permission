import {
    fetchBayutLeadSyncer,
    fetchPropertyFinderLeadSyncer,
} from "../../services/apiIntegrations";
import toast from "react-hot-toast";

function SyncButtonForBeyutAndPropertyFinder({ title = "Sync" }) {
    const handleSyncLeads = async () => {
        await toast.promise(
            Promise.all([
                fetchPropertyFinderLeadSyncer(),
                fetchBayutLeadSyncer(),
            ]).then(() => {}),
            {
                loading: "Syncing leads...",
                success: "Leads synced successfully!",
                error: "Error syncing leads",
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

export default SyncButtonForBeyutAndPropertyFinder;
