import { useEffect, useState } from "react";
import styles from "./EditGroupsForm.module.css";
import useCreateGroups from "./useCreateGroups";
import useUpdateGroups from "./useUpdateGroups";
import useDeleteGroups from "./useDeleteGroups";

function EditStagesForm({ groupType, dataToEdit, onCloseModal }) {
    const [existingGroups, setExistingGroups] = useState(dataToEdit);
    const [groupsToUpdate, setGroupsToUpdate] = useState([]); // to only update changed existing stages
    const [newGroups, setNewGroups] = useState([]);

    const { addGroups, isPending: isCreating } = useCreateGroups();
    const { changeGroups, isPending: isUpdating } = useUpdateGroups();
    const { removeGroup, isPending: isDeleting } = useDeleteGroups();
    const isWorking = isCreating || isUpdating || isDeleting;

    const [selectedColor, setSelectedColor] = useState("#000000");
    const [groupName, setGroupName] = useState("");

    useEffect(() => {
        setExistingGroups(dataToEdit);
    }, [dataToEdit]);

    function handleAddNewStage() {
        if (!groupName.trim()) return;

        const newStage = {
            name: groupName.trim(),
            color_code: selectedColor,
            position: newGroups.length, // Set position based on array length
            group_type: groupType
        };

        setNewGroups([...newGroups, newStage]);
        setSelectedColor("#000000");
        setGroupName("");
    }

    function handleChangeExistingStage(stageObj, index, property) {
        return (e) => {
            const updatedStage = {
                ...stageObj,
                [property]: e.target.value
            };

            setExistingGroups(
                existingGroups.toSpliced(index, 1, updatedStage)
            );

            // Update groupsToUpdate, removing old version if exists
            setGroupsToUpdate(prev => {
                const filtered = prev.filter(item => item._id !== stageObj._id);
                return [...filtered, updatedStage];
            });
        };
    }

    function handleDeleteExistingStage(id) {
        setExistingGroups(prev => prev.filter(stage => stage._id !== id));
        setGroupsToUpdate([]); // Reset updates when deleting
        removeGroup(id);
    }

    function handleSubmit(e) {
        e.preventDefault();

        const promises = [];

        if (newGroups.length) {
            promises.push(addGroups(newGroups));
        }

        if (groupsToUpdate.length) {
            promises.push(changeGroups(groupsToUpdate));
        }

        // If there are changes, wait for all operations to complete
        if (promises.length) {
            Promise.all(promises)
                .then(() => onCloseModal())
                .catch(err => console.error("Error saving stages:", err));
        } else {
            onCloseModal();
        }
    }

    return (
        <div className={styles.editTagsForm}>
            <h3>Modify Groups</h3>
            <form onSubmit={handleSubmit}>
                {existingGroups.map((groupObj, index) => (
                    <div key={groupObj._id} className={styles.tagInputContainer}>
                        <input
                            type="color"
                            value={groupObj.color_code}
                            onChange={handleChangeExistingStage(
                                groupObj,
                                index,
                                "color_code"
                            )}
                        />
                        <input
                            type="text"
                            value={groupObj.name}
                            onChange={handleChangeExistingStage(
                                groupObj,
                                index,
                                "name"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => handleDeleteExistingStage(groupObj._id)}
                            disabled={isWorking}
                        >
                            <img src="/icons/delete.svg" />
                        </button>
                    </div>
                ))}

                {newGroups.map((groupObj, index) => (
                    <div key={index} className={styles.tagInputContainer}>
                        <input
                            type="color"
                            value={groupObj.color_code}
                            onChange={(e) =>
                                setNewGroups(
                                    newGroups.toSpliced(index, 1, {
                                        ...groupObj,
                                        color_code: e.target.value,
                                    })
                                )
                            }
                        />
                        <input
                            type="text"
                            value={groupObj.name}
                            onChange={(e) =>
                                setNewGroups(
                                    newGroups.toSpliced(index, 1, {
                                        ...groupObj,
                                        name: e.target.value,
                                    })
                                )
                            }
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setNewGroups(newGroups.toSpliced(index, 1))
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
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                    />
                    <input
                        style={{ gridColumn: "span 2" }}
                        type="text"
                        placeholder="Enter Stage Name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </div>

                <button
                    className={styles.btnAddNewTag}
                    type="button"
                    onClick={handleAddNewStage}
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
                        {isWorking ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditStagesForm;
