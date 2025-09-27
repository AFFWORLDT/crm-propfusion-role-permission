import styles from './../../pages/FusionMails.module.css';
function DeleteModal({ mail, onConfirm, onCancel }) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.deleteModal}>
          <div className={styles.headerWithIcon}>
            <i className={`${styles.icon} ${styles.iconDelete} ${styles.deleteModalIcon}`}></i>
            <h2>Confirm Delete</h2>
          </div>
          <p>Are you sure you want to delete the mail <strong>{mail.subject}</strong>?</p>
          <div className={styles.modalActions}>
            <button onClick={onConfirm} className={styles.deleteConfirmButton}>
              Delete
            </button>
            <button onClick={onCancel} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  export default DeleteModal