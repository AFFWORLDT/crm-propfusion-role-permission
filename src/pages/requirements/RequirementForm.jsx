import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import styles from "./RequirementForm.module.css";
import { 
    getPropertyRequirementById, 
    createPropertyRequirement, 
    updatePropertyRequirement 
} from "../../services/apiRequirements";
import { getLocations } from "../../services/apiProperties";
import { PROPERTY_TYPES, BEDROOM_NUM_OPTIONS } from "../../utils/constants";
import SectionTop from "../../ui/SectionTop";

const LISTING_TYPES = [
    { value: "rent", label: "For Rent" },
    { value: "sale", label: "For Sale" },
];

const COMPLETION_STATUS = [
    { value: "ready", label: "Ready" },
    { value: "off_plan", label: "Off Plan" },
    { value: "under_construction", label: "Under Construction" },
];

const AMENITIES = [
    "Swimming Pool", "Gym", "Parking", "Security", "Garden", "Balcony", 
    "Elevator", "Air Conditioning", "Central Heating", "Furnished", 
    "Pet Friendly", "Internet", "Maid Room", "Storage Room", "Laundry Room"
];

// Enhanced dropdown options
const BEDROOM_OPTIONS = [
    { value: "", label: "Any Bedrooms" },
    ...BEDROOM_NUM_OPTIONS.map(option => ({
        value: option.value,
        label: option.label === "Studio" ? "Studio" : `${option.label} Bedroom${option.value > 1 ? 's' : ''}`
    }))
];

const BATHROOM_OPTIONS = [
    { value: "", label: "Any Bathrooms" },
    ...Array.from({ length: 10 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1} Bathroom${i > 0 ? 's' : ''}`
    }))
];

const SIZE_OPTIONS = [
    { value: "", label: "Any Size" },
    { value: "500", label: "500+ sqft" },
    { value: "750", label: "750+ sqft" },
    { value: "1000", label: "1,000+ sqft" },
    { value: "1250", label: "1,250+ sqft" },
    { value: "1500", label: "1,500+ sqft" },
    { value: "2000", label: "2,000+ sqft" },
    { value: "2500", label: "2,500+ sqft" },
    { value: "3000", label: "3,000+ sqft" },
    { value: "4000", label: "4,000+ sqft" },
    { value: "5000", label: "5,000+ sqft" },
    { value: "7500", label: "7,500+ sqft" },
    { value: "10000", label: "10,000+ sqft" }
];

// Sale price options (original)
const SALE_PRICE_OPTIONS = [
    { value: "", label: "Any Price" },
    { value: "500000", label: "500K AED" },
    { value: "750000", label: "750K AED" },
    { value: "1000000", label: "1M AED" },
    { value: "1250000", label: "1.25M AED" },
    { value: "1500000", label: "1.5M AED" },
    { value: "2000000", label: "2M AED" },
    { value: "2500000", label: "2.5M AED" },
    { value: "3000000", label: "3M AED" },
    { value: "4000000", label: "4M AED" },
    { value: "5000000", label: "5M AED" },
    { value: "6000000", label: "6M AED" },
    { value: "7500000", label: "7.5M AED" },
    { value: "10000000", label: "10M AED" },
    { value: "12500000", label: "12.5M AED" },
    { value: "15000000", label: "15M AED" },
    { value: "20000000", label: "20M AED" },
    { value: "25000000", label: "25M AED" },
    { value: "30000000", label: "30M AED" },
    { value: "50000000", label: "50M AED" },
    { value: "75000000", label: "75M AED" },
    { value: "100000000", label: "100M AED" }
];

// Rent price options (starting from 20K AED, max 2M AED)
const RENT_PRICE_OPTIONS = [
    { value: "", label: "Any Price" },
    { value: "20000", label: "20K AED" },
    { value: "25000", label: "25K AED" },
    { value: "30000", label: "30K AED" },
    { value: "35000", label: "35K AED" },
    { value: "40000", label: "40K AED" },
    { value: "45000", label: "45K AED" },
    { value: "50000", label: "50K AED" },
    { value: "60000", label: "60K AED" },
    { value: "70000", label: "70K AED" },
    { value: "75000", label: "75K AED" },
    { value: "80000", label: "80K AED" },
    { value: "90000", label: "90K AED" },
    { value: "100000", label: "100K AED" },
    { value: "125000", label: "125K AED" },
    { value: "150000", label: "150K AED" },
    { value: "175000", label: "175K AED" },
    { value: "200000", label: "200K AED" },
    { value: "250000", label: "250K AED" },
    { value: "300000", label: "300K AED" },
    { value: "400000", label: "400K AED" },
    { value: "500000", label: "500K AED" },
    { value: "750000", label: "750K AED" },
    { value: "1000000", label: "1M AED" },
    { value: "1250000", label: "1.25M AED" },
    { value: "1500000", label: "1.5M AED" },
    { value: "1750000", label: "1.75M AED" },
    { value: "2000000", label: "2M AED" }
];

// Custom select styles for modern look
const selectStyles = {
    control: (provided, state) => ({
        ...provided,
        minHeight: '48px',
        border: state.isFocused ? '2px solid #667eea' : '2px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: state.isFocused ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease',
        '&:hover': {
            border: '2px solid #667eea'
        }
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#667eea' : state.isFocused ? '#f0f4ff' : 'white',
        color: state.isSelected ? 'white' : '#374151',
        padding: '12px 16px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: state.isSelected ? '600' : '400'
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#e0e7ff',
        borderRadius: '8px',
        border: '1px solid #c7d2fe'
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#3730a3',
        fontWeight: '500',
        fontSize: '13px'
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#3730a3',
        ':hover': {
            backgroundColor: '#c7d2fe',
            color: '#1e1b4b'
        }
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#9ca3af',
        fontSize: '14px'
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#374151',
        fontSize: '14px'
    }),
    menu: (provided) => ({
        ...provided,
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
    }),
    menuList: (provided) => ({
        ...provided,
        padding: '8px 0',
        maxHeight: '240px'
    })
};

function RequirementForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const isEditMode = Boolean(id);

    // Get price options based on listing type
    const getPriceOptions = (listingType) => {
        return listingType === "rent" ? RENT_PRICE_OPTIONS : SALE_PRICE_OPTIONS;
    };

    const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            description: "",
            property_types: [],
            locations: [{ city: "", community: "", sub_community: "", property_name: "" }],
            min_bedrooms: 0,
            max_bedrooms: 0,
            min_bathrooms: 0,
            max_bathrooms: 0,
            min_size: 0,
            max_size: 0,
            min_price: 0,
            max_price: 0,
            listing_type: "",
            amenities: [],
            completion_status: [],
            is_active: true,
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "locations"
    });

    // Load locations for AsyncSelect
    const loadLocationOptions = async (inputValue) => {
        try {
            const locations = await getLocations(inputValue);
            return locations.map(location => ({
                value: JSON.stringify({
                    id: location.id || null,
                    city: location.city,
                    community: location.community,
                    sub_community: location.sub_community,
                    property_name: location.property_name || ""
                }),
                label: `${location.city}${location.community ? `, ${location.community}` : ''}${location.sub_community ? `, ${location.sub_community}` : ''}`,
                data: location
            }));
        } catch (error) {
            console.error("Error loading locations:", error);
            return [];
        }
    };

    // Fetch requirement for edit mode
    const { data: requirementData, isLoading } = useQuery({
        queryKey: ["property-requirement", id],
        queryFn: () => getPropertyRequirementById(id),
        enabled: isEditMode,
    });

    // Set form values when requirement data is loaded
    useEffect(() => {
        if (requirementData && isEditMode) {
            // Handle locations array - ensure at least one empty location if none exist
            const locations = requirementData.locations && requirementData.locations.length > 0 
                ? requirementData.locations 
                : [{ city: "", community: "", sub_community: "", property_name: "" }];
            
            // Reset form with API data
            reset({
                title: requirementData.title || "",
                description: requirementData.description || "",
                property_types: requirementData.property_types || [],
                locations: locations,
                min_bedrooms: requirementData.min_bedrooms || 0,
                max_bedrooms: requirementData.max_bedrooms || 0,
                min_bathrooms: requirementData.min_bathrooms || 0,
                max_bathrooms: requirementData.max_bathrooms || 0,
                min_size: requirementData.min_size || 0,
                max_size: requirementData.max_size || 0,
                min_price: requirementData.min_price || 0,
                max_price: requirementData.max_price || 0,
                listing_type: requirementData.listing_type || "",
                amenities: requirementData.amenities || [],
                completion_status: requirementData.completion_status || [],
                is_active: requirementData.is_active ?? true,
            });
        }
    }, [requirementData, isEditMode, reset]);

    // Create/Update mutations
    const createMutation = useMutation({
        mutationFn: createPropertyRequirement,
        onSuccess: () => {
            toast.success("Requirement created successfully!");
            queryClient.invalidateQueries(["property-requirements"]);
            navigate("/requirements");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create requirement");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updatePropertyRequirement(id, data),
        onSuccess: () => {
            toast.success("Requirement updated successfully!");
            queryClient.invalidateQueries(["property-requirements"]);
            queryClient.invalidateQueries(["property-requirement", id]);
            navigate("/requirements");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update requirement");
        },
    });

    const onSubmit = (data) => {
        // Clean up empty locations
        const cleanedLocations = data.locations.filter(location => 
            location.city || location.community || location.sub_community || location.property_name
        );

        const submissionData = {
            ...data,
            locations: cleanedLocations,
            min_bedrooms: parseInt(data.min_bedrooms) || 0,
            max_bedrooms: parseInt(data.max_bedrooms) || 0,
            min_bathrooms: parseInt(data.min_bathrooms) || 0,
            max_bathrooms: parseInt(data.max_bathrooms) || 0,
            min_size: parseFloat(data.min_size) || 0,
            max_size: parseFloat(data.max_size) || 0,
            min_price: parseFloat(data.min_price) || 0,
            max_price: parseFloat(data.max_price) || 0,
        };

        if (isEditMode) {
            updateMutation.mutate({ id, data: submissionData });
        } else {
            createMutation.mutate(submissionData);
        }
    };

    const handlePropertyTypeChange = (type) => {
        const currentTypes = watch("property_types") || [];
        const newTypes = currentTypes.includes(type)
            ? currentTypes.filter(t => t !== type)
            : [...currentTypes, type];
        setValue("property_types", newTypes);
    };

    const handleAmenityChange = (amenity) => {
        const currentAmenities = watch("amenities") || [];
        const newAmenities = currentAmenities.includes(amenity)
            ? currentAmenities.filter(a => a !== amenity)
            : [...currentAmenities, amenity];
        setValue("amenities", newAmenities);
    };

    const handleCompletionStatusChange = (status) => {
        const currentStatuses = watch("completion_status") || [];
        const newStatuses = currentStatuses.includes(status)
            ? currentStatuses.filter(s => s !== status)
            : [...currentStatuses, status];
        setValue("completion_status", newStatuses);
    };

    if (isEditMode && isLoading) {
        return (
            <div className={styles.formContainer}>
                <div className={styles.loading}>Loading requirement...</div>
            </div>
        );
    }

    return (
        <div className="sectionContainer">
            <SectionTop heading={isEditMode ? "Edit Requirement" : "Add New Requirement"} />
            <section className="sectionStyles">
                <div className={styles.header}>
                <h1 className={styles.title}>
                    
                </h1>
                <button 
                    type="button"
                    className={styles.backButton}
                    onClick={() => navigate("/requirements")}
                >
                    ← Back to Requirements
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                {/* Basic Information */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>📋 Basic Information</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Title *</label>
                            <input
                                type="text"
                                className={styles.input}
                                {...register("title", { required: "Title is required" })}
                                placeholder="Enter requirement title"
                            />
                            {errors.title && <span className={styles.error}>{errors.title.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Listing Type</label>
                            <Select
                                options={LISTING_TYPES}
                                styles={selectStyles}
                                placeholder="Select listing type"
                                isClearable
                                value={LISTING_TYPES.find(option => option.value === watch("listing_type")) || null}
                                onChange={(selectedOption) => setValue("listing_type", selectedOption?.value || "")}
                            />
                        </div>

                        <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={styles.textarea}
                                {...register("description")}
                                placeholder="Enter detailed description of requirements"
                                rows={4}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    {...register("is_active")}
                                />
                                Active Requirement
                            </label>
                        </div>
                    </div>
                </div>

                {/* Property Types */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>🏠 Property Types</h2>
                    <div className={styles.checkboxGrid}>
                        {PROPERTY_TYPES.map(type => (
                            <label key={type.value} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={watch("property_types")?.includes(type.value) || false}
                                    onChange={() => handlePropertyTypeChange(type.value)}
                                />
                                {type.label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Locations */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>📍 Preferred Locations</h2>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Search & Select Locations</label>
                        <AsyncSelect
                            isMulti
                            loadOptions={loadLocationOptions}
                            styles={selectStyles}
                            placeholder="Search for locations (city, community, etc.)"
                            noOptionsMessage={() => "Type to search for locations..."}
                            loadingMessage={() => "Searching locations..."}
                            value={watch("locations")?.filter(loc => loc.city || loc.community || loc.sub_community).map(location => {
                                const locationStr = JSON.stringify({
                                    city: location.city,
                                    community: location.community,
                                    sub_community: location.sub_community,
                                    property_name: location.property_name || ""
                                });
                                return {
                                    value: locationStr,
                                    label: `${location.city}${location.community ? `, ${location.community}` : ''}${location.sub_community ? `, ${location.sub_community}` : ''}`,
                                    data: location
                                };
                            }) || []}
                            onChange={(selectedOptions) => {
                                const locations = selectedOptions && selectedOptions.length > 0 
                                    ? selectedOptions.map(option => {
                                        try {
                                            return JSON.parse(option.value);
                                        } catch {
                                            return option.data || { city: "", community: "", sub_community: "", property_name: "" };
                                        }
                                    }) 
                                    : [{ city: "", community: "", sub_community: "", property_name: "" }];
                                setValue("locations", locations);
                            }}
                            defaultOptions
                        />
                        <div className={styles.helpText}>
                            💡 Start typing to search for cities, communities, or specific locations
                        </div>
                    </div>
                </div>

                {/* Property Details */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>🛏️ Property Details</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Min Bedrooms</label>
                            <Select
                                options={BEDROOM_OPTIONS}
                                styles={selectStyles}
                                placeholder="Select minimum bedrooms"
                                isClearable
                                value={BEDROOM_OPTIONS.find(option => option.value == watch("min_bedrooms")) || null}
                                onChange={(selectedOption) => setValue("min_bedrooms", selectedOption?.value || "")}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Max Bedrooms</label>
                            <Select
                                options={BEDROOM_OPTIONS}
                                styles={selectStyles}
                                placeholder="Select maximum bedrooms"
                                isClearable
                                value={BEDROOM_OPTIONS.find(option => option.value == watch("max_bedrooms")) || null}
                                onChange={(selectedOption) => setValue("max_bedrooms", selectedOption?.value || "")}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Min Bathrooms</label>
                            <Select
                                options={BATHROOM_OPTIONS}
                                styles={selectStyles}
                                placeholder="Select minimum bathrooms"
                                isClearable
                                value={BATHROOM_OPTIONS.find(option => option.value == watch("min_bathrooms")) || null}
                                onChange={(selectedOption) => setValue("min_bathrooms", selectedOption?.value || "")}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Max Bathrooms</label>
                            <Select
                                options={BATHROOM_OPTIONS}
                                styles={selectStyles}
                                placeholder="Select maximum bathrooms"
                                isClearable
                                value={BATHROOM_OPTIONS.find(option => option.value == watch("max_bathrooms")) || null}
                                onChange={(selectedOption) => setValue("max_bathrooms", selectedOption?.value || "")}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Min Size</label>
                            <Select
                                options={SIZE_OPTIONS}
                                styles={selectStyles}
                                placeholder="Select minimum size"
                                isClearable
                                value={SIZE_OPTIONS.find(option => option.value == watch("min_size")) || null}
                                onChange={(selectedOption) => setValue("min_size", selectedOption?.value || "")}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Max Size</label>
                            <Select
                                options={SIZE_OPTIONS}
                                styles={selectStyles}
                                placeholder="Select maximum size"
                                isClearable
                                value={SIZE_OPTIONS.find(option => option.value == watch("max_size")) || null}
                                onChange={(selectedOption) => setValue("max_size", selectedOption?.value || "")}
                            />
                        </div>
                    </div>
                </div>

                {/* Price Range */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>💰 Price Range</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Min Price</label>
                            <Select
                                options={getPriceOptions(watch("listing_type"))}
                                styles={selectStyles}
                                placeholder="Select minimum price"
                                isClearable
                                value={getPriceOptions(watch("listing_type")).find(option => option.value == watch("min_price")) || null}
                                onChange={(selectedOption) => setValue("min_price", selectedOption?.value || "")}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Max Price</label>
                            <Select
                                options={getPriceOptions(watch("listing_type"))}
                                styles={selectStyles}
                                placeholder="Select maximum price"
                                isClearable
                                value={getPriceOptions(watch("listing_type")).find(option => option.value == watch("max_price")) || null}
                                onChange={(selectedOption) => setValue("max_price", selectedOption?.value || "")}
                            />
                        </div>
                    </div>
                </div>

                {/* Amenities */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>🏊 Preferred Amenities</h2>
                    <div className={styles.checkboxGrid}>
                        {AMENITIES.map(amenity => (
                            <label key={amenity} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={watch("amenities")?.includes(amenity) || false}
                                    onChange={() => handleAmenityChange(amenity)}
                                />
                                {amenity}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Completion Status */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>🏗️ Completion Status</h2>
                    <div className={styles.checkboxGrid}>
                        {COMPLETION_STATUS.map(status => (
                            <label key={status.value} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={watch("completion_status")?.includes(status.value) || false}
                                    onChange={() => handleCompletionStatusChange(status.value)}
                                />
                                {status.label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Form Actions */}
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => navigate("/requirements")}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={createMutation.isLoading || updateMutation.isLoading}
                    >
                        {createMutation.isLoading || updateMutation.isLoading
                            ? "Saving..."
                            : isEditMode
                            ? "Update Requirement"
                            : "Create Requirement"
                        }
                    </button>
                </div>
                </form>
            </section>
        </div>
    );
}

export default RequirementForm;
