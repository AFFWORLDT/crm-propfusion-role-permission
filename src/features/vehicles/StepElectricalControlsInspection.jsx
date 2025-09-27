import MultiStepForm from "../../ui/MultiStepForm";
import styles from "../../styles/MultiStepForm.module.css";
import { CAR_CONDITION_OPTIONS } from "../../utils/constants";
function StepElectricalControlsInspection() {
  return (
    <>
      <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
        <h3>
          <img src="/icons/star.svg" />
          <span>Electrical Controls Inspection</span>
        </h3>
        <div className={styles.formContainer}>
          <MultiStepForm.InputDataList
            registerName="car_battery"
            label="Car Battery"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Car Battery Condition"
          />
          <MultiStepForm.InputDataList
            registerName="sunroof_operation"
            label="Sunroof Operation"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Sunroof Operation Condition"
          />
          <MultiStepForm.InputDataList
            registerName="driver_window_operation"
            label="Driver Window Operation"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Driver Window Operation Condition"
          />
          <MultiStepForm.InputDataList
            registerName="horn_operation"
            label="Horn Operation"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Horn Operation Condition"
          />
          <MultiStepForm.InputDataList
            registerName="air_conditioner"
            label="Air Conditioner"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Air Conditioner Condition"
          />
          <MultiStepForm.InputDataList
            registerName="climate_control"
            label="Climate Control"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Climate Control Condition"
          />
          <MultiStepForm.InputDataList
            registerName="entertainment_system"
            label="Entertainment System"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Entertainment System Condition"
          />
          <MultiStepForm.InputDataList
            registerName="side_mirror_controls"
            label="Side Mirror Controls"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Side Mirror Controls Condition"
          />
          <MultiStepForm.InputDataList
            registerName="head_lights"
            label="Head Lights"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Head Lights Condition"
          />
          <MultiStepForm.InputDataList
            registerName="rear_lights"
            label="Rear Lights"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Rear Lights Condition"
          />
          <MultiStepForm.InputDataList
            registerName="fog_lights"
            label="Fog Lights"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Fog Lights Condition"
          />
          <MultiStepForm.InputDataList
            registerName="interior_lights"
            label="Interior Lights"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Interior Lights Condition"
          />
          <MultiStepForm.InputDataList
            registerName="indicators_side_lights"
            label="Indicators & Side Lights"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Indicators & Side Lights Condition"
          />
          <MultiStepForm.InputDataList
            registerName="key_remote_battery"
            label="Key Remote Battery"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Key Remote Battery Condition"
          />
          <MultiStepForm.InputDataList
            registerName="lcd_display"
            label="LCD Display"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select LCD Display Condition"
          />
          <MultiStepForm.InputDataList
            registerName="cameras"
            label="Cameras"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Cameras Condition"
          />
          <MultiStepForm.InputDataList
            registerName="push_start"
            label="Push Start"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Push Start Condition"
          />
          <MultiStepForm.InputDataList
            registerName="instrument_functions"
            label="Instrument Functions"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Instrument Functions Condition"
          />
          <MultiStepForm.InputDataList
            registerName="wipers_washers"
            label="Wipers & Washers"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Wipers & Washers Condition"
          />
          <MultiStepForm.InputDataList
            registerName="door_locking"
            label="Door Locking"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Door Locking Condition"
          />
          <MultiStepForm.InputDataList
            registerName="switches_controls"
            label="Switches & Controls"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Switches & Controls Condition"
          />
          <MultiStepForm.InputDataList
            registerName="steering_wheel_switches"
            label="Steering Wheel Switches"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Steering Wheel Switches Condition"
          />
          <MultiStepForm.InputDataList
            registerName="hazard_lights_button"
            label="Hazard Lights Button"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Hazard Lights Button Condition"
          />
          <MultiStepForm.InputDataList
            registerName="starting_system_ignition_lock"
            label="Starting System & Ignition Lock"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Starting System & Ignition Lock Condition"
          />
          <MultiStepForm.InputDataList
            registerName="sunroof_switch_board"
            label="Sunroof Switch Board"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Sunroof Switch Board Condition"
          />
          <MultiStepForm.InputDataList
            registerName="rear_power_window_switch"
            label="Rear Power Window Switch"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Rear Power Window Switch Condition"
          />
          <MultiStepForm.InputDataList
            registerName="front_power_window_switch"
            label="Front Power Window Switch"
            data={CAR_CONDITION_OPTIONS}
            placeholder="Select Front Power Window Switch Condition"
          />
        </div>
      </div>
    </>
  );
}

export default StepElectricalControlsInspection
