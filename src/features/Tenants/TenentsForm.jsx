import styles from './../../pages/Tenents/TenantForm.module.css';

function TenentsForm({formData, handleSubmit, handleChange, isPending, isEditing}) {
  return (
    <section className={styles.sectionStyles}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Tenant Name */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Tenant Name</label>
              <input
                type="text"
                name="tenant_name"
                value={formData.tenant_name}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter tenant name"
              />
            </div>

            {/* Emirates ID */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Emirates ID</label>
              <input
                type="text"
                name="tenant_emirates_id"
                value={formData.tenant_emirates_id}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter Emirates ID"
              />
            </div>

            {/* License Number */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>License Number</label>
              <input
                type="text"
                name="license_no"
                value={formData.license_no}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter license number"
              />
            </div>

            {/* Licensing Authority */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Licensing Authority</label>
              <input
                type="text"
                name="licensing_authority"
                value={formData.licensing_authority}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter licensing authority"
              />
            </div>

            {/* Email */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="tenant_email"
                value={formData.tenant_email}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter email address"
              />
            </div>

            {/* Phone */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="tenant_phone"
                value={formData.tenant_phone}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton} disabled={isPending}>
              {isEditing ? 'Update Tenant' : 'Add Tenant'}
            </button>
          </div>
        </form>
      </section>
  )
}

export default TenentsForm
