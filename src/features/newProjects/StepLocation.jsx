import { useAuth } from "../../context/AuthContext";
import { getLocations } from "../../services/apiProperties";
import styles from "../../styles/MultiStepForm.module.css";
import MultiStepForm from "../../ui/MultiStepForm";
import { formatLocationsCommunityOptions, formateDevelopersOptions } from "../../utils/utils";
import useStaff from "../admin/staff/useStaff";
import useAreasWithoutCount from "../areas/useAreasWithoutCount";
import { useEffect, useState } from "react";
import { getFeatures } from "../../services/apiSidebar";
import Spinner from "../../ui/Spinner";
import { getDevelopersFlters } from "../../services/apiDevelopers";

function StepLocation() {
    const { data: staffData, isLoading: isStaffLoading } = useStaff();
   
    const staffOptions = staffData.map((item) => {
        return { value: item.id, label: item.name };
    });

    const [features, setFeatures] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function loadFeatures() {
            try {
                const featuresData = await getFeatures();
                setFeatures(featuresData);
            } catch (error) {
                console.error("Failed t o load features:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadFeatures();
    }, []);
    if (isLoading) {
        return <Spinner type={"fullPage"} />;
    }

    return (
        <>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <div className={styles.formContainer}>
                    <MultiStepForm.Input
                        registerName="name"
                        placeholder="Project Name"
                        label="Project Name"
                        required={true}
                    />
                   
                    {features?.developer_mode === false && (
                        <MultiStepForm.InputAsyncDataList
                            registerName="developerId"
                            placeholder="Developer"
                            asyncFunc={(search) => getDevelopersFlters(search)}
                            formatFunc={formateDevelopersOptions}
                            label="Developer"
                            required={true}
                        />
                    )}
                    <MultiStepForm.InputDataList
                        registerName="agent_Id"
                        placeholder="Agent"
                        data={staffOptions}
                        isLoading={isStaffLoading}
                        label="Agent"
                    />
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                {/* <div className={styles.formContainer}>
                    <MultiStepForm.InputAsyncDataList
                        registerName="location.city"
                        placeholder="City"
                        label="City"
                        asyncFunc={(search) =>
                            getLocationWihLocationType(search, "city")
                        }
                        formatFunc={formatLocationOptionsForCity}
                    />
                    <MultiStepForm.InputAsyncDataList
                        registerName="location.community"
                        placeholder="Community"
                        label="Community"
                        asyncFunc={(search) =>
                            getLocationWihLocationType(search, "community")
                        }
                        formatFunc={formatLocationOptionsForCommunity}
                        isDisabled={true}
                    />
                    <MultiStepForm.InputAsyncDataList
                        registerName="location.sub_community"
                        placeholder="Sub Community"
                        label="Sub Community"
                        asyncFunc={(search) =>
                            getLocationWihLocationType(search, "sub_community")
                        }
                        formatFunc={formatLocationOptionsForSubCommunity}
                    />
                    <MultiStepForm.InputAsyncDataList
                        registerName="location.property_name"
                        placeholder="Property Name"
                        label="Property Name"
                        asyncFunc={(search) =>
                            getLocationWihLocationType(search, "property")
                        }
                        formatFunc={formatLocationOptionsForProperty}
                    />
                </div> */}
                <div className={styles.formContainer}>
                    <MultiStepForm.InputAsyncDataList
                        registerName="location"
                        placeholder="Enter Location"
                        label="Location"
                        asyncFunc={getLocations}
                        formatFunc={formatLocationsCommunityOptions}
                    />
                </div>
            </div>
        </>
    );
}

export default StepLocation;
