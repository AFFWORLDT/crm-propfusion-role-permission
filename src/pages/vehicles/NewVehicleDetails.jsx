import styles from "../../styles/ListingItem.module.css";
import { useEffect } from "react";
import toast from "react-hot-toast";
import PageNotFound from "../../pages/PageNotFound";
import { dateToYMD } from "../../utils/utils";
import VehicleTop from "../../features/vehicles/VehicleTop";
import FollowUps from "../../features/followUps/FollowUps";
import Spinner from "../../ui/Spinner";
import SectionTop from "../../ui/SectionTop";
import useVehicle from "../../features/vehicles/useVehicle";
import { useParams, useNavigate } from "react-router-dom";
import useUpdateVehicle from "../../features/vehicles/useUpdateVehicle";
import Button from "../../ui/Button";

function NewVehicleDetails() {
    const { vehicleId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, error } = useVehicle(vehicleId);
    const { editVehicle, isPending } = useUpdateVehicle();

    // Remove the array access since data is a single object
    const vehicle = data;

    // Function to determine status class based on inspection value
    const getStatusClass = (value) => {
        if (!value) return "";
        
        const lowerValue = value.toLowerCase();
        
        if (lowerValue.includes("perfect")) return styles.statusPerfect;
        if (lowerValue.includes("good")) return styles.statusGood;
        if (lowerValue.includes("average") || lowerValue.includes("okay")) return styles.statusAverage;
        if (lowerValue.includes("poor")) return styles.statusPoor;
        if (lowerValue.includes("needs replacement")) return styles.statusNeedsReplacement;
        
        return "";
    };

    // Function to render inspection value with status indicator
    const renderInspectionValue = (value) => {
        if (!value || value === "N/A" || value === "DONT KNOW") return "N/A";
        
        const statusClass = getStatusClass(value);
        
        return (
            <span className={`${styles.inspectionStatus} ${statusClass}`}>
                {value}
            </span>
        );
    };

    function handleChangeAgent(agentType, agentId, onCloseModal) {
        if (!vehicle) return;

        const updatedFields = {
            propertyFinder_agent_Id:
                agentType === "propertyFinder"
                    ? agentId
                    : vehicle.propertyFinder_agent_Id,
            propfusionPortal_agent_Id:
                agentType === "propfusion"
                    ? agentId
                    : vehicle.propfusionPortal_agent_Id,
            ownPortal_agent_Id:
                agentType === "ownPortal"
                    ? agentId
                    : vehicle.ownPortal_agent_Id,
            bayut_dubizzle_agent_Id:
                agentType === "bayutDubizzle"
                    ? agentId
                    : vehicle.bayut_dubizzle_agent_Id,
        };

        editVehicle(
            {
                id: vehicle.id,
                updatedVehicle: { ...vehicle, ...updatedFields },
            },
            {
                onSettled: onCloseModal,
            }
        );
    }

 
    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    if (isLoading) return <Spinner type="fullPage" />;
    if (!data) return <PageNotFound />;

    return (
        <div className="sectionContainer">
            <SectionTop heading="New Vehicle Detail" />

            <section className="sectionStyles">
                <div className={styles.listingItem}>
                    <div>
                        <VehicleTop data={vehicle} />
                      
                    </div>

                    <div className={styles.gridContainer}>
                        <div className={`sectionDiv ${styles.details}`}>
                            <h3>
                                <img src="/icons/grid.svg" alt="" />
                                <span>Vehicle Information</span>
                            </h3>
                            <ul>
                                <li>
                                    <span>Reference Number: </span>
                                    <span>{vehicle?.reference_number || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Brand: </span>
                                    <span>{vehicle?.brand || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Model: </span>
                                    <span>{vehicle?.model || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Year: </span>
                                    <span>{vehicle?.year ? new Date(vehicle.year).getFullYear() : "N/A"}</span>
                                </li>
                                <li>
                                    <span>Body Type: </span>
                                    <span>{vehicle?.body_type || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Color: </span>
                                    <span>{vehicle?.color || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Transmission: </span>
                                    <span>{vehicle?.transmission || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Fuel Type: </span>
                                    <span>{vehicle?.fuel_type || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Drive: </span>
                                    <span>{vehicle?.drive || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Engine Size: </span>
                                    <span>{vehicle?.engine_size_liters || "N/A"}L</span>
                                </li>
                                <li>
                                    <span>Engine Cylinders: </span>
                                    <span>{vehicle?.engine_cylinders || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Odometer: </span>
                                    <span>{vehicle?.odometer_reading_km || "N/A"} km</span>
                                </li>
                                <li>
                                    <span>Paint Type: </span>
                                    <span>{vehicle?.paint_type || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Rim Type: </span>
                                    <span>{vehicle?.rim_type || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Rim Condition: </span>
                                    <span>{renderInspectionValue(vehicle?.rim_condition)}</span>
                                </li>
                                <li>
                                    <span>Seats Color: </span>
                                    <span>{vehicle?.seats_color || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Interior Trim: </span>
                                    <span>{vehicle?.interior_trim || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Navigation System: </span>
                                    <span>{vehicle?.navigation_system ? "Yes" : "No"}</span>
                                </li>
                                <li>
                                    <span>Keys Number: </span>
                                    <span>{vehicle?.keys_number || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Bank Loan: </span>
                                    <span>{vehicle?.bank_loan ? "Yes" : "No"}</span>
                                </li>
                                <li>
                                    <span>Car Registered In: </span>
                                    <span>{vehicle?.car_registered_in || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Roof: </span>
                                    <span>{vehicle?.roof || "N/A"}</span>
                                </li>
                            </ul>
                        </div>
                        <div className={`sectionDiv ${styles.details}`}>
                            <h3>
                                <img src="/icons/grid.svg" alt="" />
                                <span>Inspection Details</span>
                            </h3>
                            <ul>
                                <li>
                                    <span>Inspection Date: </span>
                                    <span>{vehicle?.inspection_date ? dateToYMD(vehicle.inspection_date) : "N/A"}</span>
                                </li>
                                <li>
                                    <span>Accident History: </span>
                                    <span>{vehicle?.accident_history ? "Yes" : "No"}</span>
                                </li>
                                <li>
                                    <span>Chassis Damage: </span>
                                    <span>{vehicle?.chassis_damage ? "Yes" : "No"}</span>
                                </li>
                                <li>
                                    <span>Chassis Repaired: </span>
                                    <span>{vehicle?.chassis_repaired ? "Yes" : "No"}</span>
                                </li>
                                <li>
                                    <span>History Report: </span>
                                    <span>{vehicle?.history_report || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Service History: </span>
                                    <span>{vehicle?.service_history || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Service Type: </span>
                                    <span>{vehicle?.service_type || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Engine Condition: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_inspection?.engine_condition)}</span>
                                </li>
                                <li>
                                    <span>Transmission Condition: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_inspection?.transmission_condition)}</span>
                                </li>
                                <li>
                                    <span>Brake Pads: </span>
                                    <span>{renderInspectionValue(vehicle?.brakes_inspection?.brake_pads)}</span>
                                </li>
                                <li>
                                    <span>Air Condition: </span>
                                    <span>{renderInspectionValue(vehicle?.ac_heating_inspection?.air_condition)}</span>
                                </li>
                                <li>
                                    <span>Heating System: </span>
                                    <span>{renderInspectionValue(vehicle?.ac_heating_inspection?.heating_system)}</span>
                                </li>
                                <li>
                                    <span>Dashboard Condition: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.dashboard_condition)}</span>
                                </li>
                                <li>
                                    <span>Steering Wheel: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.steering_wheel)}</span>
                                </li>
                                <li>
                                    <span>Windshield Glass: </span>
                                    <span>{renderInspectionValue(vehicle?.glasses_inspection?.windshield_glass)}</span>
                                </li>
                                <li>
                                    <span>Rear Window: </span>
                                    <span>{renderInspectionValue(vehicle?.glasses_inspection?.rear_window)}</span>
                                </li>
                                <li>
                                    <span>Sunroof Glass: </span>
                                    <span>{renderInspectionValue(vehicle?.glasses_inspection?.sunroof_glass)}</span>
                                </li>
                                <li>
                                    <span>Car Battery: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.car_battery)}</span>
                                </li>
                                <li>
                                    <span>Head Lights: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.head_lights)}</span>
                                </li>
                                <li>
                                    <span>Rear Lights: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.rear_lights)}</span>
                                </li>
                                <li>
                                    <span>Power Steering: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.power_steering)}</span>
                                </li>
                                <li>
                                    <span>Status: </span>
                                    <span>{vehicle?.status || "N/A"}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={styles.gridContainer}>
                        <div className={`sectionDiv ${styles.description}`}>
                            <h3>
                                <img src="/icons/document.svg" alt="" />
                                <span>Comments</span>
                            </h3>
                            <p>{vehicle?.comments}</p>
                        </div>
                        <div></div>
                    </div>

                    <div className={styles.gridContainer}>
                        <div className={`sectionDiv ${styles.details}`}>
                            <h3>
                                <img src="/icons/car-body.svg" alt="" />
                                <span>Body Inspection</span>
                            </h3>
                            <ul>
                                <li>
                                    <span>Front Bumper: </span>
                                    <span>{renderInspectionValue(vehicle?.body_inspection?.front_bumper)}</span>
                                </li>
                                <li>
                                    <span>Rear Bumper: </span>
                                    <span>{renderInspectionValue(vehicle?.body_inspection?.rear_bumper)}</span>
                                </li>
                                <li>
                                    <span>Bonnet: </span>
                                    <span>{renderInspectionValue(vehicle?.body_inspection?.bonnet)}</span>
                                </li>
                                <li>
                                    <span>Trunk: </span>
                                    <span>{renderInspectionValue(vehicle?.body_inspection?.trunk)}</span>
                                </li>
                                <li>
                                    <span>Roof: </span>
                                    <span>{renderInspectionValue(vehicle?.body_inspection?.roof)}</span>
                                </li>
                                <li>
                                    <span>Front Right Fender: </span>
                                    <span>{renderInspectionValue(vehicle?.body_inspection?.front_right_fender)}</span>
                                </li>
                                <li>
                                    <span>Rear Right Quarter Panel: </span>
                                    <span>{renderInspectionValue(vehicle?.body_inspection?.rear_right_quarter_panel)}</span>
                                </li>
                                <li>
                                    <span>Front Right Door: </span>
                                    <span>{renderInspectionValue(vehicle?.body_inspection?.front_right_door)}</span>
                                </li>
                                <li>
                                    <span>Rear Right Door: </span>
                                    <span>{renderInspectionValue(vehicle?.body_inspection?.rear_right_door)}</span>
                                </li>
                                <li>
                                    <span>Front Left Fender: </span>
                                    <span>{renderInspectionValue(vehicle?.body_inspection?.front_left_fender)}</span>
                                </li>
                                <li>
                                    <span>Rear Left Quarter Panel: </span>
                                    <span>{renderInspectionValue(vehicle?.body_inspection?.rear_left_quarter_panel)}</span>
                                </li>
                                <li>
                                    <span>Front Left Door: </span>
                                    <span>{renderInspectionValue(vehicle?.body_inspection?.front_left_door)}</span>
                                </li>
                                <li>
                                    <span>Rear Left Door: </span>
                                    <span>{renderInspectionValue(vehicle?.body_inspection?.rear_left_door)}</span>
                                </li>
                            </ul>
                        </div>

                        <div className={`sectionDiv ${styles.details}`}>
                            <h3>
                                <img src="/icons/engine.svg" alt="" />
                                <span>Engine Compartment Inspection</span>
                            </h3>
                            <ul>
                                <li>
                                    <span>Tappet Noise: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.tappet_noise)}</span>
                                </li>
                                <li>
                                    <span>Engine Shield Cover: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.engine_shield_cover)}</span>
                                </li>
                                <li>
                                    <span>Coolant Level: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.coolant_level)}</span>
                                </li>
                                <li>
                                    <span>Engine Mounting: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.engine_mounting)}</span>
                                </li>
                                <li>
                                    <span>Bonnet Hinge & Catch: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.bonnet_hinge_catch)}</span>
                                </li>
                                <li>
                                    <span>Drive Belts: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.drive_belts)}</span>
                                </li>
                                <li>
                                    <span>Engine Oil: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.engine_oil)}</span>
                                </li>
                                <li>
                                    <span>Water Pump: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.water_pump)}</span>
                                </li>
                                <li>
                                    <span>Fuse Box: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.fuse_box)}</span>
                                </li>
                                <li>
                                    <span>Belt AC: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.belt_ac)}</span>
                                </li>
                                <li>
                                    <span>AC Fan Motor: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.ac_fan_motor)}</span>
                                </li>
                                <li>
                                    <span>Engine Seals: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.engine_seals)}</span>
                                </li>
                                <li>
                                    <span>Drive Shafts & Assemblies: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.drive_shafts_assemblies)}</span>
                                </li>
                                <li>
                                    <span>Transmission Fluid: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.transmission_fluid)}</span>
                                </li>
                                <li>
                                    <span>Gear Mountings: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.gear_mountings)}</span>
                                </li>
                                <li>
                                    <span>Silencer & Catalyst: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.silencer_catalyst)}</span>
                                </li>
                                <li>
                                    <span>Oxygen Sensor: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.oxygen_sensor)}</span>
                                </li>
                                <li>
                                    <span>Radiator: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.radiator)}</span>
                                </li>
                                <li>
                                    <span>Pipes: </span>
                                    <span>{renderInspectionValue(vehicle?.engine_compartment_inspection?.pipes)}</span>
                                </li>
                            </ul>
                        </div>

                        <div className={`sectionDiv ${styles.details}`}>
                            <h3>
                                <img src="/icons/suspension.svg" alt="" />
                                <span>Suspension & Steering Inspection</span>
                            </h3>
                            <ul>
                                <li>
                                    <span>Steering Rack: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.steering_rack)}</span>
                                </li>
                                <li>
                                    <span>Rack End: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.rack_end)}</span>
                                </li>
                                <li>
                                    <span>Front Differential: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.front_differential)}</span>
                                </li>
                                <li>
                                    <span>Right Springs & Shock Absorbers: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.right_springs_shock_absorbers)}</span>
                                </li>
                                <li>
                                    <span>Right Axle: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.right_axle)}</span>
                                </li>
                                <li>
                                    <span>Right Ball Joint: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.right_ball_joint)}</span>
                                </li>
                                <li>
                                    <span>Power Steering: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.power_steering)}</span>
                                </li>
                                <li>
                                    <span>Power Steering Fluid: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.power_steering_fluid)}</span>
                                </li>
                                <li>
                                    <span>Wheel Hubs & Bearings: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.wheel_hubs_bearings)}</span>
                                </li>
                                <li>
                                    <span>Left Springs & Shock Absorbers: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.left_springs_shock_absorbers)}</span>
                                </li>
                                <li>
                                    <span>Left Axle: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.left_axle)}</span>
                                </li>
                                <li>
                                    <span>Left Ball Joint: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.left_ball_joint)}</span>
                                </li>
                                <li>
                                    <span>Left Dampers & Bushes: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.left_dampers_bushes)}</span>
                                </li>
                                <li>
                                    <span>Right Rear Shock Absorbers: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.right_rear_shock_absorbers)}</span>
                                </li>
                                <li>
                                    <span>Right Rear Bushes: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.right_rear_bushes)}</span>
                                </li>
                                <li>
                                    <span>Left Rear Shock Absorbers: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.left_rear_shock_absorbers)}</span>
                                </li>
                                <li>
                                    <span>Left Rear Bushes: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.left_rear_bushes)}</span>
                                </li>
                                <li>
                                    <span>Steering Box: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.steering_box)}</span>
                                </li>
                                <li>
                                    <span>Right Dampers & Bushes: </span>
                                    <span>{renderInspectionValue(vehicle?.suspension_steering_inspection?.right_dampers_bushes)}</span>
                                </li>
                            </ul>
                        </div>

                        <div className={`sectionDiv ${styles.details}`}>
                            <h3>
                                <img src="/icons/electrical.svg" alt="" />
                                <span>Electrical Controls Inspection</span>
                            </h3>
                            <ul>
                                <li>
                                    <span>Car Battery: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.car_battery)}</span>
                                </li>
                                <li>
                                    <span>Sunroof Operation: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.sunroof_operation)}</span>
                                </li>
                                <li>
                                    <span>Driver Window Operation: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.driver_window_operation)}</span>
                                </li>
                                <li>
                                    <span>Horn Operation: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.horn_operation)}</span>
                                </li>
                                <li>
                                    <span>Air Conditioner: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.air_conditioner)}</span>
                                </li>
                                <li>
                                    <span>Climate Control: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.climate_control)}</span>
                                </li>
                                <li>
                                    <span>Entertainment System: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.entertainment_system)}</span>
                                </li>
                                <li>
                                    <span>Side Mirror Controls: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.side_mirror_controls)}</span>
                                </li>
                                <li>
                                    <span>Head Lights: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.head_lights)}</span>
                                </li>
                                <li>
                                    <span>Rear Lights: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.rear_lights)}</span>
                                </li>
                                <li>
                                    <span>Fog Lights: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.fog_lights)}</span>
                                </li>
                                <li>
                                    <span>Interior Lights: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.interior_lights)}</span>
                                </li>
                                <li>
                                    <span>Indicators & Side Lights: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.indicators_side_lights)}</span>
                                </li>
                                <li>
                                    <span>Key Remote Battery: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.key_remote_battery)}</span>
                                </li>
                                <li>
                                    <span>LCD Display: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.lcd_display)}</span>
                                </li>
                                <li>
                                    <span>Cameras: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.cameras)}</span>
                                </li>
                                <li>
                                    <span>Push Start: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.push_start)}</span>
                                </li>
                                <li>
                                    <span>Instrument Functions: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.instrument_functions)}</span>
                                </li>
                                <li>
                                    <span>Wipers & Washers: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.wipers_washers)}</span>
                                </li>
                                <li>
                                    <span>Door Locking: </span>
                                    <span>{renderInspectionValue(vehicle?.electrical_controls_inspection?.door_locking)}</span>
                                </li>
                            </ul>
                        </div>

                        <div className={`sectionDiv ${styles.details}`}>
                            <h3>
                                <img src="/icons/interior.svg" alt="" />
                                <span>Interiors Inspection</span>
                            </h3>
                            <ul>
                                <li>
                                    <span>Spare Wheel: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.spare_wheel)}</span>
                                </li>
                                <li>
                                    <span>Window Blinds: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.window_blinds)}</span>
                                </li>
                                <li>
                                    <span>Dashboard Condition: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.dashboard_condition)}</span>
                                </li>
                                <li>
                                    <span>Speedometer Cluster: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.speedometer_cluster)}</span>
                                </li>
                                <li>
                                    <span>Steering Wheel: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.steering_wheel)}</span>
                                </li>
                                <li>
                                    <span>Center Console Box: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.center_console_box)}</span>
                                </li>
                                <li>
                                    <span>Visor: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.visor)}</span>
                                </li>
                                <li>
                                    <span>Internal Mirrors: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.internal_mirrors)}</span>
                                </li>
                                <li>
                                    <span>Door Fittings & Operation: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.door_fittings_operation)}</span>
                                </li>
                                <li>
                                    <span>Door Hinges: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.door_hinges)}</span>
                                </li>
                                <li>
                                    <span>Interior Sills & Door Shuts: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.interior_sills_door_shuts)}</span>
                                </li>
                                <li>
                                    <span>Trim Panels: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.trim_panels)}</span>
                                </li>
                                <li>
                                    <span>Carpets: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.carpets)}</span>
                                </li>
                                <li>
                                    <span>Arm Rest: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.arm_rest)}</span>
                                </li>
                                <li>
                                    <span>Seat Leather/Fabric: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.seat_leather_fabric)}</span>
                                </li>
                                <li>
                                    <span>Seat Belts: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.seat_belts)}</span>
                                </li>
                                <li>
                                    <span>Front Right Seat Control: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.front_right_seat_control)}</span>
                                </li>
                                <li>
                                    <span>Front Left Seat Control: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.front_left_seat_control)}</span>
                                </li>
                                <li>
                                    <span>Boot/Trunk Area: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.boot_trunk_area)}</span>
                                </li>
                                <li>
                                    <span>Tools & Safety Kit: </span>
                                    <span>{renderInspectionValue(vehicle?.interiors_inspection?.tools_safety_kit)}</span>
                                </li>
                            </ul>
                        </div>

                        <div className={`sectionDiv ${styles.details}`}>
                            <h3>
                                <img src="/icons/tire.svg" alt="" />
                                <span>Tyres Inspection</span>
                            </h3>
                            <ul>
                                <li>
                                    <span>Front Left Tyre:</span>
                                    <ul className={styles.nestedList}>
                                        <li>
                                            <span>Manufacturer: </span>
                                            <span>{vehicle?.tyres_inspection?.front_left?.manufacturer || "N/A"}</span>
                                        </li>
                                        <li>
                                            <span>Production Date: </span>
                                            <span>{vehicle?.tyres_inspection?.front_left?.production_date || "N/A"}</span>
                                        </li>
                                        <li>
                                            <span>Condition: </span>
                                            <span>{renderInspectionValue(vehicle?.tyres_inspection?.front_left?.condition)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <span>Front Right Tyre:</span>
                                    <ul className={styles.nestedList}>
                                        <li>
                                            <span>Manufacturer: </span>
                                            <span>{vehicle?.tyres_inspection?.front_right?.manufacturer || "N/A"}</span>
                                        </li>
                                        <li>
                                            <span>Production Date: </span>
                                            <span>{vehicle?.tyres_inspection?.front_right?.production_date || "N/A"}</span>
                                        </li>
                                        <li>
                                            <span>Condition: </span>
                                            <span>{renderInspectionValue(vehicle?.tyres_inspection?.front_right?.condition)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <span>Rear Left Tyre:</span>
                                    <ul className={styles.nestedList}>
                                        <li>
                                            <span>Manufacturer: </span>
                                            <span>{vehicle?.tyres_inspection?.rear_left?.manufacturer || "N/A"}</span>
                                        </li>
                                        <li>
                                            <span>Production Date: </span>
                                            <span>{vehicle?.tyres_inspection?.rear_left?.production_date || "N/A"}</span>
                                        </li>
                                        <li>
                                            <span>Condition: </span>
                                            <span>{renderInspectionValue(vehicle?.tyres_inspection?.rear_left?.condition)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <span>Rear Right Tyre:</span>
                                    <ul className={styles.nestedList}>
                                        <li>
                                            <span>Manufacturer: </span>
                                            <span>{vehicle?.tyres_inspection?.rear_right?.manufacturer || "N/A"}</span>
                                        </li>
                                        <li>
                                            <span>Production Date: </span>
                                            <span>{vehicle?.tyres_inspection?.rear_right?.production_date || "N/A"}</span>
                                        </li>
                                        <li>
                                            <span>Condition: </span>
                                            <span>{renderInspectionValue(vehicle?.tyres_inspection?.rear_right?.condition)}</span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        

                    </div>
                    <FollowUps />
                </div>
            </section>
        </div>
    );
}

export default NewVehicleDetails;
