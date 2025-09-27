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
               
                <MultiStepForm.Input
                    registerName="comments"
                    placeholder="Add comments"
                    label="Comments"
                />
               
            </div>
        </div>
    );
}

export default StepPortals;
