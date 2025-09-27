import { useState } from "react";
import styles from "./Email.module.css";
import { SmtpConfigSelector } from "../../ui/SelectOptionSmtp";
import useSmtp from "../SmtpSetting/useSptm";
import useSendMail from "../Mail/useSendMail";

export const EmailModal = ({ isOpen, setIsopen }) => {
    const [selectedConfig, setSelectedConfig] = useState("");
    const [formData, setFormData] = useState({
        to_email: "",
        subject: "",
        body: "",
        smtp_config_id: selectedConfig,
    });
    const onClose = () => {
        setIsopen(false);
        setFormData({
            to_email: "",
            subject: "",
            body: "",
            smtp_config_id: "",
        });
    };

    const { isLoading, data } = useSmtp();
    const {sendMail}=useSendMail()
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            smtp_config_id: selectedConfig,
        };
        console.log(data);
        
        sendMail(data)

        setSelectedConfig(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2 className={styles.modalTitle}>Compose Email</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="to_email">To:</label>
                        <input
                            type="email"
                            id="to_email"
                            value={formData.to_email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    to_email: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="subject">Subject:</label>
                        <input
                            type="text"
                            id="subject"
                            value={formData.subject}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    subject: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="body">Body:</label>
                        <textarea
                            id="body"
                            value={formData.body}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    body: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="smtp_config">SMTP Configuration:</label>
                        <SmtpConfigSelector
                            value={selectedConfig}
                            onChange={setSelectedConfig}
                            options={data}
                            placeholder="Choose SMTP Server"
                            isLoading={isLoading}
                            displayField={"username"}
                        />
                    </div>
                    <div className={styles.modalActions}>
                        <button type="submit" className={`${styles.submitButton} `}>
                            Send Email
                        </button>
                        <button
                            className={styles.closeButton}
                            onClick={onClose}
                        >
                            Cancle
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
