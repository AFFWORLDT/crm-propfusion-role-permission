import Modal from "../../ui/Modal";
import useAllDetails from "../all-details/useAllDetails";
import AddNewOwner from "./AddNewOwner";

function AddNewOwnerButton() {
    const {data}=useAllDetails()
    return (
        <Modal>
            <Modal.Open openWindowName="add-owner">
                <button  type="button" className="btnSubmit"
                style={{
                    backgroundColor: data?.company_settings?.sidebar_color_code || "#020079",
                    border: `1px solid ${data?.company_settings?.sidebar_color_code || "#020079"}`,
                }}
                >
                    + <span > Add Owner</span>
                </button>
            </Modal.Open>
            <Modal.Window name="add-owner" overflow={true}>
                <AddNewOwner heading="Add Owner" />
            </Modal.Window>
        </Modal>
    );
}

export default AddNewOwnerButton;
