import MultiStepForm from "../../ui/MultiStepForm";
import styles from "../../styles/MultiStepForm.module.css";
import { CAR_CONDITION_OPTIONS } from "../../utils/constants";

function StepEngineInspection() {
  return (
    <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
      <h3>
        <img src="/icons/star.svg" />
        <span>Engine Inspection</span>
      </h3>
      <div className={styles.formContainer}>
        <MultiStepForm.InputToggle
          registerName="engine_start_properly"
          label="Engine Starts Properly"
          
        />
        <MultiStepForm.InputDataList
          registerName="engine_condition"
          label="Engine"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Engine Condition"
        />
        <MultiStepForm.InputDataList
          registerName="engine_group"
          label="Engine Group"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Engine Group"
        />
        <MultiStepForm.InputDataList
          registerName="engine_noise"
          label="Noise"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Engine Noise"
        />
        <MultiStepForm.InputDataList
          registerName="suspension_noise"
          label="Suspension"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Suspension Noise"
        />
        <MultiStepForm.InputDataList
          registerName="engine_exhaust"
          label="Exhaust"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Engine Exhaust"
        />
        <MultiStepForm.InputDataList
          registerName="transmission_condition"
          label="Transmission"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Transmission Condition"
        />
        <MultiStepForm.InputDataList
          registerName="engine_hoses"
          label="Hoses"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Engine Hoses"
        />
        <MultiStepForm.InputDataList
          registerName="supercharger_turbocharger"
          label="Super/Turbo"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Supercharger/Turbocharger"
        />
        <MultiStepForm.InputDataList
          registerName="water_sludge"
          label="Water/Sludge"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Water/Sludge"
        />
        <MultiStepForm.InputDataList
          registerName="automatic_transmission"
          label="Auto Trans"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Automatic Transmission"
        />
        <MultiStepForm.InputDataList
          registerName="transfer_case"
          label="Transfer Case"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Transfer Case"
        />
        <MultiStepForm.InputDataList
          registerName="differential_drive_axle"
          label="Diff/Axle"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Differential/Drive Axle"
        />
        <MultiStepForm.InputDataList
          registerName="engine_visual_inspection"
          label="Visual"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Engine Visual Inspection"
        />
      </div>
    </div>
  )
}

export default StepEngineInspection
