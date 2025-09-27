import MultiStepForm from "../../ui/MultiStepForm";
import styles from "../../styles/MultiStepForm.module.css";
import { CAR_CONDITION_OPTIONS } from "../../utils/constants";

const EngineCoreSection = () => (
  <div className={styles.formContainer}>
    <MultiStepForm.InputDataList
      registerName="tappet_noise"
      label="Tappet Noise"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Tappet Noise Condition"
      defaultValue="Perfect"
    />
    <MultiStepForm.InputDataList
      registerName="engine_mounting"
      label="Engine Mounting"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Engine Mounting Condition"
    />
    <MultiStepForm.InputDataList
      registerName="engine_seals"
      label="Engine Seals"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Engine Seals Condition"
      defaultValue="Perfect"
    />
    <MultiStepForm.InputDataList
      registerName="engine_oil"
      label="Engine Oil"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Engine Oil Condition"
    />
  </div>
);

const CoolingSystemSection = () => (
  <div className={styles.formContainer}>
    <MultiStepForm.InputDataList
      registerName="coolant_level"
      label="Coolant Level"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Coolant Level Condition"
      defaultValue="Perfect"
    />
    <MultiStepForm.InputDataList
      registerName="water_pump"
      label="Water Pump"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Water Pump Condition"
      defaultValue="Perfect"
    />
    <MultiStepForm.InputDataList
      registerName="radiator"
      label="Radiator"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Radiator Condition"
      defaultValue="Perfect"
    />
    <MultiStepForm.InputDataList
      registerName="pipes"
      label="Pipes"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Pipes Condition"
      defaultValue="Perfect"
    />
  </div>
);

const BeltsAndDrivetrainSection = () => (
  <div className={styles.formContainer}>
    <MultiStepForm.InputDataList
      registerName="drive_belts"
      label="Drive Belts"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Drive Belts Condition"
      defaultValue="Perfect"
    />
    <MultiStepForm.InputDataList
      registerName="belt_ac"
      label="Belt AC"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Belt AC Condition"
      defaultValue="Perfect"
    />
    <MultiStepForm.InputDataList
      registerName="drive_shafts_assemblies"
      label="Drive Shafts Assemblies"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Drive Shafts Assemblies Condition"
      defaultValue="Perfect"
    />
    <MultiStepForm.InputDataList
      registerName="gear_mountings"
      label="Gear Mountings"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Gear Mountings Condition"
      defaultValue="Perfect"
    />
  </div>
);

const ElectricalSection = () => (
  <div className={styles.formContainer}>
    <MultiStepForm.InputDataList
      registerName="fuse_box"
      label="Fuse Box"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Fuse Box Condition"
    />
    <MultiStepForm.InputDataList
      registerName="ac_fan_motor"
      label="AC Fan Motor"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select AC Fan Motor Condition"
      defaultValue="Perfect"
    />
    <MultiStepForm.InputDataList
      registerName="oxygen_sensor"
      label="Oxygen Sensor"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Oxygen Sensor Condition"
      defaultValue="Perfect"
    />
  </div>
);

const ExteriorSection = () => (
  <div className={styles.formContainer}>
    <MultiStepForm.InputDataList
      registerName="engine_shield_cover"
      label="Engine Shield Cover"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Engine Shield Cover Condition"
      defaultValue="Perfect"
    />
    <MultiStepForm.InputDataList
      registerName="bonnet_hinge_catch"
      label="Bonnet Hinge Catch"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Bonnet Hinge Catch Condition"
      defaultValue="Perfect"
    />
    <MultiStepForm.InputDataList
      registerName="silencer_catalyst"
      label="Silencer Catalyst"
      data={CAR_CONDITION_OPTIONS}
      placeholder="Select Silencer Catalyst Condition"
      defaultValue="Perfect"
    />
  </div>
);

function StepEngineCompartmentInspection() {

  return (
    <>
      <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
        <h3>
          <img src="/icons/star.svg" />
          <span>Engine Core Components</span>
        </h3>
        <EngineCoreSection />
      </div>
      <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
        <h3>
          <img src="/icons/star.svg" />
          <span>Cooling System</span>
        </h3>
        <CoolingSystemSection />
      </div>
      <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
        <h3>
          <img src="/icons/star.svg" />
          <span>Belts and Drivetrain</span>
        </h3>
        <BeltsAndDrivetrainSection />
      </div>
      <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
        <h3>
          <img src="/icons/star.svg" />
          <span>Electrical and Control</span>
        </h3>
        <ElectricalSection />
      </div>
      <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
        <h3>
          <img src="/icons/star.svg" />
          <span>Exterior and Protection</span>
        </h3>
        <ExteriorSection />
      </div>
    </>
  );
}

export default StepEngineCompartmentInspection;
