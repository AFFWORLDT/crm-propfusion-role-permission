import Table from "../../../ui/Table"
import styles from "../BayutLeadBtns.module.css";

function BayutWhatsLeadsRow({ beyutLeadWhatsappData }) {
  return (
    <Table.Row>
      <span>{new Date(beyutLeadWhatsappData?.date_time).toUTCString()}</span>
      <span>{beyutLeadWhatsappData?.listing_id || "NA"}</span>
      <span>{beyutLeadWhatsappData?.listing_reference || "NA"}</span>
      <span>{beyutLeadWhatsappData?.detail?.actor_name || "NA"}</span>
      <span>{beyutLeadWhatsappData?.detail?.cell || "NA"}</span>
      <span>{beyutLeadWhatsappData?.detail?.message || "NA"}</span>
      <div className={styles.leadBtns}>
        <button>Add SELL Lead</button>
        <button>Add Rent Lead</button>
      </div>
    </Table.Row>

  )
}

export default BayutWhatsLeadsRow
