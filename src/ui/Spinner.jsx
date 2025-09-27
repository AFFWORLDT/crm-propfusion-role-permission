import styles from "./Spinner.module.css";

function Spinner({ type }) {
    return (
        <div
            className={styles.spinnerContainer}
            style={{ height: type === "fullPage" ? "70svh" : "auto" }}
        >
            <div
                className={styles.spinner}
                style={{ height: type === "fullPage" ? "80px" : "40px" }}
            ></div>
        </div>
    );
}

export default Spinner;
