import styles from "./../../styles/DeleteModal.module.css";
import {
    Trash2,
    AlertTriangle,
    XCircle,
    Loader,
} from "lucide-react";
function DeleteModal({audienceToDelete,handleConfirmDelete,deleteLoading,setShowDeleteModal,setAudienceToDelete}) {
  return (
    <div className={styles.modalOverlay}>
    <div
        className={`${styles.modal} ${styles.deleteModal}`}
    >
        <h2 className={styles.headerWithIcon}>
            <AlertTriangle
                className={`${styles.icon} ${styles.iconMedium} ${styles.iconRed}`}
            />
            Confirm Delete
        </h2>
        <p>
            Are you sure you want to delete the audience
            for {audienceToDelete?.name}?
        </p>
        <p>This action cannot be undone.</p>
        <div className={styles.deleteModalButtons}>
        <button
                onClick={() => {
                    setShowDeleteModal(false);
                    setAudienceToDelete(null);
                }}
                className={` ${styles.CancelButton}`}
                disabled={deleteLoading}
            >
                <XCircle
                    className={`${styles.icon} ${styles.iconSmall}`}
                />
                Cancel
            </button>
            <button
                onClick={handleConfirmDelete}
                className={`${styles.deleteConfirmButton} ${deleteLoading ? styles.loadingState : ""}`}
                disabled={deleteLoading}
            >
                {deleteLoading ? (
                    <>
                        <Loader
                            className={`${styles.icon} ${styles.iconSmall} ${styles.spinnerAnimation}`}
                        />
                        Deleting...
                    </>
                ) : (
                    <>
                        <Trash2
                            className={`${styles.icon} ${styles.iconSmall}`}
                        />
                        Delete
                    </>
                )}
            </button>
           
        </div>
    </div>
</div>
  )
}

export default DeleteModal
