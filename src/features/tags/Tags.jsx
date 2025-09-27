import { useSearchParams } from "react-router-dom";
import styles from "./Tags.module.css";
import useTags from "./useTags";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "../../ui/Modal";
import EditTagsForm from "./EditTagsForm";

function Tags({ tagType }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isLoading, data, error } = useTags(tagType);
    const currentTag = searchParams.get("tag") ?? "all";

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    function handleTag(tag) {
        tag ? searchParams.set("tag", tag) : searchParams.delete("tag");
        searchParams.set("page", 1);
        setSearchParams(searchParams);
    }

    if (isLoading) return null;

    return (
        <div className={styles.tags}>
            <button
                className={`${styles.btnTag} ${currentTag === "all" ? styles.btnActiveTag : ""}`}
                onClick={() => handleTag(null)}
            >
                All
            </button>

            {data
                .toSorted(
                    (firstObj, secondObj) =>
                        firstObj.position - secondObj.position
                )
                .map((tagObj) => (
                    <button
                        key={tagObj.id}
                        style={{
                            color: tagObj.color_code,
                            borderColor: tagObj.color_code,
                        }}
                        className={`${styles.btnTag} ${currentTag === String(tagObj.id) ? styles.btnActiveTag : ""}`}
                        onClick={() => handleTag(tagObj.id)}
                    >
                        {tagObj.name}
                    </button>
                ))}

            <Modal>
                <Modal.Open openWindowName="editTags">
                    <button className={styles.btnAddTag}>
                        <img src="/icons/edit.svg" />
                    </button>
                </Modal.Open>
                <Modal.Window name="editTags">
                    <EditTagsForm tagType={tagType} dataToEdit={data} />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default Tags;
