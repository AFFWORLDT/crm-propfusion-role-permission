import { getLocations } from "../../services/apiProperties";
import styles from "../../styles/MultiStepForm.module.css";
import MultiStepForm from "../../ui/MultiStepForm";
import { formatLocationsCommunityOptions } from "../../utils/utils";
import useWatchmenLists from "../watchmen/useGetwatchmenLists";

function StepDescription() {
    const { watchmen, isLoading, error } = useWatchmenLists(true);
    const watchmenList = watchmen.map((watchmen) => ({
        label: watchmen.name,
        value: watchmen.id,
    }));
    return (
        <>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/info.svg" />
                    <span>Project Location</span>
                </h3>
                <MultiStepForm.InputAsyncDataList
                    registerName="location"
                    placeholder="Enter Location"
                    label="Location"
                    asyncFunc={getLocations}
                    formatFunc={formatLocationsCommunityOptions}
                />


            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/info.svg" />
                    <span>Watch Man Info</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputDataList
                        data={watchmenList}
                        registerName="watchman_id"
                        placeholder="Select Watchman"
                        label="Watchman"
                        isLoading={isLoading}
                        error={error}
                        isDisabled={isLoading}
                    />
                 
                </div>
            </div>
        </>
    );
}

export default StepDescription;
