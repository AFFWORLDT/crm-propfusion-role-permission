import Modal from "../../ui/Modal";
import RentalAgreementForm from "./RentalAgreementForm";
import useCreateRentalAgreement from "./useCreateRentalAgreement";
function AddAgreeMentForProperty({ children

}) {
    const { addRentalAgreement, isLoading, } = useCreateRentalAgreement();
    const handleSubmit = (data) => {
        const formData = {
            ...data,
            property_id: data.property_id.value,
            tenant_id: data.tenant_id.value,
            payment_frequency: data.payment_frequency.value,
            number_of_cheques: data.number_of_cheques.value,
            terms_and_conditions: data.terms_and_conditions,
            rent_amount: data.rent_amount ? Number(data.rent_amount) : null,

        }
        addRentalAgreement(formData, {
           

        });
    }
    return <Modal>
        <Modal.Open openWindowName="add-rental-agreement">
            {children || "Add Rental Agreement"}
        </Modal.Open>
        <Modal.Window name="add-rental-agreement" overflow={true} >
            <RentalAgreementForm onSubmit={handleSubmit} submitButtonText="Add Rental Agreement" isLoading={isLoading} />
        </Modal.Window>


    </Modal>;
}

export default AddAgreeMentForProperty;
