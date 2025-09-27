import { useState } from "react";
import Select from "react-select";
import styles from "./StepQuestions.module.css";
import useSaveOnboardingResponses from "./useSaveOnboardingResponses";

function StepQuestions({
    question,
    options,
    setCurrentStep,
    addResponse,
    isFinalQuestion = false,
    finalQuestionKey,
    previousResponses,
}) {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const { saveResponses, isPending } = useSaveOnboardingResponses();

    const optionsData = options.map((option) => {
        return { label: option, value: option };
    });

    function handleNext() {
        const newOptions = selectedOptions.map((option) => option.value);
        if (!newOptions.length) return;
        addResponse(newOptions);

        if (isFinalQuestion) {
            return saveResponses(
                { ...previousResponses, [finalQuestionKey]: newOptions },
                {
                    onSettled: () =>
                        setCurrentStep((currentStep) => currentStep + 1),
                }
            );
        }

        setCurrentStep((currentStep) => currentStep + 1);
    }

    return (
        <div className={styles.stepQuestions}>
            <h3 className={styles.subHeading}>{question}</h3>
            <Select
                isMulti
                options={optionsData}
                styles={{
                    container: (provided) => ({
                        ...provided,
                        fontSize: "1.8rem",
                    }),
                }}
                onChange={setSelectedOptions}
                required
                isDisabled={isPending}
            />
            <button
                type="button"
                className="btnSubmit"
                onClick={handleNext}
                disabled={isPending}
            >
                Next
            </button>
        </div>
    );
}

export default StepQuestions;
