/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";
import makeAnimated from "react-select/animated";
import REACT_SELECT_STYLES from "../styles/reactSelectStyles";

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const FormInputAsyncDataList = ({
    control,
    registerName,
    placeholder,
    required,
    asyncFunc,
    formatFunc,
    isCreatable,
    isClearable = true,
    isMulti = false,
}) => {
    const debouncedLoadOptions = useCallback(
        debounce(async (inputValue, callback) => {
            // Only make API call if 2 or more characters are typed
            if (!inputValue || inputValue.length < 2) {
                callback([]);
                return;
            }
            
            try {
                const data = await asyncFunc(inputValue);
                const options = formatFunc(data);
                callback(options);
            } catch (error) {
                console.error("Error loading options:", error);
                callback([]);
            }
        }, 300),
        [asyncFunc, formatFunc]
    );

    const animatedComponents = makeAnimated();

    // Base async select with animations
    const AsyncComponent = React.forwardRef((props, ref) => (
        <AsyncSelect
            {...props}
            ref={ref}
            cacheOptions
            defaultOptions
            components={animatedComponents}
        />
    ));
    AsyncComponent.displayName = 'AsyncComponent';

    return (
        <Controller
            name={registerName}
            control={control}
            rules={{
                required: required ? "This field is required" : false,
            }}
            defaultValue={isMulti ? [] : null}
            render={({ field }) => (
                isCreatable ? (
                    <AsyncCreatableSelect
                        {...field}
                        cacheOptions
                        defaultOptions
                        loadOptions={debouncedLoadOptions}
                        placeholder={placeholder}
                        required={required}
                        styles={REACT_SELECT_STYLES}
                        isClearable={isClearable}
                        isMulti={isMulti}
                        components={animatedComponents}
                        onChange={(selectedOption) => field.onChange(selectedOption)}
                    />
                ) : (
                    <AsyncComponent
                        {...field}
                        loadOptions={debouncedLoadOptions}
                        placeholder={placeholder}
                        required={required}
                        styles={REACT_SELECT_STYLES}
                        isClearable={isClearable}
                        isMulti={isMulti}
                        onChange={(selectedOption) => field.onChange(selectedOption)}
                    />
                )
            )}
        />
    );
};

export default FormInputAsyncDataList;
