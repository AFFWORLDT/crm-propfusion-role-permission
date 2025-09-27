import styles from "../../styles/MultiStepForm.module.css";
import MultiStepForm, { useMultiStepForm } from "../../ui/MultiStepForm";
import { AMENITIES_OPTIONS } from "../../utils/constants";
import AmenitiesList from "../properties/Aminities";

function StepPortals() {
    const {watch ,setValue}=useMultiStepForm()
    const amenitiesOptions = AMENITIES_OPTIONS?.map((item) => {
        return { value: item.code, label: item.label };
    });

    return (
        <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
            <div
                style={{ gridTemplateColumns: "1fr" }}
                className={styles.formContainer}
            >
                <div className={styles.btnsToggleContainer}>
                    <MultiStepForm.InputToggle
                        registerName="propertyBooster"
                        label="Property Booster"
                        imgUrl="/icons/property-booster.png"
                    />
                </div>
                <MultiStepForm.InputDataList
                    registerName="amenities"
                    placeholder="Add Amenities"
                    isMulti={true}
                    label="Amenities"
                    data={amenitiesOptions}
                />
                <AmenitiesList watch={watch} setValue={setValue}/>
            </div>
        </div>
    );
}

export default StepPortals;
