import { useNavigate } from "react-router-dom";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Modal from "../../ui/Modal";
import useDeleteLead from "./useDeleteLead";

function DeleteLead({ data, className ,style }) {
    const { removeLead, isPending } = useDeleteLead();
    const navigate = useNavigate();

    return (
        <Modal>
            <Modal.Open openWindowName="deleteLead">
                <button style={style} className={className}>Delete</button>
            </Modal.Open>
            <Modal.Window name="deleteLead">
                <ConfirmDelete
                    resourceName="lead"
                    onConfirm={() =>
                        removeLead(data.id, { onSettled: () => navigate(-1) })
                    }
                    isDeleting={isPending}
                    afterDelete
                />
            </Modal.Window>
        </Modal>
    );
}

export default DeleteLead;
