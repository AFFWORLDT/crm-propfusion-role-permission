import { useState } from 'react';
import Table from "../../../ui/Table";
import styles from "../BayutLeadBtns.module.css";
import modelStyles from "../BayutModel.module.css";

function BayutLeadLeadsRow({ bayutLeadData }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState("");

    const fullMessage = bayutLeadData?.message;

    // Maximum characters to show in the table
    const maxLength = 20;

    const shortenedMessage = fullMessage && fullMessage.length > maxLength
        ? `${fullMessage.substring(0, maxLength)}...`
        : fullMessage;

    const handleOpenModal = () => {
        setSelectedMessage(fullMessage);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMessage("");
    };

    return (
        <>
            <Table.Row>
                <span>{bayutLeadData?.property_id || "NA"}</span>
                <span>{bayutLeadData?.current_type || "NA"}</span>
                <span>{bayutLeadData?.client_name || "NA"}</span>
                <span>{bayutLeadData?.client_phone || "NA"}</span>
                <span>{bayutLeadData?.client_email || "NA"}</span>
                <span>{bayutLeadData?.property_reference || "NA"}</span>

                <span>{new Date(bayutLeadData?.date_time).toUTCString()}</span>
                <span onClick={handleOpenModal} className={styles.clickableMessage} style={{
                    cursor: "pointer",
                }}>{shortenedMessage}</span>

                <div className={styles.leadBtns}>
                    <button>Add SELL Lead</button>
                    <button>Add Rent Lead</button>
                </div>
            </Table.Row>

            {isModalOpen && (
                <div className={modelStyles.modalOverlay}>
                    <div className={modelStyles.modalContent}>
                        <div>
                            <h2>Description</h2>
                            <button className={modelStyles.closeButton} onClick={handleCloseModal}>X</button>

                        </div> <br />
                        <p>{selectedMessage}</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default BayutLeadLeadsRow;
