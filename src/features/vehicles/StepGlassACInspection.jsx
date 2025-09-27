import MultiStepForm from "../../ui/MultiStepForm";
import styles from "../../styles/MultiStepForm.module.css";
import { CAR_CONDITION_OPTIONS } from "../../utils/constants";

function StepGlassACInspection() {

  return (
    <>
      <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
        <h3>
          <img src="/icons/star.svg" />
          <span>Glass Inspection</span>
        </h3>
        <div className={styles.formContainer}>
          <MultiStepForm.InputDataList
            registerName="rear_window"
            label="Rear Window"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Rear Window Condition"
            defaultValue="Perfect"
          />
          <MultiStepForm.InputDataList
            registerName="windshield_glass"
            label="Windshield Glass"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Windshield Glass Condition"
            defaultValue="Perfect"
          />
          <MultiStepForm.InputDataList
            registerName="sunroof_glass"
            label="Sunroof Glass"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Sunroof Glass Condition"
            defaultValue="Perfect"
          />
        </div>
      </div>

      <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
        <h3>
          <img src="/icons/star.svg" />
          <span>A/C Inspection</span>
        </h3>
        <div className={styles.formContainer}>
          <MultiStepForm.InputDataList
            registerName="air_condition"
            label="A/C"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select A/C Condition"

          />
          <MultiStepForm.InputDataList
            registerName="heating_system"
            label="Heating System"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Heating System Condition"
          />

        </div>
      </div>
    </>
  );
}

export default StepGlassACInspection;
