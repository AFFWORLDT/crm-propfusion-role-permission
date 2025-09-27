import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";

function FormInputDatePicker({
    control,
    registerName,
    isYearPicker,
    placeholder,
}) {
    return (
        <Controller
            name={registerName}
            control={control}
            render={({ field }) => (
                <DatePicker
                    {...field}
                    showIcon
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    placeholderText={placeholder}
                    showYearPicker={isYearPicker}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat={isYearPicker ? "yyyy" : "dd/MM/yyyy"}
                />
            )}
        />
    );
}

export default FormInputDatePicker;
