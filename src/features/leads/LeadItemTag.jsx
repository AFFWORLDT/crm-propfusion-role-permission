import styles from "./LeadItemTag.module.css";
import useTags from "../tags/useTags";
import useUpdateLead from "./useUpdateLead";

function LeadItemTag({ leadData }) {
    const { data, isLoading } = useTags("leads");
    const { changeLead, isPending } = useUpdateLead();

    if (isLoading) return null;

    let tagDetails = data.filter(
        (tagObj) => tagObj.id === Number(leadData.tag)
    )[0];

    function handleChangeLeadTag(e) {
        changeLead({
            id: leadData.id,
            payload: { ...leadData, tag: e.target.value },
        });
    }

    return (
        <select
        disabled={isPending}
            style={{
                color: tagDetails?.color_code ?? "#606266",
                borderColor: tagDetails?.color_code ?? "#606266",
            }}
            className={styles.selectTag}
            defaultValue={Number(leadData.tag) || 0}
            onChange={handleChangeLeadTag}
            // disabled={isPending}
        >
            <option
                style={{
                    color: "#606266",
                }}
                value={0}
            >
                Select Tag
            </option>
            {data.map((tagObj) => (
                <option
                    style={{
                        color: tagObj.color_code,
                    }}
                    key={tagObj.id}
                    value={tagObj.id}
                >
                    {tagObj.name}
                </option>
            ))}
        </select>
    );
}

export default LeadItemTag;
