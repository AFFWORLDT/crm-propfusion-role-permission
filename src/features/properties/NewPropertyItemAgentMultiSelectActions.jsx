import toast from "react-hot-toast";
import { useSelectedProperties } from "../../context/SelectedPropertiesContext";
import useUpdateProperty from "./useUpdateProperty";
import useStaff from "../admin/staff/useStaff";
import styles from "./NewPropertyItemTag.module.css";

function NewPropertyItemAgentMultiSelectActions() {
    const { data: agents, isLoading } = useStaff();
    const { changeProperty, isPending } = useUpdateProperty();
    const { selectedIds, clearSelection } = useSelectedProperties();

    if (isLoading) return null;

    async function handleChangePropertyAgent(e) {
        const selectedAgent = e.target.value;
        if (selectedIds.length === 0) {
            toast.error("Please select properties first.");
            return;
        }
        try {
            await Promise.all(
                selectedIds.map((id) =>
                    changeProperty(
                        { id, updatedProperty: { agent_Id: selectedAgent } },
                        {
                            onSettled: () => {
                                console.log(`Property with id ${id} updated.`);
                            }
                        }
                    )
                )
            );
        } finally {
            clearSelection();
        }
    }

    return (
        <select
            disabled={isPending}
            className={styles.selectTag}
            onChange={handleChangePropertyAgent}
        >
            <option style={{ color: "#606266" }} value={0}>
                Select Agent
            </option>
            {agents?.map((agent) => (
                <option
                    key={agent.id}
                    value={agent.id}
                >
                    {agent.name}
                </option>
            ))}
        </select>
    );
}

export default NewPropertyItemAgentMultiSelectActions;
