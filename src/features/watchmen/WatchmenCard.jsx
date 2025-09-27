import { useState } from 'react';
import useDeleteWatchman from './useDeleteWatchman';
import styles from './WatchmenCard.module.css';
import { Mail, Phone, MapPin, Calendar, User, AlertCircle, CheckCircle2, Shield, Trash2, Loader2, Edit2, XCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../ui/Modal';
import AddWatchmenForm from './AddWatchmenForm';
import useUpdateKycStatus from './useUpdateKycStatus';
import { useNavigate } from 'react-router-dom';

function WatchmenCard({ watchmen }) {
  const { deleteWatchman, isLoading: isDeleting } = useDeleteWatchman();
  const { updateKycStatus, isUpdatingKyc } = useUpdateKycStatus();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();



  if (!watchmen) {
    return (
      <div className={styles.notFound}>
        <AlertCircle size={48} />
        <h3>No Data Found</h3>
      </div>
    );
  }

  const { id, name, email, contact_no, address, status, created_at, kyc_verification } = watchmen;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isPendingVerification = status === 'pending' || status === 'inactive';

  const handleDelete = () => {
  
    try {
      deleteWatchman(id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting watchman:', error);
    }
  };

  const handleKycToggle = async () => {
  
    if (isPendingVerification) {
      toast.error("Cannot modify KYC status while watchman is pending or inactive");
      return;
    }
    try {
      isUpdatingKyc && toast.loading("Updating KYC status...");
      updateKycStatus({ watchmanId: id, kycStatus: !kyc_verification });
    } catch (error) {
      console.error('Error updating KYC status:', error);
    }
  };

  const handleNavigateToDetails = () => {
    navigate(`/new-watchmen/details/${id}`);
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.nameSection}>
            <User size={32} className={styles.icon} />
            <h3 className={styles.name}>{name || 'N/A'}</h3>
          </div>
          <div className={styles.statusSection}>
            <span className={`${styles.status} ${styles[status?.toLowerCase() || 'default']}`}>
              <Shield size={20} />
              {status || 'Unknown'}
            </span>
            {isPendingVerification || isUpdatingKyc ? (
              <div className={styles.kycSwitch}>
                <label className={`${styles.switch} ${isUpdatingKyc ? styles.updating : ''} ${isPendingVerification ? styles.pending : ''}`}>
                  <input
                    type="checkbox"
                    checked={kyc_verification}
                    onChange={handleKycToggle}
                    disabled={isUpdatingKyc }
                  />
                  <span className={styles.slider}>
                    {isUpdatingKyc && (
                      <span className={styles.loadingIndicator}>
                        <Loader2 size={14} />
                      </span>
                    )}
                    {isPendingVerification && (
                      <span className={styles.pendingIndicator}>
                        <XCircle size={14} />
                      </span>
                    )}
                  </span>
                </label>
                <span className={`${styles.kycLabel} ${kyc_verification ? styles.verified : styles.unverified} ${isPendingVerification ? styles.pending : ''}`}>
                  {isPendingVerification
                    ? 'Verification Locked'
                    : kyc_verification
                      ? 'KYC Verified'
                      : 'KYC Pending'
                  }
                </span>
              </div>
            ) : (
              <span className={`${styles.kyc} ${kyc_verification ? styles.verified : styles.unverified} ${isPendingVerification ? styles.pending : ''}`}>
                {isPendingVerification ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
                {isPendingVerification
                  ? 'Verification Locked'
                  : kyc_verification
                    ? 'KYC Verified'
                    : 'KYC Pending'
                }
              </span>
            )}
            <button
              onClick={handleNavigateToDetails}
              className={styles.detailsButton}
              aria-label="View watchman details"
            >
              <Eye size={20} />
            </button>
            { (
              <>
                <Modal>
                  <Modal.Open openWindowName={`edit-watchman-${id}`}>
                    <button
                      className={styles.editButton}
                      aria-label="Edit watchman"
                    >
                      <Edit2 size={20} />
                    </button>
                  </Modal.Open>
                  <Modal.Window name={`edit-watchman-${id}`}>
                    <AddWatchmenForm watchmanToEdit={watchmen} />
                  </Modal.Window>
                </Modal>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className={styles.deleteButton}
                  aria-label="Delete watchman"
                  disabled={isDeleting}
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.info}>
            <p>
              <Mail size={24} className={styles.icon} />
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{email || 'N/A'}</span>
            </p>
            <p>
              <Phone size={24} className={styles.icon} />
              <span className={styles.label}>Phone</span>
              <span className={styles.value}>{contact_no || 'N/A'}</span>
            </p>
            <p>
              <MapPin size={24} className={styles.icon} />
              <span className={styles.label}>Address</span>
              <span className={styles.value}>{address || 'N/A'}</span>
            </p>
            <p>
              <Calendar size={24} className={styles.icon} />
              <span className={styles.label}>Created</span>
              <span className={styles.value}>{formatDate(created_at)}</span>
            </p>
          </div>
        </div>
      </div>

      { showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete {name}?</p>
            <p>This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.cancelButton}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={`${styles.confirmButton} ${isDeleting ? styles.loading : ''}`}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className={styles.spinner} />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WatchmenCard;