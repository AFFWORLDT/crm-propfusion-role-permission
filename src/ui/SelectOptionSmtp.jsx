import styles from './SmtpConfigSelector.module.css';

export const SmtpConfigSelector = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select SMTP Configuration", 
  isLoading, 
  displayField, 
  returnField = "id" // Default return value is `id`
}) => {

  if (isLoading) {
    return (
      <div className={styles.dotsLoader}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    );
  }

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = options.find(option => option[returnField] === selectedValue);
    onChange(returnField === "object" ? selectedOption : selectedValue);
  };

  return (
    <div className={styles.selectWrapper}>
      <select
        value={value || ""}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="">{placeholder}</option>
        {options.map((option,i) => (
          <option key={i} value={option[returnField]}>
            {option[displayField]}
          </option>
        ))}
      </select>
    </div>
  );
};
