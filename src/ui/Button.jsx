import styles from './Button.module.css';

function Button({
  children,
  disabled = false,
  type = "button",
  variation = "primary",
  onClick,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${styles.btn} ${styles[variation]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button; 