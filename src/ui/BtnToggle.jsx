import styles from "./BtnToggle.module.css";

function BtnToggle({ isActive, onToggle, isDisabled = false }) {
    return (
        <button
            type="button"
            className={`${styles.btnToggle} ${isActive ? styles.activeToggle : ""}`}
            onClick={onToggle}
            disabled={isDisabled}
        >
            <span></span>
        </button>
    );
}

export default BtnToggle;
