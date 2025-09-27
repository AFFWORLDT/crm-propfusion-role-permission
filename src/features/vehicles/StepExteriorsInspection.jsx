import styles from "../../styles/MultiStepForm.module.css";
import { CAR_CONDITION_OPTIONS } from "../../utils/constants";
import MultiStepForm from "../../ui/MultiStepForm";
function StepExteriorsInspection() {
    return (
        <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
            <h3>
                <img src="/icons/star.svg" />
                <span>Exterior Inspection</span>
            </h3>
            <div className={styles.formContainer}>
                <MultiStepForm.InputDataList
                    registerName="bumpers"
                    label="Bumpers"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Bumpers Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="number_plates"
                    label="Number Plates"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Number Plates Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="right_side_mirror"
                    label="Right Side Mirror"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Right Side Mirror Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="left_side_mirror"
                    label="Left Side Mirror"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Left Side Mirror Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="grill"
                    label="Grill"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Grill Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="wheel_caps_alloys"
                    label="Wheel Caps/Alloys"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Wheel Caps/Alloys Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="chassis"
                    label="Chassis"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Chassis Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="fender_shield"
                    label="Fender Shield"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Fender Shield Condition"
                />
            </div>
        </div>
    );
}

export default StepExteriorsInspection;
