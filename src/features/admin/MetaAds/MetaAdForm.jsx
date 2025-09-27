import MultiStepForm, { useMultiStepForm } from "../../../ui/MultiStepForm";
import styles from "../../../styles/MultiStepForm.module.css";
import {
    LEAD_TYPE_OPTIONS,
    NUM_OPTIONS,
    PAYMENT_OPTIONS,
    PRICE_TYPE_OPTIONS,
    PROJECT_OPTIONS,
    PROPERTY_TYPES,
    SOURCE_OPTIONS,
} from "../../../utils/constants";
import useStaff from "../staff/useStaff";
import { getLocations } from "../../../services/apiProperties";
import { formatLocationsForMetaAds } from "../../../utils/utils";

import useGetConnectedPages from "./useGetConnectedPages";
import useGetPageFormsById from "./useGetPageFormsById";
import { useEffect, useState     } from "react";
import FormInputPropertySearch from "../../../ui/FormInputPropertySearch";
import FormInputProjectSearch from "../../../ui/FormInputProjectSearch";
import FormInputDeveloperSearch from "../../../ui/FormInputDeveloperSearch";
function MetaAdForm({ metaDataType }) {
    const { data: staffData, isLoading: isStaffLoading } = useStaff();

    const { data: connectedPages, isLoading: isConnectedPagesLoading } =
        useGetConnectedPages();
    const { watch, setValue, control } = useMultiStepForm();
    const [showPopover, setShowPopover] = useState(false);
    const [activePopover, setActivePopover] = useState(null);
    const pageId = watch("page_id");
    const { data: pageForms, isLoading: isPageFormsLoading } =
        useGetPageFormsById(pageId?.value);
    const connectedPagesOptions = connectedPages?.map((item) => {
        return { value: item?.page_id, label: item?.page_name };
    });
    const staffOptions = staffData?.map((item) => {
        return { value: item.id, label: item.name };
    });
 

    const clientType = watch("clientType" || metaDataType);
   
    const handleShowPopover = (type) => {
        setActivePopover(type);
        setShowPopover(true);
    }

    const handleHidePopover = () => {
        setShowPopover(false);
        setActivePopover(null);
    }


    useEffect(() => {
        // Get the parent form's handleSubmit function
        const formElement = document.querySelector("form");
        if (!formElement) return;

        const originalSubmit = formElement.onsubmit;

        formElement.onsubmit = (e) => {
            // Convert multi-select fields to arrays of IDs
            const preferredProperty = watch("preferred_property");
            const preferredDeveloper = watch("preferred_developer");
            const preferredProject = watch("preferred_project");
            const areaId = watch("area_id");
            const propertyType = watch("property_type");

            if (preferredProperty?.length) {
                // Map the array of objects to just the value property
                const ids = preferredProperty
                    .filter((item) => item && item.value)
                    .map((item) => ({
                        value: parseInt(item.value),
                        label: item.label,
                    }));
                setValue("preferred_property", ids.length > 0 ? ids : []);
            } else {
                setValue("preferred_property", []);
            }

            if (preferredDeveloper?.length) {
                const ids = preferredDeveloper
                    .filter((item) => item && item.value)
                    .map((item) => ({
                        value: parseInt(item.value),
                        label: item.label
                    }));
                setValue("preferred_developer", ids.length > 0 ? ids : []);
            } else {
                setValue("preferred_developer", []);
            }

            if (preferredProject?.length) {
                const ids = preferredProject
                    .filter((item) => item && item.value)
                    .map((item) => ({
                        value: parseInt(item.value),
                        label: item.label
                    }));
                setValue("preferred_project", ids.length > 0 ? ids : []);
            } else {
                setValue("preferred_project", []);
            }

            if (areaId?.length) {
                const ids = areaId
                    .filter((item) => item && item.value)
                    .map((item) => parseInt(item.value));
                setValue("area_id", ids.length > 0 ? ids : []);
            } else {
                setValue("area_id", []);
            }

            if (propertyType?.length) {
                const values = propertyType
                    .filter((item) => item && item.value)
                    .map((item) => ({
                        value: item.value,
                        label: item.label,
                    }));
                setValue("property_type", values.length > 0 ? values : []);
            } else {
                setValue("property_type", []);
            }

            // Call the original submit handler
            return originalSubmit?.(e);
        };

        return () => {
            // Cleanup
            if (formElement) {
                formElement.onsubmit = originalSubmit;
            }
        };
    }, [watch, setValue]);
    return (
        <>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/detail.svg" alt="Form Details icon" />
                    <span>Form Details</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.Input
                        registerName="form_name"
                        placeholder="Name of the form"
                        required={true}
                        label="Name of the form"
                    />
                    <MultiStepForm.InputDataList
                        registerName="page_id"
                        data={connectedPagesOptions}
                        isLoading={isConnectedPagesLoading}
                        placeholder="Select Page"
                        label="Page"
                    />
                    {pageId && (
                        <MultiStepForm.InputDataList
                            registerName="form_id"
                            placeholder="Select Form"
                            required={true}
                            label="Form"
                            data={pageForms?.map((item) => {
                                return {
                                    value: item?.id,
                                    label: item?.name,
                                };
                            })}
                            isLoading={isPageFormsLoading}
                        />
                    )}
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" alt="Type icon" />
                    <span>Type</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputSelect
                        registerName="clientType"
                        options={LEAD_TYPE_OPTIONS}
                        label="Client Type"
                    />

                    <MultiStepForm.InputDataList
                        registerName="agent_Id"
                        data={staffOptions}
                        isLoading={isStaffLoading}
                        placeholder="Select Agent"
                        label="Agent"
                    />

<MultiStepForm.InputSelect
                        registerName="clientSource"
                        options={SOURCE_OPTIONS}
                        label="Source "
                    />
                    <MultiStepForm.Input
                        registerName="clientSubSource"
                        placeholder="Sub Source"
                        label="Client Sub Source"
                    />

                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/location.svg" alt="Location icon" />
                    <span>Location</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputAsyncDataList
                        registerName="location"
                        placeholder="Search location..."
                        label="Location"
                        asyncFunc={getLocations}
                        formatFunc={formatLocationsForMetaAds}
                        className="location-input"
                    />
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/detail.svg" alt="Detail icon" />
                    <span>Detail</span>
                </h3>
                <div className={styles.formContainer}>
                    {clientType === "SELL" && (
                        <MultiStepForm.InputSelect
                            registerName="projectType"
                            options={PROJECT_OPTIONS}
                            label="Project Type"
                        />
                    )}
                  

                    <div className={styles.splitInput}>
                        <MultiStepForm.InputSelect
                            registerName="from_bathroom"
                            valueAsNumber={true}
                            options={[
                                { label: "From", value: "" },
                                ...NUM_OPTIONS.slice(1),
                            ]}
                            label=" Bathrooms"
                        />
                        <span>-</span>
                        <MultiStepForm.InputSelect
                            registerName="to_bathroom"
                            valueAsNumber={true}
                            options={[
                                { label: "To", value: "" },
                                ...NUM_OPTIONS.slice(1),
                            ]}
                        />
                    </div>

                    <div className={styles.splitInput}>
                        <MultiStepForm.InputSelect
                            registerName="roomsFrom"
                            valueAsNumber={true}
                            options={[
                                { label: "From", value: "" },
                                ...NUM_OPTIONS.slice(1),
                            ]}
                            label="Rooms"
                        />
                        <span>-</span>
                        <MultiStepForm.InputSelect
                            registerName="roomsTo"
                            valueAsNumber={true}
                            options={[
                                { label: "To", value: "" },
                                ...NUM_OPTIONS.slice(1),
                            ]}
                        />
                    </div>

                    <div className={styles.splitInput}>
                        <MultiStepForm.Input
                            type="number"
                            registerName="budgetFrom"
                            valueAsNumber={true}
                            placeholder="From (in AED)"
                            label="Budget"
                        />
                        <span>-</span>
                        <MultiStepForm.Input
                            type="number"
                            registerName="budgetTo"
                            valueAsNumber={true}
                            placeholder="To (in AED)"
                        />
                    </div>

                    <MultiStepForm.InputDataList
                        registerName="property_type"
                        data={PROPERTY_TYPES}
                        placeholder="Property Type"
                        isMulti={true}
                        label="Preferred Type"          
                    />

                   

                    <MultiStepForm.InputSelect
                        registerName="payMethod"
                        options={PAYMENT_OPTIONS}
                        label="Payment Method"
                    />
                   
                   <div style={{ position: 'relative' }}>
                        <div className={styles.inputGroup}>
                            {/* <label className={styles.label}>Preferred Property</label> */}
                            <FormInputPropertySearch
                                control={control}
                                registerName="preferred_property"
                                placeholder="Search properties..."
                                isMulti={true}
                                label="Preferred Property"
                            />
                        </div>
                        
                        {watch('preferred_property')?.length > 0 && (
                            <button
                                type="button"
                                onMouseEnter={() => handleShowPopover('preferred_property')}
                                onMouseLeave={handleHidePopover}
                                style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#f1f5f9',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    fontWeight: '500',
                                    letterSpacing: '0.025em',
                                    marginTop: '8px'
                                }}
                            >
                                See Property ({watch('preferred_property')?.length || 0})
                            </button>
                        )}
                        
                        {showPopover && activePopover === 'preferred_property' && (
                            <div 
                                onMouseEnter={() => handleShowPopover('preferred_property')}
                                onMouseLeave={handleHidePopover}
                                style={{
                                    position: 'absolute',
                                    left: '0',
                                    marginTop: '8px',
                                    padding: '12px',
                                    backgroundColor: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    zIndex: 1000,
                                    minWidth: '200px',
                                    maxHeight: '300px',
                                    overflowY: 'auto'
                                }}
                            >
                                {watch("preferred_property")?.length > 0 ? (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px'
                                    }}>
                                        {watch('preferred_property').map((item, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    padding: '4px 8px',
                                                    backgroundColor: '#f8fafc',
                                                    borderRadius: '4px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {item.label}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: '#64748b', fontSize: '14px' }}>No properties selected</p>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <div className={styles.inputGroup}>
                            {/* <label className={styles.label}>Preferred Developers</label> */}
                            <FormInputDeveloperSearch
                                control={control}
                                registerName="preferred_developer"
                                placeholder="Search developers..."
                                isMulti={true}
                                label="Preferred Developer"
                            />
                        </div>
                        
                        {watch('preferred_developer')?.length > 0 && (
                            <button
                                type="button"
                                onMouseEnter={() => handleShowPopover('preferred_developer')}
                                onMouseLeave={handleHidePopover}
                                style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#f1f5f9',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    fontWeight: '500',
                                    letterSpacing: '0.025em',
                                    marginTop: '8px'
                                }}
                            >
                                See Developer ({watch('preferred_developer')?.length || 0})
                            </button>
                        )}
                        
                        {showPopover && activePopover === 'preferred_developer' && (
                            <div 
                                onMouseEnter={() => handleShowPopover('preferred_developer')}
                                onMouseLeave={handleHidePopover}
                                style={{
                                    position: 'absolute',
                                    left: '0',
                                    marginTop: '8px',
                                    padding: '12px',
                                    backgroundColor: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    zIndex: 1000,
                                    minWidth: '200px',
                                    maxHeight: '300px',
                                    overflowY: 'auto'
                                }}
                            >
                                {watch("preferred_developer")?.length > 0 ? (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px'
                                    }}>
                                        {watch('preferred_developer').map((item, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    padding: '4px 8px',
                                                    backgroundColor: '#f8fafc',
                                                    borderRadius: '4px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {item.label}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: '#64748b', fontSize: '14px' }}>No developers selected</p>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <div className={styles.inputGroup}>
                            {/* <label className={styles.label}>Preferred Project</label> */}
                            <FormInputProjectSearch
                                control={control}
                                registerName="preferred_project"
                                placeholder="Search projects..."
                                isMulti={true}
                                label="Preferred Project"
                                />
                        </div>
                        
                        {watch('preferred_project')?.length > 0 && (
                            <button
                                type="button"
                                onMouseEnter={() => handleShowPopover('preferred_project')}
                                onMouseLeave={handleHidePopover}
                                style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#f1f5f9',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    fontWeight: '500',
                                    letterSpacing: '0.025em',
                                    marginTop: '8px'
                                }}
                            >
                                See Project ({watch('preferred_project')?.length || 0})
                            </button>
                        )}
                        
                        {showPopover && activePopover === 'preferred_project' && (
                            <div 
                                onMouseEnter={() => handleShowPopover('preferred_project')}
                                onMouseLeave={handleHidePopover}
                                style={{
                                    position: 'absolute',
                                    left: '0',
                                    marginTop: '8px',
                                    padding: '12px',
                                    backgroundColor: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    zIndex: 1000,
                                    minWidth: '200px',
                                    maxHeight: '300px',
                                    overflowY: 'auto'
                                }}
                            >
                                {watch("preferred_project")?.length > 0 ? (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px'
                                    }}>
                                        {watch('preferred_project').map((item, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    padding: '4px 8px',
                                                    backgroundColor: '#f8fafc',
                                                    borderRadius: '4px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {item.label}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: '#64748b', fontSize: '14px' }}>No projects selected</p>
                                )}
                            </div>
                        )}
                    </div>
                    {clientType === "RENT" && (
                        <MultiStepForm.InputSelect
                            registerName="rent_period"
                            options={PRICE_TYPE_OPTIONS}
                            placeholder="Select Rent Period"
                            label="Rent Period"
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default MetaAdForm;
