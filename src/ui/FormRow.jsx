import styles from './FormRow.module.css';

function FormRow({ label, error, children }) {
  return (
    <div className={styles.formRow}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      {children}
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
}

export default FormRow; 