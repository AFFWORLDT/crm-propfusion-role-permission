import useTags from "../tags/useTags";
import styles from "./NewPropertyItemTag.module.css";
import useUpdateProperty from "./useUpdateProperty";

function NewPropertyItemTag({ propertyData }) {
    const { data, isLoading } = useTags("properties");
    const { changeProperty, isPending } = useUpdateProperty();

    if (isLoading) return null;

    let tagDetails = data.filter(
        (tagObj) => tagObj.id === Number(propertyData.tag)
    )[0];

    function handleChangePropertyTag(e) {
        changeProperty({
            id: propertyData.id,
            updatedProperty: { ...propertyData, tag: e.target.value },
        });
    }

    return (
        <select
            style={{
                color: tagDetails?.color_code ?? "#606266",
                borderColor: tagDetails?.color_code ?? "#606266",
            }}
            className={styles.selectTag}
            defaultValue={Number(propertyData.tag) || 0}
            onChange={handleChangePropertyTag}
            disabled={isPending}
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

export default NewPropertyItemTag;
