import MultiStepForm from "../../ui/MultiStepForm";
import styles from "../../styles/MultiStepForm.module.css";
import {  PAINT_TYPES } from "../../utils/constants";
function StepBodyInspection() {
    return (
        <>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Body Inspection</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputDataList
                        registerName="front_bumper"
                        label="Front Bumper"
                        data={PAINT_TYPES}
                        placeholder="Select Front Bumper"
                    />
                    <MultiStepForm.InputDataList
                        registerName="rear_bumper"
                        label="Rear Bumper"
                        data={PAINT_TYPES}
                        placeholder="Select Rear Bumper"
                    />
                    <MultiStepForm.InputDataList
                        registerName="bonnet"
                        label="Bonnet"
                        data={PAINT_TYPES}
                        placeholder="Select Bonnet"
                    />
                    <MultiStepForm.InputDataList
                        registerName="trunk"
                        label="Trunk"
                        data={PAINT_TYPES}
                        placeholder="Select Trunk"
                    />
                  
                    <MultiStepForm.InputDataList
                        registerName="front_right_fender"
                        label="Front Right Fender"
                        data={PAINT_TYPES}
                        placeholder="Select Front Right Fender"
                    />
                    <MultiStepForm.InputDataList
                        registerName="rear_right_quarter_panel"
                        label="Rear Right Quarter Panel"
                        data={PAINT_TYPES}
                        placeholder="Select Rear Right Quarter Panel"
                    />
                    <MultiStepForm.InputDataList
                        registerName="front_right_door"
                        label="Front Right Door"
                        data={PAINT_TYPES}
                        placeholder="Select Front Right Door"
                    />
                    <MultiStepForm.InputDataList
                        registerName="rear_right_door"
                        label="Rear Right Door"
                        data={PAINT_TYPES}
                        placeholder="Select Rear Right Door"
                    />
                    <MultiStepForm.InputDataList
                        registerName="front_left_fender"
                        label="Front Left Fender"
                        data={PAINT_TYPES}
                        placeholder="Select Front Left Fender"
                    />
                    <MultiStepForm.InputDataList
                        registerName="rear_left_quarter_panel"
                        label="Rear Left Quarter Panel"
                        data={PAINT_TYPES}
                        placeholder="Select Rear Left Quarter Panel"
                    />{" "}
                    <MultiStepForm.InputDataList
                        registerName="front_left_door"
                        label="Front Left Door"
                        data={PAINT_TYPES}
                        placeholder="Select Front Left Door"
                    />{" "}
                    <MultiStepForm.InputDataList
                        registerName="rear_left_door"
                        label="Rear Left Door"
                        data={PAINT_TYPES}
                        placeholder="Select Rear Left Door"
                    />
                </div>
            </div>

            {/* <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Additional Components</span>
                </h3>
                <div className={styles.formContainer}>

                    <MultiStepForm.InputDataList
                        registerName="front_right_wheel"
                        label="Front Right Wheel"
                        data={CAR_CONDITION_OPTIONS}
                        placeholder="Select Front Right Wheel"
                    />
                    <MultiStepForm.InputDataList
                        registerName="front_left_wheel"
                        label="Front Left Wheel"
                        data={CAR_CONDITION_OPTIONS}
                        placeholder="Select Front Left Wheel"
                    />
                    <MultiStepForm.InputDataList
                        registerName="rear_right_wheel"
                        label="Rear Right Wheel"
                        data={CAR_CONDITION_OPTIONS}
                        placeholder="Select Rear Right Wheel"
                    />
                    <MultiStepForm.InputDataList
                        registerName="rear_left_wheel"
                        label="Rear Left Wheel"
                        data={CAR_CONDITION_OPTIONS}
                        placeholder="Select Rear Left Wheel"
                    />
                    <MultiStepForm.InputDataList
                        registerName="ac_condition"
                        label="A/C Condition"
                        data={CAR_CONDITION_OPTIONS}
                        placeholder="Select A/C Condition"
                    />
                </div>
            </div> */}
        </>
    );
}

export default StepBodyInspection;
