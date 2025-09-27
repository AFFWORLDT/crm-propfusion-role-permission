import { useState, useEffect } from 'react';
import styles from './EditTenantModal.module.css';
import { X } from 'lucide-react';
import { useUpdateTenant } from './useUpdate';

function EditTenantModal({ isOpen, onClose, tenant }) {
  const { update, isPending } = useUpdateTenant();
  const [formData, setFormData] = useState({
    tenant_name: '',
    tenant_emirates_id: '',
    license_no: '',
    licensing_authority: '',
    tenant_email: '',
    tenant_phone: '',
  });

  useEffect(() => {
    if (tenant) {
      setFormData(tenant);
    }
  }, [tenant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    update(
      { id: tenant.id, data: formData },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Edit Tenant</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Tenant Name</label>
              <input
                type="text"
                name="tenant_name"
                value={formData.tenant_name}
                onChange={handleChange}
                placeholder="Enter tenant name"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Emirates ID</label>
              <input
                type="text"
                name="tenant_emirates_id"
                value={formData.tenant_emirates_id}
                onChange={handleChange}
                placeholder="Enter Emirates ID"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>License Number</label>
              <input
                type="text"
                name="license_no"
                value={formData.license_no}
                onChange={handleChange}
                placeholder="Enter license number"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Licensing Authority</label>
              <input
                type="text"
                name="licensing_authority"
                value={formData.licensing_authority}
                onChange={handleChange}
                placeholder="Enter licensing authority"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                name="tenant_email"
                value={formData.tenant_email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                name="tenant_phone"
                value={formData.tenant_phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={isPending}>
              {isPending ? 'Updating...' : 'Update Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTenantModal; 