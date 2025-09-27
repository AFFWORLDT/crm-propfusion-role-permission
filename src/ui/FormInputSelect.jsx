function FormInputSelect({
    register,
    registerName,
    options,
    required,
    valueAsNumber,
    hasGrouping, // if true, then the options will be an array of objects else an array
}) {
    return (
        <select
            style={{ textTransform: "capitalize" }}
            {...register(registerName, {
                required: required ? "This field is required" : false,
                valueAsNumber,
            })}
            required={required}
        >
              
            {hasGrouping
                ? Object.keys(options).map((optGroupKey) => {
                      return (
                          <optgroup key={optGroupKey} label={optGroupKey}>
                              {options[optGroupKey].map?.((option) => (
                                  <option
                                      value={option.value}
                                      key={option.value}
                                      style={option.style}
                                  >
                                      {option.label}
                                  </option>
                              ))}
                          </optgroup>
                      );
                  })
                : options.map((option) => (
                      <option
                          value={option.value}
                          key={option.value}
                          style={option.style}
                      >
                          {option.label}
                      </option>
                  ))}
        </select>
    );
}

export default FormInputSelect;
