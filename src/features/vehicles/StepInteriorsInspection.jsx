import styles from "../../styles/MultiStepForm.module.css";
import { CAR_CONDITION_OPTIONS } from "../../utils/constants";
import MultiStepForm from "../../ui/MultiStepForm";

function StepInteriorsInspection() {

    return (
        <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
            <h3>
                <img src="/icons/star.svg" />
                <span>Interiors</span>
            </h3>
            <div className={styles.formContainer}>
                <MultiStepForm.Input
                    registerName="spare_wheel"
                    label="Spare Wheel"
                    placeholder="Select Spare Wheel Condition"
                />
                <MultiStepForm.Input
                    registerName="window_blinds"
                    label="Window Blinds"
                    placeholder="Select Window Blinds Condition"
                />

                <MultiStepForm.InputDataList
                    registerName="dashboard_condition"
                    label="Dashboard Condition"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Dashboard Condition  "
                />
                <MultiStepForm.InputDataList
                    registerName="speedometer_cluster"
                    label="Speedometer Cluster"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Speedometer Cluster Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="steering_wheel"
                    label="Steering Wheel"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Steering Wheel Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="center_console_box"
                    label="Center Console Box"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Center Console Box Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="visor"
                    label="Visor"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Visor Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="internal_mirrors"
                    label="Internal Mirrors"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Internal Mirrors Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="door_fittings_operation"
                    label="Door Fittings Operation"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Door Fittings Operation Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="door_hinges"
                    label="Door Hinges"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Door Hinges Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="interior_sills_door_shuts"
                    label="Interior Sills & Door Shuts"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Interior Sills & Door Shuts Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="trim_panels"
                    label="Trim Panels"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Trim Panels Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="carpets"
                    label="Carpets"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Carpets Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="arm_rest"
                    label="Arm Rest"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Arm Rest Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="seat_leather_fabric"
                    label="Seat Leather/Fabric"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Seat Leather/Fabric Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="seat_belts"
                    label="Seat Belts"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Seat Belts Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="front_right_seat_control"
                    label="Front Right Seat Control"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Front Right Seat Control Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="front_left_seat_control"
                    label="Front Left Seat Control"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Front Left Seat Control Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="boot_trunk_area"
                    label="Boot/Trunk Area"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Boot/Trunk Area Condition"
                />
                <MultiStepForm.InputDataList
                    registerName="tools_safety_kit"
                    label="Tools & Safety Kit"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Tools & Safety Kit Condition"
                />
            </div>
        </div>
    );
}

export default StepInteriorsInspection;
