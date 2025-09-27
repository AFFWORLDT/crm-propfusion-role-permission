import toast from "react-hot-toast";
import { fetchBayutWPLeadSync, fetchPropertyFinderWPLeadSync } from "../../services/apiIntegrations";

function SyncLeadButton() {
  const handleSyncLeads = async () => {
    // Use toast.promise to show loader and handle different states
    await toast.promise(
      Promise.all([
        fetchPropertyFinderWPLeadSync(),
        fetchBayutWPLeadSync(),
      ])
        .then(() => {

        }),
      {
        loading: "Syncing leads...",
        success: "Leads synced successfully!",
        error: "Error syncing leads",
      }
    );
  };

  return (
    <div>
      <button onClick={handleSyncLeads} className="btnNormalSmall">
        Sync
      </button>
    </div>
  );
}

export default SyncLeadButton;
