import { useNavigate } from "react-router-dom";
import useUpdateCompanySettings from "../admin/general/useUpdateCompanySettings";

function StepTeam() {
    const navigate = useNavigate();
    const { changeCompanySettings, isPending } = useUpdateCompanySettings();

    function handleCompleteOnboarding() {
        changeCompanySettings(
            { first_time: false },
            { onSettled: () => navigate("/admin/teams") }
        );
    }

    return (
        <div style={{ textAlign: "center" }}>
            <button
                className="btnSubmit"
                onClick={handleCompleteOnboarding}
                disabled={isPending}
            >
                Proceed
            </button>
        </div>
    );
}

export default StepTeam;
