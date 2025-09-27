import Select from "react-select";
import useCountries from "../hooks/useCountries";
import { Controller } from "react-hook-form";
import REACT_SELECT_STYLES from "../styles/reactSelectStyles";

function FormInputCountries({
    control,
    registerName,
    placeholder,
    isMulti,
    required,
    disabled, // Add disabled prop
}) {
    const { isLoading, data: countriesData } = useCountries();

    const countryOptions = countriesData.map((country) => {
        return {
            value: country.name.common,
            label: country.name.common,
            flag: country.flags.png,
        };
    });

    const customOption = (props) => {
        const { data, innerRef, innerProps } = props;
        return (
            <div ref={innerRef} {...innerProps} className="country-option" style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%'
            }}>
                <img
                    src={data.flag}
                    style={{
                        width: "25px",
                        height: "20px",
                        objectFit: "contain",
                        margin: "10px",
                    }}
                />
                {data.label}
            </div>
        );
    };

    return (
        <Controller
            name={registerName}
            control={control}
            rules={{
                required: required ? "This field is required" : false,
            }}
            defaultValue=""
            render={({ field }) => (
                <Select
                    {...field}
                    options={countryOptions}
                    isMulti={isMulti}
                    placeholder={placeholder}
                    isDisabled={disabled || isLoading} // Add disabled prop here
                    styles={REACT_SELECT_STYLES}
                    required={required}
                    getOptionLabel={(e) => (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%"
                            }}
                        >
                            <img
                                src={e.flag}
                                style={{
                                    width: "25px",
                                    height: "20px",
                                    objectFit: "contain",
                                    marginRight: "10px",
                                }}
                            />
                            {e.label}
                        </div>
                    )}
                    components={{
                        Option: customOption,
                    }}
                />
            )}
        />
    );
}

export default FormInputCountries;
