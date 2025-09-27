import { useSearchParams } from "react-router-dom";
import styles from "./Groups.module.css";
import useGroups from "./useGroups";
import { useEffect } from "react";
import toast from "react-hot-toast";
import EditGroupsForm from "./EditGroupsForm";
import Modal from "../../ui/Modal";

function Groups({ groupType }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isLoading, data, error } = useGroups(groupType);
    const currentGroup = searchParams.get("group") ?? "all";

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    function handleStage(group) {
        group ? searchParams.set("group", group) : searchParams.delete("group");
        searchParams.set("page", 1);
        setSearchParams(searchParams);
    }

    if (isLoading) return null;

    return (
        <div className={styles.tags}>
            <button
                className={`${styles.btnTag} ${currentGroup === "all" ? styles.btnActiveTag : ""}`}
                onClick={() => handleStage(null)}
            >
                All Groups
            </button>

            {data
                .toSorted(
                    (firstObj, secondObj) =>
                        firstObj.position - secondObj.position
                )
                .map((groupObj) => (
                    <button
                        key={groupObj._id}
                        style={{
                            color: groupObj.color_code,
                            borderColor: groupObj.color_code,
                        }}
                        className={`${styles.btnTag} ${currentGroup === String(groupObj._id) ? styles.btnActiveTag : ""}`}
                        onClick={() => handleStage(groupObj._id)}
                    >
                        {groupObj.name}
                    </button>
                ))}

            <Modal>
                <Modal.Open openWindowName="editGroups">
                    <button className={styles.btnAddTag}>
                        <img src="/icons/edit.svg" />
                    </button>
                </Modal.Open>
                <Modal.Window name="editGroups">
                    <EditGroupsForm
                        groupType={groupType}
                        dataToEdit={data}
                        onCloseModal={() => setSearchParams({})}
                    />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default Groups;
