import styles from "../../styles/MultiStepForm.module.css";
import { CAR_CONDITION_OPTIONS } from "../../utils/constants";
import MultiStepForm from "../../ui/MultiStepForm";

function StepTyresInspection() {

    return (
        <>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Front Left Tyre</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.Input
                        registerName="front_left_tyre_manufacturer"
                        label="Manufacturer"
                        placeholder="Enter Manufacturer"
                    />
                    <MultiStepForm.Input
                        registerName="front_left_tyre_production_date"
                        label="Production Date"
                        placeholder="Select Production Date  dd/mm/yyyy"
                        
                    />

                    <MultiStepForm.InputDataList
                        registerName="front_left_tyre_condition"
                        label="Front Left Tyre Condition "
                        placeholder="Select Front Left Tyre Condition"
                        data={CAR_CONDITION_OPTIONS}
                    />
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Front Right Tyre</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.Input
                        registerName="front_right_tyre_manufacturer"
                        label="Manufacturer"
                        placeholder="Enter Manufacturer"
                    />
                    <MultiStepForm.Input
                        registerName="front_right_tyre_production_date"
                        label="Production Date"
                        placeholder="Select Production Date  dd/mm/yyyy"
                    />

                    <MultiStepForm.InputDataList
                        registerName="front_right_tyre_condition"
                        label="Front Right Tyre Condition "
                        placeholder="Select Front Right Tyre Condition"
                        data={CAR_CONDITION_OPTIONS}
                    />
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Rear Left Tyre</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.Input
                        registerName="rear_left_tyre_manufacturer"
                        label="Manufacturer"
                        placeholder="Enter Manufacturer"
                    />
                    <MultiStepForm.Input
                        registerName="rear_left_tyre_production_date"
                        label="Production Date"
                        placeholder="Select Production Date  dd/mm/yyyy"
                    />

                    <MultiStepForm.InputDataList
                        registerName="rear_left_tyre_condition"
                        label="Rear Left Tyre Condition "
                        placeholder="Select Rear Left Tyre Condition"
                        data={CAR_CONDITION_OPTIONS}
                    />
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Rear Right Tyre</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.Input
                        registerName="rear_right_tyre_manufacturer"
                        label="Manufacturer"
                        placeholder="Enter Manufacturer"
                    />
                    <MultiStepForm.Input
                        registerName="rear_right_tyre_production_date"
                        label="Production Date"
                        placeholder="Select Production Date  dd/mm/yyyy"
                    />

                    <MultiStepForm.InputDataList
                        registerName="rear_right_tyre_condition"
                        label="Rear Right Tyre Condition "
                        placeholder="Select Rear Right Tyre Condition"
                        data={CAR_CONDITION_OPTIONS}
                    />
                </div>
            </div>
        </>
    );
}

export default StepTyresInspection;
