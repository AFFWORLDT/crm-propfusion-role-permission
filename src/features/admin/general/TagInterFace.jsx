import { useForm } from "react-hook-form";
import useTags from "../../tags/useTags";
import styles from "./CommonInterFace.module.css";
import useUpdateTags from "../../tags/useUpdateTags";
import { useState } from "react";
import { useEffect } from "react";
import useCreateTags from "../../tags/useCreateTags";
import useDeleteTag from "../../tags/useDeleteTag";
import { useMyPermissions } from "../../../hooks/useHasPermission";

function TagInterFace() {
    const { data, error, isLoading } = useTags("leads");
    const { removeTag } = useDeleteTag();
    const { changeTags } = useUpdateTags();
    const [editingTag, setEditingTag] = useState(null);
    // const { hasPermission } = useMyPermissions();

    if (isLoading)
        return (
            <div className={styles.container}>
                <div className={styles.headerContainer}>
                    <div>
                        <h3
                            className={styles.headerTitle}
                            style={{
                                background: "#333",
                                width: "150px",
                                height: "30px",
                            }}
                        ></h3>
                    </div>
                    <div className={styles.groupsContainer}>
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={styles.groupItem}
                                style={{
                                    background: "#333",
                                    width: "100px",
                                    height: "20px",
                                }}
                            ></div>
                        ))}
                    </div>
                    <div className={styles.headerActions}>
                        <div
                            className={styles.colorPicker}
                            style={{ background: "#333" }}
                        ></div>
                        <div
                            className={styles.textInput}
                            style={{ background: "#333", height: "40px" }}
                        ></div>
                        <div
                            className={styles.actionButton}
                            style={{ background: "#333" }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    if (error) return <div>Error: {error.message}</div>;

    const handleDelete = async (tagId) => {
        try {
            await Promise.all([
                removeTag(tagId),
                changeTags(
                    [...data]
                        .filter((t) => t.id !== tagId)
                        .map((tag, index) => ({
                            ...tag,
                            position: index + 1,
                        }))
                ),
            ]);
        } catch (error) {
            console.error("Error deleting tag:", error);
        }
    };

    const tags = data?.map((tag) => (
        <div
            key={tag.id}
            style={{ border: `1px solid ${tag.color_code}` }}
            className={styles.groupItem}
        >
            <span style={{ marginRight: "10px" }}>{tag?.name}</span>
            { (
                <div>
                    <img
                        src={"/icons/edit.svg"}
                        alt="Edit"
                        className={styles.editIcon}
                        onClick={() => setEditingTag(tag)}
                    />
                    <img
                        src={"/icons/delete.svg"}
                        alt="Delete"
                        className={styles.deleteIcon}
                        onClick={() => handleDelete(tag.id)}
                    />
                </div>
            )}
        </div>
    ));

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div>
                    <h3 className={styles.headerTitle}>Tags</h3>
                </div>

                <div className={styles.groupsContainer}>{tags}</div>

                <TagItemForm
                    totalTagsLength={data?.length || 0}
                    editingTag={editingTag}
                    setEditingTag={setEditingTag}
                />
            </div>
        </div>
    );
}

export default TagInterFace;

const TagItemForm = ({ totalTagsLength, editingTag, setEditingTag }) => {
    const { hasPermission } = useMyPermissions();

    const { addTags, isPending } = useCreateTags();
    const { changeTags, isPending: isUpdating } = useUpdateTags();
    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            color_code: "#000",
            name: "",
            group_type: "leads",
        },
    });

    useEffect(() => {
        if (editingTag) {
            setValue("color_code", editingTag.color_code);
            setValue("name", editingTag.name);
            setValue("group_type", editingTag.group_type);
        }
    }, [editingTag, setValue]);

    const onSubmit = (data) => {
        if (editingTag) {
            const updatedData = {
                ...editingTag,
                ...data,
            };

            changeTags([updatedData], {
                onSuccess: () => {
                    reset();
                    setEditingTag(null);
                },
            });
        } else {
            const formData = {
                ...data,
                tag_type: "leads",
                position: Number(totalTagsLength) + 1,
            };

            addTags([formData], {
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.headerActions}
        >
            <input
                {...register("color_code", {
                    required: "Color is required",
                })}
                type="color"
                className={styles.colorPicker}
                aria-label="Tag color picker"
            />
            <input
                {...register("name", {
                    required: "Name is required",
                    minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters",
                    },
                    maxLength: {
                        value: 50,
                        message: "Name must be less than 50 characters",
                    },
                })}
                type="text"
                placeholder="Title"
                className={styles.textInput}
                aria-label="Tag title input"
            />

            {(hasPermission("manage_tags") || hasPermission("update_tags")) && <button
                type="submit"
                className={styles.actionButton}
                aria-label={editingTag ? "Update tag" : "Add new tag"}
                disabled={isPending || isUpdating}
            >
                {editingTag ? "Update Tag" : "Add Tag"}
            </button>
            }
            {editingTag && (
                <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => {
                        setEditingTag(null);
                        reset();
                    }}
                >
                    Cancel
                </button>
            )}
        </form>
    );
};
