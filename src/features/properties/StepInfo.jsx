/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getLocations } from "../../services/apiProperties";
import styles from "../../styles/MultiStepForm.module.css";
import { GoogleMap, useLoadScript, MarkerF, InfoWindow } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../../config/googleMaps";
import MultiStepForm, { useMultiStepForm } from "../../ui/MultiStepForm";
import {
    BEDROOM_NUM_OPTIONS,
    CHEQUE_OPTIONS,
    COMPLETION_STATUS_OPTIONS,
    FURNITURE_OPTIONS,
    MORTGAGE_OPTIONS,
    NUM_OPTIONS,
    OCCUPANCY_OPTIONS,
    PRICE_TYPE_OPTIONS,
    PROPERTY_TYPES_02,
    SOURCE_OPTIONS,
} from "../../utils/constants";
import { formatLocationsCommunityOptions, formateDevelopersOptions } from "../../utils/utils";
import useStaff from "../admin/staff/useStaff";
import useAreasWithoutCount from "../areas/useAreasWithoutCount";
import { getDevelopersFlters } from "../../services/apiDevelopers";
// import useOwner from "../Owner/useOwner";
import AddOwnerButton from "../Owner/AddOwnerButton";
import useInfiniteOwners from "../Owner/useInfiniteOwners";
import useBuildings from "../building/useGetBuildingLists";
import useAllDetails from "../all-details/useAllDetails";
import { ChevronDown, ChevronUp } from "lucide-react";

// Add custom styles for the conversion display
const conversionStyles = {
    inputWithConversion: {
        position: "relative",
        width: "100%",
    },
    conversionResult: {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "#f0f0f0",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "0.9em",
        color: "#555",
        pointerEvents: "none",
    },
    dualInputContainer: {
        display: "flex",
        gap: "8px",
        flexDirection: "row",
        width: "100%",
    },
    inputWrapper: {
        flex: 1,
        position: "relative",
    },
    unitLabel: {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "0.8em",
        color: "#666",
        pointerEvents: "none",
    },
};

// Create responsive styles for mobile
const responsiveStyles = `
@media (max-width: 768px) {
    .dualInputContainer {
        flex-direction: column !important;
    }
    
    .inputWrapper {
        margin-bottom: 8px;
    }
}
`;

function StepInfo({ type }) {
    // Google Maps loading configuration
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });
    const { data } = useAllDetails();
    const isEditAllowed =
        data?.company_settings?.building_func === "true" ? true : false;
    const [selectedLocation, setSelectedLocation] = useState(null);
    const { watch, setValue } = useMultiStepForm();
    const { owners: Owner, isLoading: isOwnerLoading } = useInfiniteOwners(
        "",
        true
    );
    const { buildings, isLoading: isBuildingLoading } = useBuildings(true);
    const buildingOptions = buildings?.map((item) => {
        return {
            value: item.id,
            label: item.building_name,
        };
    });

    const { data: areaData, isLoading: isAreaLoading } =
        useAreasWithoutCount(true);
    const { data: staffData, isLoading: isStaffLoading } = useStaff();
    const isResidentialPlot = watch("property_type");
    const findCategory = (value, options) => {
        if (options?.RESIDENTIAL?.some((item) => item?.value === value)) {
            return 1;
        }
        if (options?.COMMERCIAL?.some((item) => item?.value === value)) {
            return 2;
        }
        return null;
    };
    const owner_id = watch("owner_id");
    let propertyTypesOptions = {};
    Object.keys(PROPERTY_TYPES_02 || {}).map((optGroupKey) => {
        propertyTypesOptions[optGroupKey] = [
            {
                value: "",
                label: "SELECT PROPERTY".toLowerCase(),
            },
            ...PROPERTY_TYPES_02[optGroupKey].map((item) => ({
                value: item.label,
                label: item.label.toLowerCase(),
            })),
        ];
    });

    const size = watch("size");
    const plotSize = watch("plotSize");
    const [sizeInMeter, setSizeInMeter] = useState("");
    const [plotSizeInMeter, setPlotSizeInMeter] = useState("");
    const [isOwnerInfoExpanded, setIsOwnerInfoExpanded] = useState(false);

    useEffect(() => {
        if (size) {
            const sizeInM = (size * 0.0929).toFixed(2);
            setSizeInMeter(sizeInM);

            // Update the sqm input field to reflect the converted value
            const sqmInput = document.getElementById("size-sqm-input");
            if (sqmInput) sqmInput.value = sizeInM;
        } else {
            setSizeInMeter("");

            // Clear the sqm input field
            const sqmInput = document.getElementById("size-sqm-input");
            if (sqmInput) sqmInput.value = "";
        }
    }, [size]);

    useEffect(() => {
        if (plotSize) {
            const plotSizeInM = (plotSize * 0.0929).toFixed(2);
            setPlotSizeInMeter(plotSizeInM);

            // Update the sqm input field to reflect the converted value
            const sqmInput = document.getElementById("plotSize-sqm-input");
            if (sqmInput) sqmInput.value = plotSizeInM;
        } else {
            setPlotSizeInMeter("");

            // Clear the sqm input field
            const sqmInput = document.getElementById("plotSize-sqm-input");
            if (sqmInput) sqmInput.value = "";
        }
    }, [plotSize]);

    const location = watch("location");
    
    useEffect(() => {
        if (location?.value) {
            setSelectedLocation({
                lat: location.value.latitude,
                lng: location.value.longitude,
                label: location.label
            });
        }
    }, [location]);

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

    const showbed = isResidentialPlot
        ? findCategory(isResidentialPlot, propertyTypesOptions)
        : null;
    const areaOptions = areaData?.map((item) => {
        return { value: item.id, label: item.name };
    });
    const staffOptions = staffData?.map((item) => {
        return { value: item.id, label: item.name };
    });
    const ownerOptions = Owner?.map((item) => {
        return { value: item, label: item?.owner_name };
    });

    useEffect(() => {
        localStorage.removeItem("bayut");
        localStorage.removeItem("dubizzle");
        localStorage.removeItem("propfusionPortal");
        localStorage.removeItem("ownPortal");
        localStorage.removeItem("customPortal");
        localStorage.removeItem("propertyFinder");
        localStorage.removeItem("price_on_application");
    }, []);

    // Add style element for responsive CSS
    useEffect(() => {
        const styleElement = document.createElement("style");
        styleElement.textContent = responsiveStyles;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    return (
        <>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Type</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputSelect
                        registerName="property_type"
                        hasGrouping={true}
                        options={propertyTypesOptions ?? {}}
                        required={true}
                        label="Property Type"
                    />
                    {type === "SELL" && (
                        <MultiStepForm.InputSelect
                            registerName="completionStatus"
                            options={COMPLETION_STATUS_OPTIONS}
                            required={true}
                            label="Completion Status"
                        />
                    )}
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/location.svg" />
                    <span>Location</span>
                </h3>
                <div className={styles.locationContainer}>
                    <div >
                        <div className="location-dropdown">
                            <MultiStepForm.InputAsyncDataList
                                registerName="location"
                                placeholder="Search location..."
                                label="Location"
                                asyncFunc={getLocations}
                                formatFunc={formatLocationsCommunityOptions}
                                className="location-input"
                            />
                        </div>
                    </div>
                    <div className={styles.mapContainer}>
                        {loadError && (
                            <div className={styles.placeholderMap}>
                                <span>Error loading maps: {loadError.message}</span>
                            </div>
                        )}
                        {!isLoaded && (
                            <div className={styles.placeholderMap}>
                                <span>Loading Maps...</span>
                            </div>
                        )}
                        {isLoaded && selectedLocation && typeof selectedLocation.lat === "number" && typeof selectedLocation.lng === "number" ? (
                            <GoogleMap
                                zoom={15}
                                center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                                mapContainerStyle={{ height: '300px', width: '100%', borderRadius: '8px' }}
                                options={{
                                    zoomControl: true,
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                    fullscreenControl: false,
                                }}
                            >
                                <MarkerF
                                    position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                                    title={selectedLocation.label}
                                    icon={{
                                        url: '/icons/location.svg',
                                        scaledSize: new window.google.maps.Size(32, 32),
                                    }}
                                />
                            </GoogleMap>
                        ) : isLoaded && (
                            <div className={styles.placeholderMap}>
                                <span>Select a location to view map</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <div className={styles.ownerInfo}>
                    <h3 onClick={() => setIsOwnerInfoExpanded(!isOwnerInfoExpanded)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src="/icons/person.svg" />
                        <span>Owner Info</span>
                        {isOwnerInfoExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
                {isOwnerInfoExpanded && (
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
                )}
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/detail.svg" />
                    <span>Detail</span>
                </h3>
                <div className={styles.formContainer}>
                    {isResidentialPlot === "RESIDENTIAL PLOT" ? (
                        <>
                            <MultiStepForm.InputAsyncDataList
                                registerName="developerId"
                                placeholder="Developer"
                                asyncFunc={(search) => getDevelopersFlters(search)}
                                formatFunc={formateDevelopersOptions}
                                label="Developer"
                            />
                            <div className={styles.inputContainer}>
                                <label>Plot Size</label>
                                <div
                                    style={conversionStyles.dualInputContainer}
                                    className="dualInputContainer"
                                >
                                    <div
                                        style={conversionStyles.inputWrapper}
                                        className="inputWrapper"
                                    >
                                        <MultiStepForm.Input
                                            registerName="plotSize"
                                            placeholder="Plot Size (in sqft)"
                                            type="number"
                                            valueAsNumber={true}
                                            onChange={(e) => {
                                                const sqft = parseFloat(
                                                    e.target.value
                                                );
                                                if (!isNaN(sqft)) {
                                                    const sqm = (
                                                        sqft * 0.0929
                                                    ).toFixed(2);
                                                    setPlotSizeInMeter(sqm);
                                                    // Update the sqm input field
                                                    const sqmInput =
                                                        document.getElementById(
                                                            "plotSize-sqm-input"
                                                        );
                                                    if (sqmInput)
                                                        sqmInput.value = sqm;
                                                } else {
                                                    setPlotSizeInMeter("");
                                                    const sqmInput =
                                                        document.getElementById(
                                                            "plotSize-sqm-input"
                                                        );
                                                    if (sqmInput)
                                                        sqmInput.value = "";
                                                }
                                            }}
                                        />
                                        <span
                                            style={conversionStyles.unitLabel}
                                        >
                                            sqft
                                        </span>
                                    </div>
                                    <div
                                        style={conversionStyles.inputWrapper}
                                        className="inputWrapper"
                                    >
                                        <input
                                            id="plotSize-sqm-input"
                                            type="number"
                                            placeholder="Plot Size (in sqm)"
                                            className={styles.formInput}
                                            onChange={(e) => {
                                                const sqm = parseFloat(
                                                    e.target.value
                                                );
                                                if (!isNaN(sqm)) {
                                                    const sqft = (
                                                        sqm / 0.0929
                                                    ).toFixed(2);
                                                    // Update the form state with sqft value
                                                    setValue(
                                                        "plotSize",
                                                        parseFloat(sqft)
                                                    );
                                                    // Update the sqft input field
                                                    const sqftInputs =
                                                        document.querySelectorAll(
                                                            'input[name="plotSize"]'
                                                        );
                                                    if (sqftInputs.length > 0)
                                                        sqftInputs[0].value =
                                                            sqft;
                                                }
                                            }}
                                        />
                                        <span
                                            style={conversionStyles.unitLabel}
                                        >
                                            sqm
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.inputContainer}>
                                <label>Size</label>
                                <div
                                    style={conversionStyles.dualInputContainer}
                                    className="dualInputContainer"
                                >
                                    <div
                                        style={conversionStyles.inputWrapper}
                                        className="inputWrapper"
                                    >
                                        <MultiStepForm.Input
                                            registerName="size"
                                            placeholder="Size (in sqft)"
                                            required={true}
                                            type="number"
                                            valueAsNumber={true}
                                            onChange={(e) => {
                                                const sqft = parseFloat(
                                                    e.target.value
                                                );
                                                if (!isNaN(sqft)) {
                                                    const sqm = (
                                                        sqft * 0.0929
                                                    ).toFixed(2);
                                                    setSizeInMeter(sqm);
                                                    // Update the sqm input field
                                                    const sqmInput =
                                                        document.getElementById(
                                                            "size-sqm-input"
                                                        );
                                                    if (sqmInput)
                                                        sqmInput.value = sqm;
                                                } else {
                                                    setSizeInMeter("");
                                                    const sqmInput =
                                                        document.getElementById(
                                                            "size-sqm-input"
                                                        );
                                                    if (sqmInput)
                                                        sqmInput.value = "";
                                                }
                                            }}
                                        />
                                        <span
                                            style={conversionStyles.unitLabel}
                                        >
                                            sqft
                                        </span>
                                    </div>
                                    <div
                                        style={conversionStyles.inputWrapper}
                                        className="inputWrapper"
                                    >
                                        <input
                                            id="size-sqm-input"
                                            type="number"
                                            placeholder="Size (in sqm)"
                                            className={styles.formInput}
                                            onChange={(e) => {
                                                const sqm = parseFloat(
                                                    e.target.value
                                                );
                                                if (!isNaN(sqm)) {
                                                    const sqft = (
                                                        sqm / 0.0929
                                                    ).toFixed(2);
                                                    // Update the form state with sqft value
                                                    setValue(
                                                        "size",
                                                        parseFloat(sqft)
                                                    );
                                                    // Update the sqft input field
                                                    const sqftInputs =
                                                        document.querySelectorAll(
                                                            'input[name="size"]'
                                                        );
                                                    if (sqftInputs.length > 0)
                                                        sqftInputs[0].value =
                                                            sqft;
                                                }
                                            }}
                                        />
                                        <span
                                            style={conversionStyles.unitLabel}
                                        >
                                            sqm
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <MultiStepForm.Input
                                registerName="permitNumber"
                                placeholder="Enter Permit Number"
                                label="Permit Number"
                            />
                        </>
                    ) : (
                        <>
                            <MultiStepForm.InputDataList
                                registerName="agent_Id"
                                placeholder="Select Agent"
                                data={staffOptions}
                                isLoading={isStaffLoading}
                                label="Agent"
                                required={true}
                            />
                            <MultiStepForm.InputAsyncDataList
                                registerName="developerId"
                                placeholder="Developer"
                                asyncFunc={(search) => getDevelopersFlters(search)}
                                formatFunc={formateDevelopersOptions}
                                label="Developer"
                            />
                            <MultiStepForm.Input
                                registerName="totalFloor"
                                placeholder="Total Floors"
                                label="Total Floors"
                            />
                            <MultiStepForm.Input
                                registerName="floor"
                                placeholder="Floor"
                                label="Floor"
                            />
                            <div className={styles.inputContainer}>
                                <label>Plot Size</label>
                                <div
                                    style={conversionStyles.dualInputContainer}
                                    className="dualInputContainer"
                                >
                                    <div
                                        style={conversionStyles.inputWrapper}
                                        className="inputWrapper"
                                    >
                                        <MultiStepForm.Input
                                            registerName="plotSize"
                                            placeholder="Plot Size (in sqft)"
                                            type="number"
                                            valueAsNumber={true}
                                            onChange={(e) => {
                                                const sqft = parseFloat(
                                                    e.target.value
                                                );
                                                if (!isNaN(sqft)) {
                                                    const sqm = (
                                                        sqft * 0.0929
                                                    ).toFixed(2);
                                                    setPlotSizeInMeter(sqm);
                                                    // Update the sqm input field
                                                    const sqmInput =
                                                        document.getElementById(
                                                            "plotSize-sqm-input"
                                                        );
                                                    if (sqmInput)
                                                        sqmInput.value = sqm;
                                                } else {
                                                    setPlotSizeInMeter("");
                                                    const sqmInput =
                                                        document.getElementById(
                                                            "plotSize-sqm-input"
                                                        );
                                                    if (sqmInput)
                                                        sqmInput.value = "";
                                                }
                                            }}
                                        />
                                        <span
                                            style={conversionStyles.unitLabel}
                                        >
                                            sqft
                                        </span>
                                    </div>
                                    <div
                                        style={conversionStyles.inputWrapper}
                                        className="inputWrapper"
                                    >
                                        <input
                                            id="plotSize-sqm-input"
                                            type="number"
                                            placeholder="Plot Size (in sqm)"
                                            className={styles.formInput}
                                            onChange={(e) => {
                                                const sqm = parseFloat(
                                                    e.target.value
                                                );
                                                if (!isNaN(sqm)) {
                                                    const sqft = (
                                                        sqm / 0.0929
                                                    ).toFixed(2);
                                                    // Update the form state with sqft value
                                                    setValue(
                                                        "plotSize",
                                                        parseFloat(sqft)
                                                    );
                                                    // Update the sqft input field
                                                    const sqftInputs =
                                                        document.querySelectorAll(
                                                            'input[name="plotSize"]'
                                                        );
                                                    if (sqftInputs.length > 0)
                                                        sqftInputs[0].value =
                                                            sqft;
                                                }
                                            }}
                                        />
                                        <span
                                            style={conversionStyles.unitLabel}
                                        >
                                            sqm
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <MultiStepForm.InputDatePicker
                                registerName="buildYear"
                                isYearPicker={true}
                                placeholder="Select Year"
                                label="Build Year"
                            />
                            <div className={styles.inputContainer}>
                                <label>Size</label>
                                <div
                                    style={conversionStyles.dualInputContainer}
                                    className="dualInputContainer"
                                >
                                    <div
                                        style={conversionStyles.inputWrapper}
                                        className="inputWrapper"
                                    >
                                        <MultiStepForm.Input
                                            registerName="size"
                                            placeholder="Size (in sqft)"
                                            required={true}
                                            type="number"
                                            valueAsNumber={true}
                                            onChange={(e) => {
                                                const sqft = parseFloat(
                                                    e.target.value
                                                );
                                                if (!isNaN(sqft)) {
                                                    const sqm = (
                                                        sqft * 0.0929
                                                    ).toFixed(2);
                                                    setSizeInMeter(sqm);
                                                    // Update the sqm input field
                                                    const sqmInput =
                                                        document.getElementById(
                                                            "size-sqm-input"
                                                        );
                                                    if (sqmInput)
                                                        sqmInput.value = sqm;
                                                } else {
                                                    setSizeInMeter("");
                                                    const sqmInput =
                                                        document.getElementById(
                                                            "size-sqm-input"
                                                        );
                                                    if (sqmInput)
                                                        sqmInput.value = "";
                                                }
                                            }}
                                        />
                                        <span
                                            style={conversionStyles.unitLabel}
                                        >
                                            sqft
                                        </span>
                                    </div>
                                    <div
                                        style={conversionStyles.inputWrapper}
                                        className="inputWrapper"
                                    >
                                        <input
                                            id="size-sqm-input"
                                            type="number"
                                            placeholder="Size (in sqm)"
                                            className={styles.formInput}
                                            onChange={(e) => {
                                                const sqm = parseFloat(
                                                    e.target.value
                                                );
                                                if (!isNaN(sqm)) {
                                                    const sqft = (
                                                        sqm / 0.0929
                                                    ).toFixed(2);
                                                    // Update the form state with sqft value
                                                    setValue(
                                                        "size",
                                                        parseFloat(sqft)
                                                    );
                                                    // Update the sqft input field
                                                    const sqftInputs =
                                                        document.querySelectorAll(
                                                            'input[name="size"]'
                                                        );
                                                    if (sqftInputs.length > 0)
                                                        sqftInputs[0].value =
                                                            sqft;
                                                }
                                            }}
                                        />
                                        <span
                                            style={conversionStyles.unitLabel}
                                        >
                                            sqm
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <MultiStepForm.InputSelect
                                registerName="occupancy"
                                options={OCCUPANCY_OPTIONS}
                                label="Occupancy"
                            />
                            {type === "RENT" && (
                                <MultiStepForm.InputDatePicker
                                    registerName="availabilityDate"
                                    placeholder="Select Date"
                                    label="Availability Date"
                                />
                            )}
                            {(showbed === 1 || showbed === null) && (
                                <MultiStepForm.InputSelect
                                    registerName="bedRooms"
                                    options={BEDROOM_NUM_OPTIONS}
                                    valueAsNumber={true}
                                    label="Bedrooms"
                                />
                            )}

                            <MultiStepForm.InputSelect
                                registerName="bathrooms"
                                options={NUM_OPTIONS}
                                valueAsNumber={true}
                                label="Bathrooms"
                                required={true}
                            />
                            <MultiStepForm.InputSelect
                                registerName="parking"
                                options={NUM_OPTIONS}
                                valueAsNumber={true}
                                label="Parking"
                            />
                            <MultiStepForm.InputSelect
                                registerName="isFurnished"
                                options={FURNITURE_OPTIONS}
                                label="Furniture"
                                required={true}
                            />
                            {isEditAllowed && (
                                <MultiStepForm.Input
                                    registerName="dewa_no"
                                    placeholder="Enter dewa number"
                                    label="Dewa Number"
                                />
                            )}
                            <MultiStepForm.InputSelect
                                registerName="source_of_listing"
                                options={SOURCE_OPTIONS}
                                label="Source of Listing"
                            />
                            <div className={styles.inputContainer}>
                                <label>Unit Number</label>
                                <MultiStepForm.Input
                                    registerName="houseNo"
                                    placeholder="Unit Number"
                                />
                            </div>
                        </>
                    )}
                    {isEditAllowed && (
                        <MultiStepForm.InputDataList
                            registerName="building_id"
                            placeholder="Select Building"
                            data={buildingOptions}
                            isLoading={isBuildingLoading}
                            label="Building"
                        />
                    )}
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
                        placeholder="Price (in AED)"
                        required={true}
                        type="number"
                        valueAsNumber={true}
                        label="Price"
                    />
                    {type === "RENT" ? (
                        <>
                            <MultiStepForm.InputSelect
                                registerName="priceType"
                                options={PRICE_TYPE_OPTIONS}
                                label="Price Type"
                                required={true}
                            />
                            <MultiStepForm.InputSelect
                                registerName="cheques"
                                options={CHEQUE_OPTIONS}
                                label="Cheques"
                            />
                            <MultiStepForm.Input
                                registerName="deposit"
                                placeholder="Deposit (in AED)"
                                label="Deposit"
                            />
                        </>
                    ) : (
                        <>
                            <MultiStepForm.Input
                                registerName="serviceCharge"
                                placeholder="Service Charge (in AED/Year)"
                                label="Service Charge"
                            />
                            <MultiStepForm.InputSelect
                                registerName="hasMortgage"
                                options={MORTGAGE_OPTIONS}
                                label="Mortgage"
                            />
                            <MultiStepForm.Input
                                registerName="acCharge"
                                placeholder="AC Charge (in AED)"
                                label="AC Charge"
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default StepInfo;
