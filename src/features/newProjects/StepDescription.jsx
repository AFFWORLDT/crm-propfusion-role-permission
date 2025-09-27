import styles from "../../styles/MultiStepForm.module.css";
import MultiStepForm from "../../ui/MultiStepForm";

function StepDescription() {
    return (
        <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
            <div
                style={{ gridTemplateColumns: "1fr" }}
                className={styles.formContainer}
            >
                <MultiStepForm.InputTextArea
                    registerName="description"
                    placeholder="Describe your project"
                    label="Add Description"
                    maxLength={5000}
                />
            </div>
        </div>
    );
}

export default StepDescription;
