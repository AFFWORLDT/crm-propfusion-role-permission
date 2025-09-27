import Modal from "../../ui/Modal";
import ViewingFrom from "./ViewingFrom";
import styles from "../followUps/FollowUps.module.css";
import useAllDetails from "../all-details/useAllDetails";

function AddViewingFrom({ propertyId, children }) {
    const { data } = useAllDetails();
    const backgroundColor =   data?.company_settings?.sidebar_color_code || "#020079"
    return (
        <Modal>
            <Modal.Open openWindowName={"addViewing"}>
                <button
                    className={styles.btnAddViewing}
                    style={{
                        backgroundColor: children? backgroundColor: null,
                        color: "white",
                        border: "none",
                        borderRadius: "0.5rem",
                    }}
                >
                    {children || (
                        <>
                            <img src="/icons/add.svg" />
                            <span>Add</span>
                        </>
                    )}
                </button>
            </Modal.Open>
            <Modal.Window overflow={true} name={"addViewing"}>
                <ViewingFrom
                    propertyId={propertyId}
                    isPropertyDropdownShow={children ? true : false}
                />
            </Modal.Window>
        </Modal>
    );
}

export default AddViewingFrom;
