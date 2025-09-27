import { Eye } from "lucide-react";
import styles from "./lastFollowUp.module.css";

export default function LeadTableCell({ item }) {
    return (
        <td className={styles.td}>
       <p className={styles.button}>{item.text} </p>

            <div className={styles.tooltip}>
                <img
                    src={item.agent_avatar}
                    alt="Agent"
                    className={styles.avatar}
                />{" "}
                <br />
                {/* <strong>Agent Name:</strong> {item.agent_name} <br /> */}
                 {item.text} <br />
                {/* <strong>Created At:</strong> {item.created_at} <br /> */}
                {/* <strong>Stage:</strong> {item.stages} <br /> */}
                {/* <strong>Rating:</strong> <span className={styles.rating}>{item.rating}</span> <br />
        <strong>Status:</strong> {item.status} <br />
        <strong>Next Follow Up:</strong> {item.nextfollowupdate} */}
            </div>
        </td>
    );
}
