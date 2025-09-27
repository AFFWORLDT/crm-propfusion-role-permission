import { PencilIcon } from "lucide-react";
import Modal from "../../ui/Modal";
import CustomerForm from "./CustomerForm";
import useUpdateCustomer from "./useUpdateCustomer";
function EditCustomerButton({ customerId, customerData }) {
   
    const { update, isUpdating } = useUpdateCustomer();
    const handleSubmit = (data) => {
        update({ id: customerId, customerData: data });
    };
    const commonButtonStyles = {
        padding: "6px 12px",
        borderRadius: "8px",
        backgroundColor: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "14px",
        fontWeight: "800",
        transition: "all 0.2s ease",
    };
    return (
        <Modal>
            <Modal.Open openWindowName="add-customer">
                <button
                className="E"
                    style={{
                        ...commonButtonStyles,
                        border: "0.1px dashed #001535",
                        color: "#00050e",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#e8f1ff";
                        e.target.style.color = "#00050e";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "#00050e";
                    }}
                >
                    <PencilIcon size={16} /> 
                </button>
            </Modal.Open>
            <Modal.Window name="add-customer" overflow="auto">
                <CustomerForm
                    onSubmit={handleSubmit}
                    isWorking={isUpdating}
                    isEditSession={Boolean(customerData)}
                    defaultValues={{
                        project_name: customerData["Project name"],
                        unit_number: customerData["Unit number"],
                        name: customerData["Name"],
                        Rooms: customerData["Rooms"],
                        total_area: customerData["Total area"],
                        nationality: customerData["Nationality"],
                        email: customerData["E-mail"],
                        contact_number: customerData["Contact number"],
                        second_number: customerData["Second number"],
                        agent_id: customerData["agent_id"],
                        area_id: customerData["area_id"],
                    }}
                />
            </Modal.Window>
        </Modal>
    );
}

export default EditCustomerButton;
