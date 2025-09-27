import useTags from "../../features/tags/useTags";
import styles from "./WhatsAppLeads.module.css";
import useUpdateLeadTag from "../../features/admin/general/useUpdateLeadTag";

function WhatsAppLeadsTags({ wpleadData }) {
    const { data, isLoading } = useTags("whatsapp_leads");
    const { updateLeadTag, } = useUpdateLeadTag()

    if (isLoading) return null;

    let tagDetails = data.filter(
        (tagObj) => tagObj._id === Number(wpleadData?.tag)
    )[0];


    function handleChangePropertyTag(e) {

        updateLeadTag({ id: wpleadData?.lead_id, tag: e.target.value })
    }

    return (
        <select
            style={{
                color: tagDetails?.color_code ?? "#606266",
                borderColor: tagDetails?.color_code ?? "#606266",
            }}
            className={styles.selectTag}
            defaultValue={Number(wpleadData?.tag) || 0}
            onChange={handleChangePropertyTag}
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
                    key={tagObj._id}
                    value={tagObj._id}
                >
                    {tagObj.name}
                </option>
            ))}
        </select>
    );
}

export default WhatsAppLeadsTags;
