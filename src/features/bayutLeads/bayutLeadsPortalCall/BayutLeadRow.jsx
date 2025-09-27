import Table from "../../../ui/Table";
import { secondsToHMS } from "../../../utils/utils";
import styles from "../BayutLeadBtns.module.css";
function BayutLeadRow({ bayutLeadData }) {
    function timeStringToSeconds(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return (hours * 3600) + (minutes * 60) + seconds;
    }

    return (
        <Table.Row>
            <span>{bayutLeadData.call_log_id}</span>
            <span>{bayutLeadData.call_status}</span>
            <span>{bayutLeadData.caller_number}</span>
            <span>{bayutLeadData.receiver_number}</span>
            <span>{secondsToHMS(timeStringToSeconds(bayutLeadData.call_total_duration))}</span>
            <audio src={bayutLeadData.call_recordingurl} controls></audio>

            <span>{new Date(bayutLeadData.call_time).toUTCString()}</span>
            <div className={styles.leadBtns}>
                <button>Add SELL Lead</button>
                <button>Add Rent Lead</button>
            </div>

        </Table.Row>
    )
}

export default BayutLeadRow
