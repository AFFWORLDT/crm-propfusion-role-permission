import Modal from "../../ui/Modal"
import ViewingFrom from "./ViewingFrom"
import styles from "../followUps/FollowUps.module.css";
import { Pencil } from 'lucide-react'

function EditViewingFrom({ viewingId, defaultData }) {
    return (
        <Modal>
            <Modal.Open openWindowName={"editViewing"}>
                
            <button className={styles.actionButton} title="Edit">
              <Pencil size={18} />
            </button>
            </Modal.Open>
            <Modal.Window overflow={true} name={"editViewing"}>
                <ViewingFrom viewingId={viewingId} isEditing={true} defaultData={defaultData} />
            </Modal.Window>
        </Modal>
    )
}

export default EditViewingFrom 