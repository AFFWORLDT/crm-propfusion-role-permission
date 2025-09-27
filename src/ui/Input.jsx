import styles from './Input.module.css';

function Input({ type = "text", className = "", ...props }) {
  return (
    <input
      type={type}
      className={`${styles.input} ${className}`}
      {...props}
    />
  );
}

export default Input; 