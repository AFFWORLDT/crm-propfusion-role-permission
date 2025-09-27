import styles from "./LeadsItemStage.module.css";
import useStages from "../stages/useStages";
import useUpdateStage from "./useUpdateStage";

function LeadsItemStage({ leadData, target_id }) {
    const { data, isLoading } = useStages("leads");
    const { changeLead } = useUpdateStage();

    if (isLoading) return null;

    // Get the stage details from the latest followup or fallback to the lead's stage
    let stageDetails = leadData?.latest_followup_detailed?.stages || 
        data.filter((stageObj) => stageObj.id === Number(leadData?.stage))[0];

    function handleChangeLeadStage(e) {
        changeLead({
            payload: { target_id: target_id, stages: e.target.value, type: "lead" },
        });
    }

    // Find the stage ID that matches the stage name from latest_followup_detailed
    const currentStageId = data.find(
        stage => stage.name === leadData?.latest_followup_detailed?.stages?.name
    )?.id;

    return (
        <select
            style={{
                color: stageDetails?.color_code ?? "#606266",
                borderColor: stageDetails?.color_code ?? "#606266",
            }}
            className={styles.selectStage}
            value={currentStageId || 0}
            onChange={handleChangeLeadStage}
        >
            <option
                style={{
                    color: "#606266",
                }}
                value={0}
            >
                {leadData?.latest_followup_detailed?.stages?.name || "Select Stage"}
            </option>
            {data.map((stageObj) => (
                <option
                    style={{
                        color: stageObj.color_code,
                    }}
                    key={stageObj.id}
                    value={stageObj.id}
                >
                    {stageObj.name}
                </option>
            ))}
        </select>
    );
}

export default LeadsItemStage;