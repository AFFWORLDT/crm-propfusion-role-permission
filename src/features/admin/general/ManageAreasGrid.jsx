import styles from "../../areas/AreaGrid.module.css";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import Pagination from "../../../ui/Pagination";
import Modal from "../../../ui/Modal";
import useAreas from "../../areas/useAreas";
import EditAreaImageForm from "./EditAreaImageForm";

function ManageAreasGrid() {
    const { isLoading, data, totalSize, error } = useAreas();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    return (
        <>
            {isLoading ? (
                <Spinner type="fullPage" />
            ) : (
                <div className={styles.areaGrid}>
                    {data.map((item) => (
                        <Modal key={item.id}>
                            <Modal.Open openWindowName="editAreaImage">
                                <div
                                    className={`imgContainer ${styles.areaItem}`}
                                >
                                    <img
                                        src={
                                            !item.imgUrl?.includes("http")
                                                ? `https${item.imgUrl}`
                                                : `${item.imgUrl}`
                                        }
                                    />
                                    <div className={styles.areaName}>
                                        <span>{item.name}</span>
                                    </div>
                                </div>
                            </Modal.Open>
                            <Modal.Window name="editAreaImage">
                                <EditAreaImageForm areaData={item} />
                            </Modal.Window>
                        </Modal>
                    ))}
                </div>
            )}

            <Pagination totalSize={totalSize} isLoading={isLoading} />
        </>
    );
}

export default ManageAreasGrid;
