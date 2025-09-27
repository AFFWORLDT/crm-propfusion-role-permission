import Modal from "../../ui/Modal";
import styles from "../../styles/Owner.module.css";
import AddOwner from "../../pages/Owner/AddOwner";

function AddOwnerButton() {
    return (
        <Modal>
            <Modal.Open openWindowName="add-owner">
                <button className={styles.addButton} type="button">
                    + <span className={styles.addOwnerText}> Add Owner</span>
                </button>
            </Modal.Open>
            <Modal.Window name="add-owner" overflow={true}>
                <AddOwner heading="Add Owner" />
            </Modal.Window>
        </Modal>
    );
}

export default AddOwnerButton;
