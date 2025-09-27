import styles from "../../styles/BtnAdd.module.css";
import Modal from "../../ui/Modal";
import ManufacturerForm from "./ManufacturerForm";

export default function AddManufacturer() {
    return (
        <Modal>
            <Modal.Open openWindowName="addManufacturer">
                <button className={styles.btnAdd}>
                    <img src="/icons/add.svg" />
                    <span>Add</span>
                </button>
            </Modal.Open>
            <Modal.Window name="addManufacturer" overflow={true}>
                <ManufacturerForm />
            </Modal.Window>
        </Modal>
    );
}

