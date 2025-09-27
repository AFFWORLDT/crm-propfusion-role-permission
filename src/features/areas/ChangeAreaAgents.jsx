import  { useState } from "react";
import styles from "../../styles/BtnAdd.module.css";
import modalStyles from "../../styles/Leads.module.css";
import ChangeAreaAgentForm from "../ChangeAreaAgentForm";
import useAllDetails from "../all-details/useAllDetails";

function ChangeAreaAgents() {
    const { data } = useAllDetails();
    const sidebarColor =
        data?.company_settings?.sidebar_color_code || "#020079";
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <button
                className={styles.btnAdd}
                style={{ background: sidebarColor, color: "#fff" }}
                onClick={handleOpen}
            >
                <img
                    src="/icons/add.svg"
                    alt="Add"
                    style={{
                        width: 18,
                        height: 18,
                        filter: "brightness(0) invert(1)",
                    }}
                />
                <span>Assign</span>
            </button>
            {open && (
                <div className={modalStyles.modalOverlay}>
                    <div className={modalStyles.modalContent}>
                        <div className={modalStyles.modalHeader}>
                            <h2>Assign Community Agent</h2>
                            <button className={modalStyles.closeButton} onClick={handleClose}>&times;</button>
                        </div>
                        <div className={modalStyles.modalBody}>
                            <ChangeAreaAgentForm onCloseModal={handleClose} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChangeAreaAgents;
