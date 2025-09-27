import Modal from "../../ui/Modal";
import useAllDetails from "../all-details/useAllDetails";
import RentalAgreementForm from "./RentalAgreementForm";
import useCreateRentalAgreement from "./useCreateRentalAgreement";
function AddRentalAgreeMent({ children }) {
    const { addRentalAgreement, isLoading } = useCreateRentalAgreement();
    const { data } = useAllDetails();

    const handleSubmit = (data) => {
        const formData = {
            ...data,
            property_id: data.property_id.value,
            tenant_id: data.tenant_id.value,
            payment_frequency: data.payment_frequency.value,
            number_of_cheques: data.number_of_cheques,
            rent_amount: Number(data.rent_amount),
            security_deposit: Number(data.security_deposit),
            status: "ACTIVE",
            ejari_fees: Number(data.ejari_fees),
            management_fees: Number(data.management_fees),
            broker_fees: Number(data.broker_fees),
            extra_charges: Number(data?.extra_charges),
            ejari_no: data.ejari_no,
        };
        addRentalAgreement(formData);
    };
    return (
        <Modal>
            <Modal.Open openWindowName="add-rental-agreement">
                {children || (
                    <button 
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: data?.company_settings?.sidebar_color_code || "#020079",
                            border: "1px solid #fffafa",
                            borderRadius: "0.5rem",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            color: "#ffffff",
                        }}
                        disabled={isLoading}
                    >
                       + Add Rental Agreement
                    </button>
                )}
            </Modal.Open>
            <Modal.Window name="add-rental-agreement" overflow={true}>
                <RentalAgreementForm
                    onSubmit={handleSubmit}
                    submitButtonText="Add Rental Agreement"
                    isLoading={isLoading}
                />
            </Modal.Window>
        </Modal>
    );
}

export default AddRentalAgreeMent;
