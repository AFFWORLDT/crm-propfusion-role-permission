import styles from './modal.module.css';
import PropTypes from 'prop-types'; // To validate the props

function Modal({ isOpen, onClose, children, title = 'Modal Title' }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === styles.modalOverlay) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  title: PropTypes.string,
};

export default Modal;
