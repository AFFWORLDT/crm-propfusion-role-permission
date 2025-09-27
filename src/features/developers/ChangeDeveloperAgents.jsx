import styles from "../../styles/BtnAdd.module.css";
import ChangeDeveloperAgentForm from "./ChangeDeveloperAgentForm";
import useAllDetails from "../all-details/useAllDetails";
import { useState } from "react";
import modalStyles from "../../styles/Leads.module.css";


function ChangeDeveloperAgents() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { data } = useAllDetails();
    const sidebarColor = data?.company_settings?.sidebar_color_code || "#020079";
    return (
        <>
            < >
            <button
                className={styles.btnAdd}
                style={{ background: sidebarColor, color: "#fff" }}
                onClick={handleOpen}
            >
                <img
                    src="/icons/add.svg"
                    alt="Add"
                    style={{
                        width: 20,
                        height: 20,
                        filter: "brightness(0) invert(1)",
                    }}
                />
                <span>Assign</span>
            </button>
            </>
          

             {open && <div className={modalStyles.modalOverlay}>
                    <div className={modalStyles.modalContent}>
                        <div className={modalStyles.modalHeader}>
                            <h2>Assign Developer Agent</h2>
                            <button className={modalStyles.closeButton} onClick={handleClose}>&times;</button>
                        </div>
                        <div className={modalStyles.modalBody}>
                            <ChangeDeveloperAgentForm onCloseModal={handleClose} />
                        </div>
                    </div>
                </div>}
        </>
    );
}

export default ChangeDeveloperAgents;
