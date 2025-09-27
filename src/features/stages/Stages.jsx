import { useSearchParams } from "react-router-dom";
import styles from "./Stages.module.css";
import useStages from "./useStages";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "../../ui/Modal";
import EditStagesForm from "./EditStagesForm";

function Stages({ stageType }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isLoading, data, error } = useStages(stageType);
    const currentStage = searchParams.get("stage") ?? "all";

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    function handleStage(stage) {
        stage ? searchParams.set("stage", stage) : searchParams.delete("stage");
        searchParams.set("page", 1);
        setSearchParams(searchParams);
    }

    if (isLoading) return null;

    return (
        <div className={styles.tags}>
            <button
                className={`${styles.btnTag} ${currentStage === "all" ? styles.btnActiveTag : ""}`}
                onClick={() => handleStage(null)}
            >
                All Stages
            </button>

            {data
                .toSorted(
                    (firstObj, secondObj) =>
                        firstObj.position - secondObj.position
                )
                .map((tagObj) => (
                    <button
                        key={tagObj._id}
                        style={{
                            color: tagObj.color_code,
                            borderColor: tagObj.color_code,
                        }}
                        className={`${styles.btnTag} ${currentStage === String(tagObj._id) ? styles.btnActiveTag : ""}`}
                        onClick={() => handleStage(tagObj._id)}
                    >
                        {tagObj.name}
                    </button>
                ))}

            <Modal>
                <Modal.Open openWindowName="editStages">
                    <button className={styles.btnAddTag}>
                        <img src="/icons/edit.svg" />
                    </button>
                </Modal.Open>
                <Modal.Window name="editStages">
                    <EditStagesForm
                        stageType={stageType}
                        dataToEdit={data}
                        onCloseModal={() => setSearchParams({})}
                    />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default Stages;
