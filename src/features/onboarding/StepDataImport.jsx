import ListingArea from "../../features/admin/dataImport/ListingArea";
import ListDeveloper from "../../features/admin/dataImport/ListDeveloper";

function StepDataImport({ setCurrentStep }) {
    function handleNext() {
        setCurrentStep((currentStep) => currentStep + 1);
    }

    return (
        <div>
            <ListingArea isInOnboarding={true} />
            <ListDeveloper isInOnboarding={true} />

            <div
                style={{
                    display: "flex",
                    gap: "3.2rem",
                    justifyContent: "end",
                    padding: "3.2rem 0 0",
                }}
            >
                <button
                    type="button"
                    style={{ fontWeight: "500" }}
                    onClick={handleNext}
                >
                    Skip
                </button>
                <button
                    type="button"
                    className="btnSubmit"
                    onClick={handleNext}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default StepDataImport;
