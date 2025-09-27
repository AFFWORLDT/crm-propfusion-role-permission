import Table from "../../ui/Table";
import EditKpi from "./EditKpi";
import styles from "./KpiInTable.module.css";
import { Pencil, Trash2, Plus, Minus } from "lucide-react";
import { useDeleteKpi } from "./useDeleteKpi";
import { useState } from "react";

// TruncatedText component to show truncated text with expand/collapse functionality
function TruncatedText({ text }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text) return null;
  
  const words = text.split(" ");
  const shouldTruncate = words.length > 4;
  
  const truncatedText = shouldTruncate ? 
    words.slice(0, 4).join(" ") + ".." : 
    text;
  
  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className={styles.truncatedTextContainer}>
      {isExpanded ? text : truncatedText}
      {shouldTruncate && (
        <button 
          className={styles.expandButton} 
          onClick={toggleExpand}
          title={isExpanded ? "Show less" : "Show more"}
        >
          {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
        </button>
      )}
    </div>
  );
}

function KpiInTable({ data, onEdit }) {
  const { deleteKpi, isPending } = useDeleteKpi();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [kpiToDelete, setKpiToDelete] = useState(null);
  // If data is a single object, wrap it in an array for Table.Body
  const rows = Array.isArray(data) ? data : [data];
  const columns = "1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr";

  const handleDelete = (id) => {
    setKpiToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (kpiToDelete) {
      deleteKpi(kpiToDelete);
      setShowDeleteModal(false);
      setKpiToDelete(null);
    }
  };

  return (
    <div>
      <Table columns={columns} rowWidth="3600px">
        <Table.Header>
          <div>Agent Name</div>
          <div>Submission Date</div>
          <div>Leads Generated</div>
          <div>Calls Made</div>
          <div>Meetings Scheduled</div>
          <div>Property Viewings</div>
          <div>Offers Made</div>
          <div>Deals Closed</div>
          <div>Client Followups</div>
          <div>Followup Details</div>
          <div>Total Calls</div>
          <div>Connected Calls</div>
          <div>Followups Scheduled</div>
          <div>Meeting With Agents</div>
          <div>Meeting With Management</div>
          <div>Property Hunting</div>
          <div>Sellers Added</div>
          <div>Buyers Added</div>
          <div>Agents Added</div>
          <div>New Listings</div>
          <div>Notes</div>
          <div>Actions</div>
        </Table.Header>
        <Table.Body
          data={rows}
          render={row => (
            <Table.Row key={row.id}>
              <div>{row.agent_name}</div>
              <div>{new Date(row.submission_date).toLocaleDateString()}</div>
              <div>{row.leads_generated}</div>
              <div>{row.calls_made}</div>
              <div>{row.meetings_scheduled}</div>
              <div>{row.property_viewings}</div>
              <div>{row.offers_made}</div>
              <div>{row.deals_closed}</div>
              <div>{row.client_followups}</div>
              <div><TruncatedText text={row.followup_details} /></div>
              <div>{row.total_calls}</div>
              <div>{row.connected_calls}</div>
              <div>{row.followups_scheduled}</div>
              <div>{row.meeting_status?.with_agents ? 'Yes' : 'No'}</div>
              <div>{row.meeting_status?.with_management ? 'Yes' : 'No'}</div>
              <div>{row.meeting_status?.property_hunting ? 'Yes' : 'No'}</div>
              <div>{row.broadcast_metrics?.sellers_added}</div>
              <div>{row.broadcast_metrics?.buyers_added}</div>
              <div>{row.broadcast_metrics?.agents_added}</div>
              <div>{row.new_listings_added}</div>
              <div><TruncatedText text={row.notes} /></div>
              <div className={styles.actions}>
                <EditKpi data={row} >
                <button 
                  className={styles.editButton}
                  onClick={() => onEdit(row)}
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                </EditKpi>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDelete(row.id)}
                  title="Delete"
                  disabled={isPending}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Table.Row>
          )}
        />
      </Table>

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this KPI entry?</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowDeleteModal(false)}
                disabled={isPending}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmDeleteButton}
                onClick={confirmDelete}
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KpiInTable;