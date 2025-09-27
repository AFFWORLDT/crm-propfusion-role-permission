import styles from "./LeadsItemStage.module.css";
import useGroups from "../groups/useGroups";
import useUpdateLead from "./useUpdateLead";

function LeadsItemGroups({ leadData }) {
    const { data, isLoading } = useGroups("leads");
    const { changeLead, } = useUpdateLead();


    if (isLoading) return null;

    let groupDetails = data.filter(
        (groupObj) => groupObj.id === Number(leadData?.group)
    )[0];


    function handleChangeLeadGroup(e) {
        changeLead({
            id: leadData.id,
            payload: { ...leadData, group: e.target.value },
        });
    }


    return (
        <select
            style={{
                color: groupDetails?.color_code ?? "#606266",
                borderColor: groupDetails?.color_code ?? "#606266",
            }}
            className={styles.selectStage}
            defaultValue={Number(leadData?.group) || 0}
            onChange={handleChangeLeadGroup}
        >
            <option
                style={{
                    color: "#606266",
                }}
                value={0}
            >
                Select Group
            </option>
            {data.map((groupObj) => (
                <option
                    style={{
                        color: groupObj.color_code,
                    }}
                    key={groupObj.id}
                    value={groupObj.id}
                >
                    {groupObj.name}
                </option>
            ))}
        </select>
    );
}

export default LeadsItemGroups;
