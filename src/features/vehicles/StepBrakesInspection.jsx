import MultiStepForm from "../../ui/MultiStepForm";
import styles from "../../styles/MultiStepForm.module.css";
import { CAR_CONDITION_OPTIONS } from "../../utils/constants";

function StepBrakesInspection() {

    return (
        <>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Brakes Inspection</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputDataList
                        registerName="brake_pads"
                        label="Brake Pads"
                        data={CAR_CONDITION_OPTIONS}
                        placeholder="Select Brake Pads Condition"
                    />
                    <MultiStepForm.InputDataList
                        registerName="parking_brake"
                        label="Parking Brake"
                        data={CAR_CONDITION_OPTIONS}
                        placeholder="Select Parking Brake Condition"
                    />
                    <MultiStepForm.InputDataList
                        registerName="abs_warning_signal"
                        label="ABS Warning Signal"
                        data={CAR_CONDITION_OPTIONS}
                        placeholder="Select ABS Warning Signal Condition"
                    />
                </div>
            </div>
        </>
    );
}

export default StepBrakesInspection;
