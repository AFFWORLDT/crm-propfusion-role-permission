import MultiStepForm from "../../ui/MultiStepForm";
import styles from "../../styles/MultiStepForm.module.css";
import { CAR_CONDITION_OPTIONS } from "../../utils/constants";

function StepSuspensionSteeringInspection() {

  return (
    <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
      <h3>
        <img src="/icons/star.svg" />
        <span>Suspension & Steering</span>
      </h3>
      <div className={styles.formContainer}>
        <MultiStepForm.InputDataList
          registerName="steering_rack"
          label="Steering Rack"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Steering Rack Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="rack_end"
          label="Rack End"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Rack End Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="front_differential"
          label="Front Diff"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Front Differential Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="right_springs_shock_absorbers"
          label="Right Springs"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Right Springs & Shock Absorbers Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="right_axle"
          label="Right Axle"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Right Axle Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="right_ball_joint"
          label="Right Ball Joint"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Right Ball Joint Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="power_steering"
          label="Power Steering"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Power Steering Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="power_steering_fluid"
          label="PS Fluid"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Power Steering Fluid Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="wheel_hubs_bearings"
          label="Wheel Hubs"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Wheel Hubs & Bearings Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="left_springs_shock_absorbers"
          label="Left Springs"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Left Springs & Shock Absorbers Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="left_axle"
          label="Left Axle"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Left Axle Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="left_ball_joint"
          label="Left Ball Joint"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Left Ball Joint Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="left_dampers_bushes"
          label="Left Dampers"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Left Dampers & Bushes Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="right_rear_shock_absorbers"
          label="Right Rear Shocks"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Right Rear Shock Absorbers Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="right_rear_bushes"
          label="Right Rear Bushes"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Right Rear Bushes Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="left_rear_shock_absorbers"
          label="Left Rear Shocks"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Left Rear Shock Absorbers Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="left_rear_bushes"
          label="Left Rear Bushes"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Left Rear Bushes Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="steering_box"
          label="Steering Box"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Steering Box Condition"
          defaultValue="Perfect"
        />
        <MultiStepForm.InputDataList
          registerName="right_dampers_bushes"
          label="Right Dampers"
          data={CAR_CONDITION_OPTIONS}
          placeholder="Select Right Dampers & Bushes Condition"
          defaultValue="Perfect"
        />
      </div>
    </div>
  );
}

export default StepSuspensionSteeringInspection;
