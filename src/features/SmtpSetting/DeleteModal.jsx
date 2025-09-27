import { AlertTriangle } from 'lucide-react';
import styles from './DeleteModal.module.css';

export function DeleteModal({ isOpen, onClose, onConfirm, title, message, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <AlertTriangle className={styles.warningIcon} />
          <h2 className={styles.modalTitle}>{title}</h2>
        </div>
        
        <p className={styles.modalMessage}>
          {message || `Are you sure you want to delete this ${title.toLowerCase()}? This action cannot be undone.`}
        </p>

        <div className={styles.modalActions}>
          <button 
            onClick={onClose} 
            className={styles.cancelButton}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className={styles.deleteButton}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}