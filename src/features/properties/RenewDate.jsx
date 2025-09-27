import { useState } from "react";
import styles from "./RenewDate.module.css";
import { X } from "lucide-react";

function RenewDate({ onCloseModal, data, onSubmit }) {
    const [dates, setDates] = useState({
        pf_auto_disable_time: data?.pf_auto_disable_time || "",
        bayut_auto_disable_time: data?.bayut_auto_disable_time || "",
        dubizzle_auto_disable_time: data?.dubizzle_auto_disable_time || ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(dates);
        onCloseModal?.();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDates(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearDate = (name) => {
        setDates(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    return (
        <div className={styles.renewDateContainer}>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>Property Finder Auto-Disable Date:</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="datetime-local"
                            name="pf_auto_disable_time"
                            value={dates.pf_auto_disable_time}
                            onChange={handleChange}
                        />
                        {dates.pf_auto_disable_time && (
                            <X 
                                className={styles.clearIcon}
                                size={30}
                                onClick={() => clearDate("pf_auto_disable_time")}
                            />
                        )}
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>Bayut Auto-Disable Date:</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="datetime-local"
                            name="bayut_auto_disable_time"
                            value={dates.bayut_auto_disable_time}
                            onChange={handleChange}
                        />
                        {dates.bayut_auto_disable_time && (
                            <X 
                                className={styles.clearIcon}
                                size={30}
                                onClick={() => clearDate("bayut_auto_disable_time")}
                            />
                        )}
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>Dubizzle Auto-Disable Date:</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="datetime-local"
                            name="dubizzle_auto_disable_time"
                            value={dates.dubizzle_auto_disable_time}
                            onChange={handleChange}
                        />
                        {dates.dubizzle_auto_disable_time && (
                            <X 
                                className={styles.clearIcon}
                                size={30}
                                onClick={() => clearDate("dubizzle_auto_disable_time")}
                            />
                        )}
                    </div>
                </div>
                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.submitButton}>
                        Update Dates
                    </button>
                    <button type="button" onClick={onCloseModal} className={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RenewDate; 