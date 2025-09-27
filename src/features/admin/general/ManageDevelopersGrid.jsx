import styles from "../../developers/DeveloperGrid.module.css";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import Pagination from "../../../ui/Pagination";
import Modal from "../../../ui/Modal";
import useDevelopers from "../../developers/useDevelopers";
import EditDeveloperImageForm from "./EditDeveloperImageForm";

function ManageDevelopersGrid() {
    const { isLoading, data, totalSize, error } = useDevelopers();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    return (
        <>
            {isLoading ? (
                <Spinner type="fullPage" />
            ) : (
                <div className={styles.developerGrid}>
                    {data.map((item) => (
                        <Modal key={item.id}>
                            <Modal.Open openWindowName="editDeveloperImage">
                                <div
                                    className={styles.developerItem}
                                    key={item.id}
                                >
                                    <div className="imgContainer">
                                        <img src={item.logoUrl} />
                                    </div>
                                    <span>{item.name}</span>
                                </div>
                            </Modal.Open>
                            <Modal.Window name="editDeveloperImage">
                                <EditDeveloperImageForm developerData={item} />
                            </Modal.Window>
                        </Modal>
                    ))}
                </div>
            )}

            <Pagination totalSize={totalSize} isLoading={isLoading} />
        </>
    );
}

export default ManageDevelopersGrid;
