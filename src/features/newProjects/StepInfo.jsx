import styles from "../../styles/MultiStepForm.module.css";
import MultiStepForm from "../../ui/MultiStepForm";
import { BEDROOM_NUM_OPTIONS, PROPERTY_TYPES } from "../../utils/constants";

function StepInfo() {
    return (
        <>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/info.svg" />
                    <span>Project Information</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputDataList
                        registerName="propertyTypes"
                        data={PROPERTY_TYPES}
                        placeholder="Property Type"
                        isMulti={true}
                        required={true}
                        label="Property Type"
                    />

                    <div className={styles.splitInput}>
                        <MultiStepForm.Input
                            registerName="size_min"
                            placeholder="Min (in sqft)"
                            type="number"
                            valueAsNumber={true}
                            label="Size"
                        />
                        <span>-</span>
                        <MultiStepForm.Input
                            registerName="size_max"
                            type="number"
                            valueAsNumber={true}
                            placeholder="Max (in sqft)"
                        />
                    </div>

                    <div className={styles.splitInput}>
                        <MultiStepForm.InputSelect
                            registerName="bedroomMin"
                            valueAsNumber={true}
                            options={[
                                { label: "Min", value: "" },
                                ...BEDROOM_NUM_OPTIONS.slice(1),
                            ]}
                            label="Bedrooms"
                        />
                        <span>-</span>
                        <MultiStepForm.InputSelect
                            registerName="bedroomMax"
                            valueAsNumber={true}
                            options={[
                                { label: "Max", value: "" },
                                ...BEDROOM_NUM_OPTIONS.slice(1),
                            ]}
                        />
                    </div>

                    <MultiStepForm.Input
                        registerName="totalUnits"
                        placeholder="Total Units"
                        type="number"
                        valueAsNumber={true}
                        label="Total Units"
                    />

                    <MultiStepForm.Input
                        registerName="totalFloor"
                        placeholder="Total Floors"
                        type="number"
                        valueAsNumber={true}
                        label="Total Floors"
                    />

                    <MultiStepForm.InputDatePicker
                        registerName="handoverTime"
                        placeholder="Select Date"
                        label="Handover"
                    />
                    <MultiStepForm.InputDatePicker
                        registerName="saleStartDate"
                        placeholder="Select Date"
                        label="Sale Start Date"
                    />

                    <MultiStepForm.Input
                        registerName="numberOfBuilding"
                        placeholder="Number of Building"
                        type="number"
                        valueAsNumber={true}
                        label="Number of Building"
                    />

                    <MultiStepForm.Input
                        registerName="governmentFees"
                        placeholder="Government Fees (in AED)"
                        type="number"
                        valueAsNumber={true}
                        label="Government Fees"
                    />
                      <MultiStepForm.Input
                        registerName="furnishing"
                        placeholder="Furnishing Status"
                        type="text"
                        label="Furnishing"
                    />
                    <MultiStepForm.Input
                        registerName="type_of_ownership"
                        placeholder="Type of Ownership"
                        type="text"
                        label="Type of Ownership"
                    />
                    <MultiStepForm.Input
                        registerName="resale_allowed_after"
                        placeholder="Resale Allowed After "
                        type="number"
                        valueAsNumber={true}
                        label="Resale Allowed After"
                    />
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/wallet.svg" />
                    <span>Pricing</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.Input
                        registerName="price"
                        placeholder="Starting Price (in AED)"
                        type="number"
                        valueAsNumber={true}
                        label="Price"
                    />
                    <MultiStepForm.Input
                        registerName="propertyFee"
                        placeholder="Service Charge (in AED)"
                        type="number"
                        valueAsNumber={true}
                        label="Service Charge"
                    />
                  
                    <MultiStepForm.InputToggle
                        registerName="postHandover"
                        label="Post Handover"
                        valueToEnable={false}
                    />

                </div>
            </div>
        </>
    );
}

export default StepInfo;
