import MultiStepForm, { useMultiStepForm } from "../../ui/MultiStepForm";
import styles from "../../styles/MultiStepForm.module.css";
import {
    BODY_TYPES,
    CAR_CONDITION_OPTIONS,
    DRIVE_TYPE_OPTIONS,
    FUEL_TYPE_OPTIONS,
    PAINT_TYPES,
    PRICE_TYPE_OPTIONS,
    TRANSMISSION_OPTIONS,
} from "../../utils/constants";
import useInfiniteManufacturers from "../manufacturer/useInfiniteManufacturers";
function StepBasicInfo({ listingType }) {
    const { manufacturers } = useInfiniteManufacturers({},false);
    const manufacturersOptions = manufacturers?.map((manufacturer) => ({
        label: manufacturer?.name,
        value: manufacturer?.id,
    }));
    return (
        <>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Basic Info</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputDataList
                        registerName="manufacturer_id"
                        label="Brand"
                        data={manufacturersOptions}
                        placeholder="Select Brand"
                        required={true}
                    />
                    <MultiStepForm.InputText
                        registerName="model"
                        label="Model"
                        placeholder="Enter Model"
                        required={true}
                    />
                    <MultiStepForm.InputText
                        registerName="price"
                        label="Price"
                        placeholder="Enter Price"
                        required={true}
                    />
                    {listingType === "RENT" && (
                        <MultiStepForm.InputSelect
                            registerName="priceType"
                            options={PRICE_TYPE_OPTIONS}
                            label="Price Type"
                            required={true}
                        />
                    )}
                    <MultiStepForm.InputDatePicker
                        registerName="year"
                        label="Year"
                        isYearPicker={true}
                        placeholder="Select Year"
                    />
                    <MultiStepForm.InputText
                        registerName="car_registered_in"
                        label="Car Registered In"
                        placeholder="Enter Car Registered In"
                    />
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Engine & Performance</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputText
                        registerName="engine_cylinders"
                        label="Engine Cylinders"
                        placeholder="Enter Engine Cylinders"
                    />
                    <MultiStepForm.InputText
                        registerName="engine_size_liters"
                        label="Engine Size (Liters)"
                        placeholder="Enter Engine Size"
                    />
                    <MultiStepForm.InputDataList
                        registerName="transmission"
                        label="Transmission"
                        data={TRANSMISSION_OPTIONS}
                        placeholder="Select Transmission"
                        required={true}
                    />
                    <MultiStepForm.InputDataList
                        registerName="drive"
                        label="Drive Type"
                        data={DRIVE_TYPE_OPTIONS}
                        placeholder="Select Drive Type"
                        required={true}
                    />
                    <MultiStepForm.InputDataList
                        registerName="fuel_type"
                        label="Fuel Type"
                        data={FUEL_TYPE_OPTIONS}
                        placeholder="Select Fuel Type"
                        required={true}
                    />
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Vehicle Details</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputDataList
                        registerName="body_type"
                        label="Body Type"
                        data={BODY_TYPES}
                        placeholder="Select Body Type"
                        required={true}
                    />
                    <MultiStepForm.InputText
                        registerName="odometer_reading_km"
                        label="Odometer Reading (km)"
                        placeholder="Enter Odometer Reading"
                        required={true}
                    />
                    <MultiStepForm.InputText
                        registerName="specs"
                        label="Specs"
                        placeholder="Enter Specs"
                    />
                    <MultiStepForm.InputDataList
                        registerName="paint_type"
                        label="Paint Type"
                        data={PAINT_TYPES}
                        placeholder="Select Paint Type"
                    />
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Interior & Exterior</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputText
                        registerName="interior_trim"
                        label="Interior Trim"
                        placeholder="Enter Interior Trim"
                    />
                    <MultiStepForm.InputText
                        registerName="seats_color"
                        label="Seats Color"
                        placeholder="Enter Seats Color"
                    />
                    <MultiStepForm.InputText
                        registerName="color"
                        label="Seats Material"
                        placeholder="Enter Seats Material"
                    />
                    <MultiStepForm.InputText
                        registerName="roof"
                        label="Roof"
                        placeholder="Enter Roof"
                    />
                    <MultiStepForm.InputText
                        registerName="rim_type"
                        label="Rim Type"
                        placeholder="Enter Rim Type"
                    />
                    <MultiStepForm.InputDataList
                        registerName="rim_condition"
                        label="Rim Condition"
                        data={CAR_CONDITION_OPTIONS}
                        placeholder="Select Rim Condition"
                    />
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>History & Maintenance</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputDatePicker
                        registerName="inspection_date"
                        label="Inspection Date"
                        placeholder="Select Date"
                    />
                    <MultiStepForm.InputText
                        registerName="history_report"
                        label="Accident History"
                        placeholder="Enter Accident History"
                    />
                    <MultiStepForm.InputText
                        registerName="service_history"
                        label="Service History"
                        placeholder="Enter Service History"
                    />
                    <MultiStepForm.InputText
                        registerName="service_type"
                        label="Service Type"
                        placeholder="Enter Service Type"
                    />
                    <MultiStepForm.InputText
                        registerName="keys_number"
                        label="Keys Number"
                        placeholder="Enter Keys Number"
                    />
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Vehicle History & Features</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputToggle
                        registerName="accident_history"
                        label="Accident History"
                        valueToEnable={false}
                    />
                    <MultiStepForm.InputToggle
                        registerName="chassis_damage"
                        label="Chassis Damage"
                        valueToEnable={false}
                    />
                    <MultiStepForm.InputToggle
                        registerName="chassis_repaired"
                        label="Chassis Repaired"
                        valueToEnable={false}
                    />
                    <MultiStepForm.InputToggle
                        registerName="bank_loan"
                        label="Bank Loan"
                        valueToEnable={false}
                    />
                    <MultiStepForm.InputToggle
                        registerName="navigation_system"
                        label="Navigation System"
                        valueToEnable={false}
                    />
                </div>
            </div>
        </>
    );
}

export default StepBasicInfo;
