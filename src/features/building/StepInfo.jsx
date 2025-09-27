    import styles from "../../styles/MultiStepForm.module.css";
import MultiStepForm from "../../ui/MultiStepForm";

function StepInfo() {
    return (
        <>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/info.svg" />
                    <span>Project Information</span>
                </h3>
                <div className={styles.formContainer}>
                    {/* <MultiStepForm.InputSelect
                        registerName="units_type"
                        options={PROPERTY_TYPES}
                        placeholder="Units Type"
                        required={true}
                        label="Units Type"
                    /> */}

                    <div className={styles.splitInput}>
                        <MultiStepForm.Input
                            registerName="makani_no"
                            placeholder="makani no"
                            label="Makani No"
                        />
                    </div>

                    <MultiStepForm.Input
                        registerName="plot_no"
                        placeholder="plot no"
                        label="Plot No"
                    />
                    <MultiStepForm.Input
                        registerName="dm_no"
                        placeholder="DM No"
                        label="DM No"
                    />
                    <MultiStepForm.Input
                        registerName="building_no"
                        placeholder="building no"
                        label="Building No"
                    />
                    <MultiStepForm.Input
                        registerName="total_units_counts"
                        placeholder="total units counts"
                        type="number"
                        valueAsNumber={true}
                        label="Total Units Count"
                    />
                    <MultiStepForm.Input
                        registerName="main_dewa_no"
                    placeholder="Main Premise No."
                        label="Main Premise No."
                    />
                    <MultiStepForm.Input
                        registerName="no_of_leasing_years"
                        placeholder="no of leasing years"
                        type="number"
                        valueAsNumber={true}
                        label="No of leasing years"
                    />
                </div>
            </div>
        </>
    );
}

export default StepInfo;
