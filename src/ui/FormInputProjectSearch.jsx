import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
import REACT_SELECT_STYLES from "../styles/reactSelectStyles";
import useProjectSearch from "../features/properties/useProjectSearch";

function FormInputProjectSearch({
    control,
    registerName,
    placeholder = "Search projects...",
    isDisabled = false,
    required = false,
    isMulti = false,
    label = "",
    labelPosition = "left", 
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const containerStyle = {
        display: labelPosition === "left" ? "flex" : "block",
        alignItems: labelPosition === "left" ? "center" : "stretch",
        gap: labelPosition === "left" ? "16px" : "4px",
    };

    const labelStyle = {
        flex: labelPosition === "left" ? "0 0 150px" : "1",
        marginBottom: labelPosition === "left" ? "0" : "4px",
    };

    const selectContainerStyle = {
        flex: labelPosition === "left" ? "1" : "auto",
    };

    // Debounce search term to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { projects, isLoading } = useProjectSearch(debouncedSearchTerm);

    const handleInputChange = (inputValue) => {
        setSearchTerm(inputValue);
    };

    const formatOptionLabel = (option) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {option.logo && (
                <img 
                    src={option.logo} 
                    alt="" 
                    style={{ width: 20, height: 20, borderRadius: "4px" }} 
                />
            )}
            <span>{option.label}</span>
        </div>
    );

    return (
        <div style={containerStyle}>
        {label && (
            <label style={labelStyle}>
                {label}
                {required && <span style={{ color: "red" }}> *</span>}
            </label>
        )}
        <div style={selectContainerStyle}>
        <Controller
            name={registerName}
            control={control}
            rules={{
                required: required ? "This field is required" : false,
            }}
            defaultValue={isMulti ? [] : null}
            render={({ field }) => (
                <Select
                    {...field}
                    options={projects}
                    isMulti={isMulti}
                    placeholder={placeholder}
                    isDisabled={isDisabled}
                    isLoading={isLoading}
                    styles={REACT_SELECT_STYLES}
                    required={required}
                    formatOptionLabel={formatOptionLabel}
                    onInputChange={handleInputChange}
                    filterOption={() => true} // Disable built-in filtering since we're using API search
                    noOptionsMessage={() => 
                        searchTerm.length < 2 
                            ? "Type at least 2 characters to search..." 
                            : isLoading 
                                ? "Searching..." 
                                : "No projects found"
                    }
                    />
                    )}
                />
            </div>
        </div> 
    );
}

export default FormInputProjectSearch;
