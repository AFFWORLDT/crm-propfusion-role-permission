/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import {
    createContext,
    Fragment,
    useContext,
    useEffect,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import FormInputDatePicker from "./FormInputDatePicker";
import FormInputSelect from "./FormInputSelect";
import FormInputDataList from "./FormInputDataList";
import styles from "../styles/MultiStepForm.module.css";
import BtnToggle from "./BtnToggle";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormInputAsyncDataList from "./FormInputAsyncDataList";
import {
    useUploadImage,
    useUploadImageV2,
    useUploadObdFile,
} from "../features/Extra/useUploadImage";
import { useUploadBuildDocs } from "../features/building/useUploadBuildDocs";
import { useSingleImageStore } from "../store/imagesStore";

const MultiStepFormContext = createContext();

function MultiStepForm({
    totalSteps,
    renderStep,
    onFormSubmit,
    isSubmitting,
    defaultValues,
    children,
}) {
    const isEditSession = defaultValues ? true : false;
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(1);
    const {
        register,
        handleSubmit,
        control,
        reset,
        trigger,
        formState: { errors },
        getValues,
        setValue,
        watch,
    } = useForm({ defaultValues: isEditSession ? defaultValues : {} });

    const saveAsDraft = watch(
        "saveAsDraft",
        searchParams.get("save") === "DRAFT"
    );

    function handlePreviousStep() {
        setActiveStep(activeStep - 1);
    }

    function handleNextStep() {
        trigger().then((res) => {
            if (res) {
                setActiveStep(activeStep + 1);
            }
        });
    }

    function handleReset() {
        reset();
        setActiveStep(1);
    }

    function onSubmit(formData) {
        !isEditSession
            ? onFormSubmit(formData, handleReset)
            : onFormSubmit(formData);
    }

    function handleDraftToggle(e) {
        e.preventDefault();
        const newDraftState = !saveAsDraft;
        setValue("saveAsDraft", newDraftState);
        setSearchParams({ save: newDraftState ? "DRAFT" : "ACTIVE" });
    }

    // Styles for draft button states
    const activeDraftButtonStyle = {
        padding: "8px 16px",
        backgroundColor: "#4f46e5", // Active/Selected state - purple
        color: "white",
        border: "1px solid #4338ca",
        borderRadius: "4px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.2s",
    };

    const inactiveDraftButtonStyle = {
        padding: "8px 16px",
        backgroundColor: "#f3f4f6",
        color: "#374151",
        border: "1px solid #d1d5db",
        borderRadius: "4px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.2s",
    };

    return (
        <MultiStepFormContext.Provider
            value={{
                activeStep,
                totalSteps,
                register,
                control,
                errors,
                getValues,
                setValue,
                watch,
            }}
        >
            <div>
                <form
                    className={styles.multiStepForm}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {children}

                    {renderStep(activeStep)}

                    <div className={`sectionDiv ${styles.multiStepBtns}`}>
                        {activeStep === 1 && isEditSession && (
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btnFormNormal"
                            >
                                Back
                            </button>
                        )}
                        {activeStep > 1 && (
                            <button
                                type="button"
                                onClick={handlePreviousStep}
                                className="btnFormNormal"
                            >
                                Previous Step
                            </button>
                        )}
                        {activeStep < totalSteps && (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="btnSubmit"
                            >
                                Next Step
                            </button>
                        )}
                        {activeStep === totalSteps && (
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    type="submit"
                                    className="btnSubmit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Processing..." : "Submit"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDraftToggle}
                                    style={
                                        saveAsDraft
                                            ? activeDraftButtonStyle
                                            : inactiveDraftButtonStyle
                                    }
                                    onMouseOver={(e) => {
                                        if (!saveAsDraft) {
                                            e.target.style.backgroundColor =
                                                "#e5e7eb";
                                        } else {
                                            e.target.style.backgroundColor =
                                                "#4338ca";
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!saveAsDraft) {
                                            e.target.style.backgroundColor =
                                                "#f3f4f6";
                                        } else {
                                            e.target.style.backgroundColor =
                                                "#4f46e5";
                                        }
                                    }}
                                >
                                    {saveAsDraft
                                        ? "Draft Mode"
                                        : "Save as Draft"}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </MultiStepFormContext.Provider>
    );
}
export function useMultiStepForm() {
    const context = useContext(MultiStepFormContext);
    if (context === undefined)
        throw new Error("MultiStepFormContext is used outside MultiStepForm");
    return context;
}

function ProgressBar({ content }) {
    const { activeStep, totalSteps } = useMultiStepForm();

    const progressItemWidth = "auto";
    const progressLineWidth = "1fr";
    const gridColumns =
        `${progressItemWidth} ${progressLineWidth} `.repeat(totalSteps - 1) +
        progressItemWidth;

    return (
        <div
            style={{ gridTemplateColumns: gridColumns }}
            className={styles.progressBar}
        >
            {Array.from({ length: totalSteps }, (_, i) => {
                const num = i + 1;

                const progressItemClass = `${styles.progressItem} ${num === activeStep ? styles.itemActive : num < activeStep ? styles.itemCompleted : ""}`;

                const progressLineClass = `${styles.progressLine} ${num <= activeStep - 2 ? styles.lineActive : ""}`;

                return (
                    <Fragment key={i}>
                        <div className={progressItemClass}>
                            <div className={styles.progressVisual}>
                                {content[i]?.svg || <span>{num}</span>}
                            </div>
                            {content[i]?.title && (
                                <span className={styles.progressTitle}>
                                    {content[i].title}
                                </span>
                            )}
                        </div>
                        {num !== totalSteps && (
                            <span className={progressLineClass}></span>
                        )}
                    </Fragment>
                );
            })}
        </div>
    );
}

function Input({
    type = "text",
    registerName,
    placeholder,
    required = false,
    valueAsNumber = false,
    customValidation,
    label,
    disabled,
}) {
    const { register, errors, getValues } = useMultiStepForm();
    const error = errors?.[registerName]?.message;

    const validations = {
        required: required ? "This field is required" : false,
        valueAsNumber,
        validate: (value) => customValidation?.(value, getValues),
        ...(type === "email" && {
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
            },
        }),
    };

    return (
        <div className={styles.inputContainer}>
            {label && <label>{label}</label>}
            <div className={styles.subContainer}>
                <input
                    disabled={disabled}
                    {...register(registerName, validations)}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                />
                {error && <p className={styles.formError}>{error}</p>}
            </div>
        </div>
    );
}

function InputDatePicker({
    registerName,
    placeholder,
    isYearPicker = false,
    label,
}) {
    const { control } = useMultiStepForm();

    return (
        <div className={styles.inputContainer}>
            {label && <label>{label}</label>}
            <FormInputDatePicker
                control={control}
                registerName={registerName}
                isYearPicker={isYearPicker}
                placeholder={placeholder}
            />
        </div>
    );
}

function InputSelect({
    registerName,
    options,
    required = false,
    valueAsNumber = false,
    label,
    hasGrouping = false,
}) {
    const { register, errors, getValues } = useMultiStepForm();
    const error = errors?.[registerName]?.message;

    return (
        <div className={styles.inputContainer}>
            {label && <label>{label}</label>}
            <div className={styles.subContainer}>
                <FormInputSelect
                    register={register}
                    registerName={registerName}
                    valueAsNumber={valueAsNumber}
                    options={options}
                    required={required}
                    getValues={getValues}
                    hasGrouping={hasGrouping}
                />
                {error && <p className={styles.formError}>{error}</p>}
            </div>
        </div>
    );
}

function InputDataList({
    registerName,
    placeholder,
    data,
    required = false,
    isLoading = false,
    isMulti = false,
    isDisabled = false,
    label,
}) {
    const { control, errors } = useMultiStepForm();
    const error = errors?.[registerName]?.message;

    return (
        <div className={styles.inputContainer}>
            {label && <label>{label}</label>}
            <div className={styles.subContainer}>
                <FormInputDataList
                    control={control}
                    registerName={registerName}
                    data={data}
                    placeholder={placeholder}
                    isLoading={isLoading}
                    isMulti={isMulti}
                    isDisabled={isDisabled}
                    required={required}
                />
                {error && <p className={styles.formError}>{error}</p>}
            </div>
        </div>
    );
}

function InputAsyncDataList({
    registerName,
    placeholder,
    required,
    asyncFunc,
    formatFunc,
    label,
}) {
    const { control, errors } = useMultiStepForm();
    const error = errors?.[registerName]?.message;

    return (
        <div className={styles.inputContainer}>
            {label && <label>{label}</label>}
            <div className={styles.subContainer}>
                <FormInputAsyncDataList
                    control={control}
                    registerName={registerName}
                    placeholder={placeholder}
                    asyncFunc={asyncFunc}
                    formatFunc={formatFunc}
                    required={required}
                />
                {error && <p className={styles.formError}>{error}</p>}
            </div>
        </div>
    );
}

function InputTextArea({
    registerName,
    placeholder,
    required = false,
    maxLength,
    label,
}) {
    const { register, errors, getValues } = useMultiStepForm();
    const [count, setCount] = useState(getValues()[registerName]?.length ?? 0);
    const error = errors?.[registerName]?.message;

    return (
        <div className={`${styles.inputContainer} ${styles.textAreaContainer}`}>
            {label && <label>{label}</label>}
            <div className={styles.subContainer}>
                <textarea
                    {...register(registerName, {
                        required: required ? "This field is required" : false,
                        maxLength: {
                            value: maxLength,
                            message: "Content length exceeded",
                        },
                    })}
                    onChange={(e) => setCount(e.target.value.length)}
                    placeholder={placeholder}
                    required={required}
                    rows={8}
                />
                {error && <p className={styles.formError}>{error}</p>}
                <span className={styles.count}>{`${count}/${maxLength}`}</span>
            </div>
        </div>
    );
}
function InputFile({
    registerName,
    accept,
    multiple = false,
    label,
    qr = false,
}) {
    const { register, watch } = useMultiStepForm();
    const { upload, isUploading } = useUploadImage();
    const agent_id = watch("staff_qr_code_id");
    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (files?.length) {
            if (accept?.includes("image") && !qr) {
                try {
                    upload({
                        files: multiple ? files : files[0],
                        agent_id: agent_id ? agent_id?.value : null,
                    });
                } catch (err) {
                    console.error("Error uploading file:", err);
                }
            } else {
                return files;
            }
        }
    };

    return (
        <div className={styles.inputContainer}>
            {label && <label>{label}</label>}
            <div className={styles.subContainer}>
                <input
                    {...register(registerName)}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                    disabled={isUploading}
                    style={{ cursor: isUploading ? "not-allowed" : "pointer" }}
                />
                {isUploading && (
                    <div className={styles.uploadingIndicator}>
                        <img src="/icons/spinner.svg" alt="Loading..." />
                        <span>Uploading...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
function InputFileV2({
    registerName,
    accept,
    multiple = false,
    label,
    folderName,
}) {
    const { register } = useMultiStepForm();
    const { upload, isUploading } = useUploadImageV2(folderName);

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (files?.length) {
            if (accept?.includes("image")) {
                try {
                    upload(multiple ? files : files[0]);
                } catch (err) {
                    console.error("Error uploading file:", err);
                }
            } else {
                return;
            }
        }
    };

    return (
        <div className={styles.inputContainer}>
            {label && <label>{label}</label>}
            <div className={styles.subContainer}>
                <input
                    {...register(registerName)}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                    disabled={isUploading}
                    style={{ cursor: isUploading ? "not-allowed" : "pointer" }}
                />
                {isUploading && (
                    <div className={styles.uploadingIndicator}>
                        <img src="/icons/spinner.svg" alt="Loading..." />
                        <span>Uploading...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
function InputFileLocal({ registerName, accept, multiple = false, label }) {
    const { register, watch } = useMultiStepForm();
    const fileList = Array.from(watch(registerName) || []);

    return (
        <div className={styles.inputContainer}>
            {label && <label>{label}</label>}
            <div className={styles.subContainer}>
                <input
                    {...register(registerName)}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                />
                {fileList.length !== 0 && (
                    <p className={styles.inputFileCount}>
                        <span>{`${fileList.length} Selected: `}</span>
                        <span>{`${fileList.map((file) => `[${file.name}]`).join(" ")}`}</span>
                    </p>
                )}
            </div>
        </div>
    );
}

function InputFileObd({
    registerName,
    accept,
    multiple = false,
    label,
    folderName,
    onFileUploaded,
}) {
    const { register, setValue } = useMultiStepForm();
    const { upload, isUploading } = useUploadObdFile(folderName);
    const { imageUrl, setImage } = useSingleImageStore();

    // Check localStorage when component mounts
    useEffect(() => {
        const storedUrl = imageUrl;
        if (storedUrl) {
            setImage(storedUrl);
            // Update form value
            setValue(registerName, storedUrl);
            // Notify parent component
            if (onFileUploaded) {
                onFileUploaded(storedUrl);
            }
        }
    }, [onFileUploaded, registerName, setValue]);

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (files?.length) {
            try {
                const url = await upload(multiple ? files : files[0]);
                // Update state immediately when upload is successful
                setImage(url);
                // Update form value
                setValue(registerName, url);
                // Notify parent component
                if (onFileUploaded) {
                    onFileUploaded(url);
                }
            } catch (err) {
                console.error("Error uploading file:", err);
            }
        } else {
            return;
        }
    };

    return (
        <div className={styles.inputContainer}>
            {label && <label>{label}</label>}
            <div className={styles.subContainer}>
                <input
                    {...register(registerName)}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                    disabled={isUploading}
                    style={{ cursor: isUploading ? "not-allowed" : "pointer" }}
                />
                {isUploading && (
                    <div className={styles.uploadingIndicator}>
                        <img src="/icons/spinner.svg" alt="Loading..." />
                        <span>Uploading...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
function InputToggle({ registerName, label, imgUrl, valueToEnable }) {
    const { register, setValue, getValues } = useMultiStepForm();
    const savedState = localStorage.getItem(registerName);
    const [isActive, setIsActive] = useState(() => {
        if (savedState !== null) {
            return savedState === "true";
        }

        const currentValue = getValues()[registerName];
        return currentValue === true || currentValue === valueToEnable;
    });

    useEffect(() => {
        localStorage.setItem(registerName, isActive.toString());
        setValue(registerName, isActive ? valueToEnable : "");
    }, [isActive, registerName, setValue, valueToEnable]);

    const handleToggleChange = (e) => {
        setIsActive(e.target.checked);
    };

    return (
        <div className={`${styles.inputContainer} ${styles.toggleContainer}`}>
            {label && (
                <label htmlFor={`${registerName}Toggle`}>
                    {imgUrl && <img src={imgUrl} />}
                    <span>{label}</span>
                </label>
            )}
            <input
                id={`${registerName}Toggle`}
                type="checkbox"
                {...register(registerName)}
                onChange={handleToggleChange}
            />
            <BtnToggle
                isActive={isActive}
                onToggle={() => setIsActive(!isActive)}
            />
        </div>
    );
}

function InputCheckbox({ registerName, label, required = false }) {
    const { register, setValue, getValues } = useMultiStepForm();
    // const [isActive, setIsActive] = useState(() =>
    //     getValues()[registerName] ? true : false
    // );

    // useEffect(() => {
    //     setValue(registerName, isActive);
    // }, [isActive, registerName, setValue]);

    return (
        <div className={`${styles.inputContainer} ${styles.inputCheckbox}`}>
            {label && (
                <label htmlFor={registerName}>
                    <span>{label}</span>
                </label>
            )}
            <input
                id={registerName}
                type="checkbox"
                {...register(registerName)}
                required={required}
            />
        </div>
    );
}
function InputBuildingDocs({ registerName, accept, multiple = false, label }) {
    const { register } = useMultiStepForm();
    const { upload, isUploading } = useUploadBuildDocs(registerName);

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (files?.length) {
            if (accept?.includes("application/pdf")) {
                try {
                    upload(multiple ? files : files[0]);
                } catch (err) {
                    console.error("Error uploading file:", err);
                }
            } else {
                return;
            }
        }
    };

    return (
        <div className={styles.inputContainer}>
            {label && <label>{label}</label>}
            <div className={styles.subContainer}>
                <input
                    {...register(registerName)}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                    disabled={isUploading}
                    style={{ cursor: isUploading ? "not-allowed" : "pointer" }}
                />
                {isUploading && (
                    <div className={styles.uploadingIndicator}>
                        <img src="/icons/spinner.svg" alt="Loading..." />
                        <span>Uploading...</span>
                    </div>
                )}
            </div>
        </div>
    );
}

MultiStepForm.Input = Input;
MultiStepForm.InputText = Input;
MultiStepForm.InputDatePicker = InputDatePicker;
MultiStepForm.InputSelect = InputSelect;
MultiStepForm.InputDataList = InputDataList;
MultiStepForm.InputAsyncDataList = InputAsyncDataList;
MultiStepForm.InputTextArea = InputTextArea;
MultiStepForm.InputFile = InputFile;
MultiStepForm.InputFileObd = InputFileObd;
MultiStepForm.InputFileLocal = InputFileLocal;
MultiStepForm.InputToggle = InputToggle;
MultiStepForm.InputCheckbox = InputCheckbox;
MultiStepForm.InputBuildingDocs = InputBuildingDocs;
MultiStepForm.ProgressBar = ProgressBar;
MultiStepForm.InputFileV2 = InputFileV2;

export default MultiStepForm;
