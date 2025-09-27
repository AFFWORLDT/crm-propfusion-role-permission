import { Controller } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import REACT_SELECT_STYLES from "../styles/reactSelectStyles";

function FormInputDataList({
    control,
    registerName,
    data,
    placeholder,
    isLoading,
    isMulti,
    isDisabled,
    required,
    isClearable = true, // Added isClearable prop with default value true
    isCreatable = false,
}) {
    // Custom label with icon
    const formatOptionLabel = (option) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {option.icon && (
                typeof option.icon === "string" && option.icon.startsWith("/") ? (
                    <img src={option.icon} alt="" style={{ width: 20, height: 20 }} />
                ) : (
                    <span style={{ fontSize: 20 }}>{option.icon}</span>
                )
            )}
            <span>{option.label}</span>
        </div>
    );

    const animatedComponents = makeAnimated();

    return (
        <Controller
            name={registerName}
            control={control}
            rules={{
                required: required ? "This field is required" : false,
            }}
            defaultValue=""
            render={({ field }) => (
                isCreatable ? (
                    <CreatableSelect
                        {...field}
                        options={data}
                        isMulti={isMulti}
                        placeholder={placeholder}
                        isDisabled={isLoading || isDisabled}
                        styles={REACT_SELECT_STYLES}
                        required={required}
                        formatOptionLabel={formatOptionLabel}
                        isClearable={isClearable}
                        components={animatedComponents}
                    />
                ) : (
                    <Select
                        {...field}
                        options={data}
                        isMulti={isMulti}
                        placeholder={placeholder}
                        isDisabled={isLoading || isDisabled}
                        styles={REACT_SELECT_STYLES}
                        required={required}
                        formatOptionLabel={formatOptionLabel}
                        isClearable={isClearable}
                        components={animatedComponents}
                    />
                )
            )}
        />
    );
}

export default FormInputDataList;