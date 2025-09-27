import { useEffect, useState } from "react";
import styles from "./EditTagsForm.module.css";
import useCreateTags from "./useCreateTags";
import useUpdateTags from "./useUpdateTags";
import useDeleteTag from "./useDeleteTag";

function EditTagsForm({ tagType, dataToEdit, onCloseModal }) {
    const [existingTags, setExistingTags] = useState(dataToEdit);
    const [updatedTags, setUpdatedTags] = useState([]); // to only update changed existing tags
    const [newTags, setNewTags] = useState([]);

    const { addTags, isPending: isCreating } = useCreateTags();
    const { changeTags, isPending: isUpdating } = useUpdateTags();
    const { removeTag, isPending: isDeleting } = useDeleteTag();
    const isWorking = isCreating || isUpdating || isDeleting;

    const [color, setColor] = useState("#000000");
    const [name, setName] = useState("");

    useEffect(() => {
        setExistingTags(dataToEdit);
    }, [dataToEdit]);

    function handleAddNewTag() {
        if (!name) return;
        setNewTags([
            ...newTags,
            { name, color_code: color, position: 0, tag_type: tagType },
        ]);
        setColor("#000000");
        setName("");
    }

    function handleChangeExistingTag(tagObj, index, property) {
        return (e) => {
            setExistingTags(
                existingTags.toSpliced(index, 1, {
                    ...tagObj,
                    [property]: e.target.value,
                })
            );

            // Remove the previously updated version in updatedTags
            setUpdatedTags([
                ...updatedTags.filter((item) => item.id !== tagObj.id),
                {
                    ...tagObj,
                    [property]: e.target.value,
                },
            ]);
        };
    }

    function handleDeleteExistingTag(id) {
        // remove all updated tag if any one is deleted
        setUpdatedTags([]);
        removeTag(id);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (newTags.length) addTags(newTags, { onSettled: onCloseModal });

        if (updatedTags.length)
            changeTags(updatedTags, { onSettled: onCloseModal });

        if (!newTags.length && !updatedTags.length) onCloseModal();
    }

    return (
        <div className={styles.editTagsForm}>
            <h3>Modify Tags</h3>
            <form onSubmit={handleSubmit}>
                {existingTags.map((tagObj, index) => (
                    <div key={tagObj.id} className={styles.tagInputContainer}>
                        <input
                            type="color"
                            value={tagObj.color_code}
                            onChange={handleChangeExistingTag(
                                tagObj,
                                index,
                                "color_code"
                            )}
                        />
                        <input
                            type="text"
                            value={tagObj.name}
                            onChange={handleChangeExistingTag(
                                tagObj,
                                index,
                                "name"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => handleDeleteExistingTag(tagObj.id)}
                            disabled={isWorking}
                        >
                            <img src="/icons/delete.svg" />
                        </button>
                    </div>
                ))}

                {newTags.map((tagObj, index) => (
                    <div key={index} className={styles.tagInputContainer}>
                        <input
                            type="color"
                            value={tagObj.color_code}
                            onChange={(e) =>
                                setNewTags(
                                    newTags.toSpliced(index, 1, {
                                        ...tagObj,
                                        color_code: e.target.value,
                                    })
                                )
                            }
                        />
                        <input
                            type="text"
                            value={tagObj.name}
                            onChange={(e) =>
                                setNewTags(
                                    newTags.toSpliced(index, 1, {
                                        ...tagObj,
                                        name: e.target.value,
                                    })
                                )
                            }
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setNewTags(newTags.toSpliced(index, 1))
                            }
                            disabled={isWorking}
                        >
                            <img src="/icons/delete.svg" />
                        </button>
                    </div>
                ))}

                <div className={styles.tagInputContainer}>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                    <input
                        style={{ gridColumn: "span 2" }}
                        type="text"
                        placeholder="Enter Tag Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <button
                    className={styles.btnAddNewTag}
                    type="button"
                    onClick={handleAddNewTag}
                >
                    <span>Add</span>
                    <img src="/icons/add.svg" alt="" />
                </button>

                <div className="btnsContainer">
                    <button
                        className="btnFormNormal"
                        type="button"
                        onClick={onCloseModal}
                        disabled={isWorking}
                    >
                        Cancel
                    </button>
                    <button
                        className="btnSubmit"
                        type="submit"
                        disabled={isWorking}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditTagsForm;
