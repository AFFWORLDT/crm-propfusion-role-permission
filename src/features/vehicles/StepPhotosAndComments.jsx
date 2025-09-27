import styles from "../../styles/MultiStepForm.module.css";
import DisplayImagesOnAdd from "../../ui/DisplayImagesOnAdd";
import MultiStepForm from "../../ui/MultiStepForm";
function StepPhotosAndComments() {
    return (
        <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
            <div
                style={{ gridTemplateColumns: "1fr" }}
                className={styles.formContainer}
            >
                <div>
                    <MultiStepForm.InputFileV2
                        registerName="photos"
                        label="Images"
                        accept="image/*"
                        multiple={true}
                        folderName="vehicles"
                    />

                    <DisplayImagesOnAdd
                        imagesData={[]}
                        iconAction="/icons/delete.svg"
                    />
                    <MultiStepForm.InputTextArea
                        registerName="comments"
                        placeholder="Enter comments"
                        required={true}
                        label="Comments"
                        maxLength={5000}
                    />
                </div>
            </div>
        </div>
    );
}

export default StepPhotosAndComments;
