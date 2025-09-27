import toast from "react-hot-toast";
import { useSelectedProperties } from "../../context/SelectedPropertiesContext";
import useTags from "../tags/useTags";
import styles from "./NewPropertyItemTag.module.css";
import useUpdateProperty from "./useUpdateProperty";

function NewPropertyItemTagMultiSelectActions() {
    const { data, isLoading } = useTags("properties");
    const { changeProperty, isPending } = useUpdateProperty();
    const { selectedIds, clearSelection } = useSelectedProperties();

    if (isLoading) return null;

    async function handleChangePropertyTag(e) {
        const selectedTag = e.target.value;
        if (selectedIds.length === 0) {
            toast.error("Please select properties first.");
            return;
        }
        try {
            await Promise.all(
                selectedIds.map((id) =>
                    changeProperty(
                        { id, updatedProperty: { tag: selectedTag } },
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
            onChange={handleChangePropertyTag}
        >
            <option style={{ color: "#606266" }} value={0}>
                Select Tag
            </option>
            {data.map((tagObj) => (
                <option
                    key={tagObj._id}
                    value={tagObj._id}
                    style={{ color: tagObj.color_code }}
                >
                    {tagObj.name}
                </option>
            ))}
        </select>
    );
}

export default NewPropertyItemTagMultiSelectActions;
