import Select from "react-select";
import useCountries from "../hooks/useCountries";
import { Controller } from "react-hook-form";
import REACT_SELECT_STYLES from "../styles/reactSelectStyles";

function FormInputContact({ control, registerName, placeholder, required }) {
    const { isLoading, data: countriesData } = useCountries();

    const countryOptions = countriesData.map((country) => {
        return {
            value: country.idd?.root + country.idd?.suffixes?.[0],
            label: country.name.common,
            flag: country.flags.png,
        };
    });

    const customOption = (props) => {
        const { data, innerRef, innerProps } = props;
        return (
            <div ref={innerRef} {...innerProps} className="country-option">
                <img
                    src={data.flag}
                    style={{
                        width: "25px",
                        height: "20px",
                        objectFit: "contain",
                        margin: "10px 10px 10px 20px",
                    }}
                />
                {data.value}
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
                    placeholder={placeholder}
                    isDisabled={isLoading}
                    styles={REACT_SELECT_STYLES}
                    required={required}
                    filterOption={(option, input) => {
                        if (input) {
                            return (
                                option.data.value
                                    .toLowerCase()
                                    .includes(input.toLowerCase()) ||
                                option.data.label
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            );
                        }
                        return true;
                    }}
                    getOptionLabel={(e) => (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
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
                            {e.value}
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

export default FormInputContact;
