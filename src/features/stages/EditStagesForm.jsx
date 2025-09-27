import { useEffect, useState } from "react";
import styles from "./EditStagesForm.module.css";
import useCreateStages from "./useCreateStages";
import useUpdateStages from "./useUpdateStages";
import useDeleteStages from "./useDeleteStages";

function EditStagesForm({ stageType, dataToEdit, onCloseModal }) {
    const [existingStages, setExistingStages] = useState(dataToEdit);
    const [stagesToUpdate, setStagesToUpdate] = useState([]); // to only update changed existing stages
    const [newStages, setNewStages] = useState([]);

    const { addStages, isPending: isCreating } = useCreateStages();
    const { changeStages, isPending: isUpdating } = useUpdateStages();
    const { removeStage, isPending: isDeleting } = useDeleteStages();
    const isWorking = isCreating || isUpdating || isDeleting;

    const [selectedColor, setSelectedColor] = useState("#000000");
    const [stageName, setStageName] = useState("");

    useEffect(() => {
        setExistingStages(dataToEdit);
    }, [dataToEdit]);

    function handleAddNewStage() {
        if (!stageName.trim()) return;
        
        const newStage = {
            name: stageName.trim(),
            color_code: selectedColor,
            position: newStages.length, // Set position based on array length
            stage_type: stageType
        };

        setNewStages([...newStages, newStage]);
        setSelectedColor("#000000");
        setStageName("");
    }

    function handleChangeExistingStage(stageObj, index, property) {
        return (e) => {
            const updatedStage = {
                ...stageObj,
                [property]: e.target.value
            };

            setExistingStages(
                existingStages.toSpliced(index, 1, updatedStage)
            );

            // Update stagesToUpdate, removing old version if exists
            setStagesToUpdate(prev => {
                const filtered = prev.filter(item => item._id !== stageObj._id);
                return [...filtered, updatedStage];
            });
        };
    }

    function handleDeleteExistingStage(id) {
        setExistingStages(prev => prev.filter(stage => stage._id !== id));
        setStagesToUpdate([]); // Reset updates when deleting
        removeStage(id);
    }

    function handleSubmit(e) {
        e.preventDefault();

        const promises = [];

        if (newStages.length) {
            promises.push(addStages(newStages));
        }

        if (stagesToUpdate.length) {
            promises.push(changeStages(stagesToUpdate));
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
            <h3>Modify Stages</h3>
            <form onSubmit={handleSubmit}>
                {existingStages.map((stageObj, index) => (
                    <div key={stageObj._id} className={styles.tagInputContainer}>
                        <input
                            type="color"
                            value={stageObj.color_code}
                            onChange={handleChangeExistingStage(
                                stageObj,
                                index,
                                "color_code"
                            )}
                        />
                        <input
                            type="text"
                            value={stageObj.name}
                            onChange={handleChangeExistingStage(
                                stageObj,
                                index,
                                "name"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => handleDeleteExistingStage(stageObj._id)}
                            disabled={isWorking}
                        >
                            <img src="/icons/delete.svg" />
                        </button>
                    </div>
                ))}

                {newStages.map((stageObj, index) => (
                    <div key={index} className={styles.tagInputContainer}>
                        <input
                            type="color"
                            value={stageObj.color_code}
                            onChange={(e) =>
                                setNewStages(
                                    newStages.toSpliced(index, 1, {
                                        ...stageObj,
                                        color_code: e.target.value,
                                    })
                                )
                            }
                        />
                        <input
                            type="text"
                            value={stageObj.name}
                            onChange={(e) =>
                                setNewStages(
                                    newStages.toSpliced(index, 1, {
                                        ...stageObj,
                                        name: e.target.value,
                                    })
                                )
                            }
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setNewStages(newStages.toSpliced(index, 1))
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
                        value={stageName}
                        onChange={(e) => setStageName(e.target.value)}
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
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditStagesForm;
