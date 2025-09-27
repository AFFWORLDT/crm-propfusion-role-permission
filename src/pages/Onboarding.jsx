import { useEffect, useState } from "react";
import styles from "./Onboarding.module.css";
import StepQuestions from "../features/onboarding/StepQuestions";
import useOnboardingOptions from "../features/onboarding/useOnboardingOptions";
import Spinner from "../ui/Spinner";
import StepCompanyDetails from "../features/onboarding/StepCompanyDetails";
import StepDataImport from "../features/onboarding/StepDataImport";
import StepTeam from "../features/onboarding/StepTeam";
import useCompanySettings from "../features/admin/general/useCompanySettings";
import { useNavigate } from "react-router-dom";

const stepHeadings = [
    "Welcome! We'd love to know a bit more about you...",
    "Welcome! We'd love to know a bit more about you...",
    "Welcome! We'd love to know a bit more about you...",
    "Welcome! We'd love to know a bit more about you...",
    "Add Company Details",
    "Add Areas & Developers",
    "Finally, let's create a Team and then its Staff members...",
];

const TOTAL_STEPS = 7;

function Onboarding() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [responses, setResponses] = useState({});
    const { data: optionsData, isLoading } = useOnboardingOptions();
    const { data: companyData } = useCompanySettings();

    useEffect(() => {
        if (companyData?.first_time === false) {
            navigate("/");
        }
    }, [companyData, navigate]);

    if (isLoading) return <Spinner type="fullPage" />;

    function addResponses(key) {
        return (value) =>
            setResponses((optionsData) => {
                return { ...optionsData, [key]: value };
            });
    }

    function renderStep() {
        switch (currentStep) {
            case 1:
                return (
                    <StepQuestions
                        key="1"
                        question="What kind of work do you do?"
                        options={optionsData.work_types}
                        setCurrentStep={setCurrentStep}
                        addResponse={addResponses("work_types")}
                    />
                );
            case 2:
                return (
                    <StepQuestions
                        key="2"
                        question="What's your role?"
                        options={optionsData.roles}
                        setCurrentStep={setCurrentStep}
                        addResponse={addResponses("roles")}
                    />
                );
            case 3:
                return (
                    <StepQuestions
                        key="3"
                        question="What do you want to achieve with us?"
                        options={optionsData.goals}
                        setCurrentStep={setCurrentStep}
                        addResponse={addResponses("goals")}
                    />
                );
            case 4:
                return (
                    <StepQuestions
                        key="4"
                        question="Where did you hear about us?"
                        options={optionsData.referral_sources}
                        setCurrentStep={setCurrentStep}
                        addResponse={addResponses("referral_sources")}
                        isFinalQuestion={true}
                        finalQuestionKey="referral_sources"
                        previousResponses={responses}
                    />
                );
            case 5:
                return (
                    <StepCompanyDetails
                        key="5"
                        setCurrentStep={setCurrentStep}
                    />
                );
            case 6:
                return (
                    <StepDataImport key="6" setCurrentStep={setCurrentStep} />
                );
            case 7:
                return <StepTeam key="6" />;
            default:
                return null;
        }
    }

    return (
        <section className={styles.onboarding}>
            <div className={styles.onboardingContainer}>
                <div className={styles.onboardingTop}>
                    <div className={styles.currentStep}>
                        <span>{currentStep}</span>
                    </div>
                    <h2>{stepHeadings[currentStep - 1]}</h2>
                </div>
                <div className={styles.onboardingContent}>{renderStep()}</div>
                <div className={styles.progressBar}>
                    {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                        <span
                            key={i}
                            className={
                                i + 1 <= currentStep ? styles.activeStep : ""
                            }
                        ></span>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Onboarding;
