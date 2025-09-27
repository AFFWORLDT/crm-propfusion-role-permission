import React from 'react';
import styles from './ConfirmModal.module.css';
import { X } from 'lucide-react';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                </div>
                <div className={styles.modalBody}>
                    <p>{message}</p>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.confirmButton} onClick={onConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal; 