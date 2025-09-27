import styles from "../../styles/MultiStepForm.module.css";
import { CAR_CONDITION_OPTIONS } from "../../utils/constants";
import MultiStepForm from "../../ui/MultiStepForm";
function StepRoadTestInspection() {
  return (
    <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
      <h3>
        <img src="/icons/star.svg" />
        <span>Road Test Inspection</span>
      </h3>
      <div className={styles.formContainer}>
        <MultiStepForm.InputDataList
          registerName="traction_control"
          label="Traction Control"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Traction Control Condition"
        />
        <MultiStepForm.InputDataList
          registerName="engine_noise"
          label="Engine Noise"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Engine Noise Condition"
        />
        <MultiStepForm.InputDataList
          registerName="engine_performance"
          label="Engine Performance"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Engine Performance Condition"
        />
        <MultiStepForm.InputDataList
          registerName="overheating_evidence"
          label="Overheating Evidence"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Overheating Evidence Condition"
        />
        <MultiStepForm.InputDataList
          registerName="gear_shifting"
          label="Gear Shifting"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Gear Shifting Condition"
        />
        <MultiStepForm.InputDataList
          registerName="cruise_control"
          label="Cruise Control"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Cruise Control Condition"
        />
        <MultiStepForm.InputDataList
          registerName="suspension_noise"
          label="Suspension Noise"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Suspension Noise Condition"
        />
        <MultiStepForm.InputDataList
          registerName="ac_operation"
          label="AC Operation"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select AC Operation Condition"
        />
        <MultiStepForm.InputDataList
          registerName="steering_alignment"
          label="Steering Alignment"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Steering Alignment Condition"
        />
        <MultiStepForm.InputDataList
          registerName="brake_operation"
          label="Brake Operation"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Brake Operation Condition"
        />
      </div>
    </div>
  );
}

export default StepRoadTestInspection;
