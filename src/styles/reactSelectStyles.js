const REACT_SELECT_STYLES = {
    container: (provided) => ({
        ...provided,
        flexGrow: 1,
        minWidth: "20rem",
        maxWidth: "100%",
    }),
    control: (provided) => ({
        ...provided,
        padding: ".3rem .8rem",
        borderRadius: ".8rem",
        border: "1px solid #e0e3e2",
        minHeight: "48px",
        height: "48px",
        fontSize: "1.4rem",
        "@media (max-width: 768px)": {
            minHeight: "38px",
            height: "38px",
            fontSize: "1.2rem",
        }
    }),
    menu: (provided) => ({
        ...provided,
        width: "100%",
        zIndex: 9999,
    }),
    menuList: (provided) => ({
        ...provided,
        color: "#000",
    }),
    option: (provided, state) => ({
        ...provided,
        color: "#000",
        backgroundColor: state.isSelected ? "#e6f3ff" : state.isFocused ? "#f5f5f5" : "white",
    }),
    valueContainer: (provided) => ({
        ...provided,
        maxHeight: "48px",
        overflow: "hidden",
        "@media (max-width: 768px)": {
            maxHeight: "38px",
        }
    }),
    multiValue: (provided) => ({
        ...provided,
        maxWidth: "100px",
    }),
};

export default REACT_SELECT_STYLES;
