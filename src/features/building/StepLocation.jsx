import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/MultiStepForm.module.css";
import MultiStepForm, { useMultiStepForm } from "../../ui/MultiStepForm";
import useStaff from "../admin/staff/useStaff";
import useAreasWithoutCount from "../areas/useAreasWithoutCount";
import useDevelopersWithoutCount from "../developers/useDevelopersWithoutCount";
import AddOwnerButton from "../Owner/AddOwnerButton";
import useInfiniteOwners from "../Owner/useInfiniteOwners";

function StepLocation() {
        const { watch, setValue } = useMultiStepForm();
    const { currentUser } = useAuth();
    const { data: developerData, isLoading: isDeveloperLoading } =
        useDevelopersWithoutCount(true);
    const { data: areaData, isLoading: isAreaLoading } =
        useAreasWithoutCount(true);
    const { data: staffData, isLoading: isStaffLoading } = useStaff();
    const { owners:Owner, isLoading: isOwnerLoading,  } =
    useInfiniteOwners("", true);
    const owner_id = watch("owner_id");
    const developerOptions = developerData.map((item) => {
        return {
            value: item.id, 
            label: item.name,
        };
    });

        useEffect(() => {
            if (owner_id?.value) {
                setValue("landlordName", owner_id.value.owner_name);
                setValue("email", owner_id.value.lessor_email);
                setValue("landlordPhone", owner_id.value.lessor_phone);
                setValue("secondryPhone", owner_id.value.secondryPhone);
                setValue("nationality", owner_id.value.nationality);
                setValue("owner_type", owner_id.value.owner_type);
                setValue("owner_info", owner_id.value.owner_info);
                setValue("lessor_name", owner_id.value.lessor_name);
                setValue("lessor_emirates_id", owner_id.value.lessor_emirates_id);
                setValue("license_no", owner_id.value.license_no);
            }
        }, [owner_id, setValue]);
    
    const areaOptions = areaData.map((item) => {
        return { value: item.id, label: item.name };
    });
    const staffOptions = staffData.map((item) => {
        return { value: item.id, label: item.name };
    });
    const ownerOptions = Owner?.map((item) => {
        return { value: item, label: item?.owner_name };
    });
    return (
        <>
        <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
            <div className={styles.formContainer}>
                <MultiStepForm.Input
                    registerName="building_name"
                    placeholder="Building Name"
                    label="Building Name"
                    required={true}
                />
                <MultiStepForm.InputDataList
                    registerName="area_id"
                    data={areaOptions}
                    isLoading={isAreaLoading}
                    placeholder="Select Area"
                    label="Area"
                />
                <MultiStepForm.InputDataList
                    registerName="developer_id"
                    placeholder="Developer"
                    data={developerOptions}
                    isLoading={isDeveloperLoading}
                    label="Developer"
                />
                
                <MultiStepForm.InputDataList
                    registerName="agent_id"
                    placeholder="Agent"
                    data={staffOptions}
                    isLoading={isStaffLoading}
                    label="Agent"
                />
            </div>
        </div>
        <div>
              <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <div className={styles.ownerInfo}>
                    <h3>
                        <img src="/icons/person.svg" />
                        <span>Owner Info</span>
                    </h3>
                    <div className={styles.ownerInfoHeader}>
                        <MultiStepForm.InputDataList
                            registerName="owner_id"
                            placeholder="Select Owner"
                            data={ownerOptions}
                            isLoading={isOwnerLoading}
                        />
                        <AddOwnerButton />
                    </div>
                </div>
                <div className={styles.formContainer}>
                    <MultiStepForm.Input
                        registerName="landlordName"
                        placeholder="Landlord Name"
                        label="Name"
                        disabled={true}
                    />
                    <MultiStepForm.Input
                        type="email"
                        registerName="email"
                        placeholder="Landlord Email"
                        label="Email"
                        disabled={true}
                    />
                    <div className={styles.splitInput}>
                        <div className={styles.inputContainer}>
                            <label>Phone</label>
                            <MultiStepForm.Input
                                registerName="landlordPhone"
                                placeholder="Phone Number"
                                disabled={true}
                            />
                        </div>
                    </div>

                    <div className={styles.splitInput}>
                        <div className={styles.inputContainer}>
                            <label>Secondary Phone</label>
                            <MultiStepForm.Input
                                registerName="secondryPhone"
                                placeholder="Secondary Phone Number"
                                disabled={true}
                            />
                        </div>
                    </div>

                    <div className={styles.inputContainer}>
                        <label>Nationality</label>
                        <MultiStepForm.Input
                            registerName="nationality"
                            placeholder="Country"
                            disabled={true}
                        />
                    </div>

                    <MultiStepForm.Input
                        registerName="owner_type"
                        placeholder="Owner Type"
                        label="Owner Type"
                        disabled={true}
                    />

                    <MultiStepForm.Input
                        registerName="owner_info"
                        placeholder="Owner Info"
                        label="Owner Info"
                        disabled={true}
                    />
                    <MultiStepForm.Input
                        registerName="lessor_name"
                        placeholder="Lessor Name"
                        label="Lessor Name"
                        disabled={true}
                    />
                    <MultiStepForm.Input
                        registerName="lessor_emirates_id"
                        placeholder="Emirates ID"
                        label="Emirates ID"
                        disabled={true}
                    />
                    <MultiStepForm.Input
                        registerName="license_no"
                        placeholder="License Number"
                        label="License Number"
                        disabled={true}
                    />
                </div>
            </div>
        </div>
        </>
    );
}

export default StepLocation;
