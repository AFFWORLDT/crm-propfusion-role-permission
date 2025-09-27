/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import styles from './EditTenantModal.module.css';
import { X, User } from 'lucide-react';
import { useUpdateTenant } from './useUpdate';
import { useCreateTenant } from './useCreate';
import { updateTenantProfile } from '../../services/apiTenants';

function TenantFormModal({ isOpen, onClose, tenant, mode = 'add' }) {
  const { update, isPending: isUpdating } = useUpdateTenant();
  const { create, isPending: isCreating } = useCreateTenant();
  const isPending = mode === 'edit' ? isUpdating : isCreating;
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    tenant_name: '',
    tenant_emirates_id: '',
    license_no: '',
    licensing_authority: '',
    tenant_email: '',
    tenant_phone: '',
    dob: '',
    tenant_type: 'individual',
  });

  useEffect(() => {
    if (tenant && mode === 'edit') {
      // Format the date for display if it exists
      const formattedTenant = {
        ...tenant,
        dob: tenant.dob ? new Date(tenant.dob).toISOString().split('T')[0] : '',
        tenant_type: tenant.tenant_type || 'individual',
      };
      setFormData(formattedTenant);
      if (tenant.profile_pic) {
        setPreviewUrl(tenant.profile_pic)
      }
    } else {
      setFormData({
        tenant_name: '',
        tenant_emirates_id: '',
        license_no: '',
        licensing_authority: '',
        tenant_email: '',
        tenant_phone: '',
        dob: '',
        tenant_type: 'individual',
      });
      setPreviewUrl(null);
    }
  }, [tenant, mode]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== '')
    );

    // Format the date to ISO string if dob exists
    if (filteredData.dob) {
      const date = new Date(filteredData.dob);
      filteredData.dob = date.toISOString();
    }

    if (mode === 'edit') {
      update(
        { id: tenant.id, data: filteredData },
        {
          onSuccess: async () => {
            if (file) {
              try {
                const response = await updateTenantProfile(tenant.id, file);
                if (response && response.profile_pic) {
                  setPreviewUrl(response.profile_pic);
                }
              } catch (error) {
                throw new Error(error.message);
              }
            }
            onClose();
          },
        }
      );
    } else {
      create({ data: filteredData, file: file }, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{mode === 'edit' ? 'Edit Tenant' : 'Add New Tenant'}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.profileImageContainer}>
            <div className={styles.profileImageWrapper}>
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" className={styles.profileImage} />
              ) : (
                <div className={styles.profileImagePlaceholder}>
                  <User size={40} />
                </div>
              )}
              <label className={styles.fileInputLabel}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                <span className={styles.uploadText}>Upload Photo</span>
              </label>
            </div>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Tenant Name</label>
              <input
                type="text"
                name="tenant_name"
                value={formData.tenant_name}
                onChange={handleChange}
                placeholder="Enter tenant name"
                required
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

            <div className={styles.inputDropdown} style={{ height: '100%' }}>
              <label>Tenant Type</label>
              <select
                name="tenant_type"
                value={formData.tenant_type}
                onChange={handleChange}
                required
              >
                <option value="individual">Individual</option>
                <option value="company">Company</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="Enter date of birth"
              />
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={isPending}>
              {isPending
                ? (mode === 'edit' ? 'Updating...' : 'Adding...')
                : (mode === 'edit' ? 'Update Tenant' : 'Add Tenant')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TenantFormModal; 