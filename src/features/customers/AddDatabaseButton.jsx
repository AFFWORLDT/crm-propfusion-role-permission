import Modal from "../../ui/Modal";
import useCreateDatabase from "./useCreateDatabase";
import styles from "./UploadExcelForm.module.css";
import DataBaseForm from "./DataBaseForm";
import useAllDetails from "../all-details/useAllDetails";
function AddDatabaseButton() {
    const { create, isCreating } = useCreateDatabase();
    const { data } = useAllDetails();
    const bgColor = data?.company_settings?.sidebar_color_code || "#020079";
    const handleSubmit = (data) => {
        create(data);
    };
    return (
        <Modal>
            <Modal.Open openWindowName="add-customer" >
                <button className={`btnSubmit`} style={{
                        backgroundColor: bgColor,
                        border: `1px solid ${bgColor}`,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                    }}
                >
                    <svg
                        className={styles.buttonIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    <span>Add Database</span>
                </button>
            </Modal.Open>

            <Modal.Window name="add-customer" overflow={true}>
                <DataBaseForm onSubmit={handleSubmit} isWorking={isCreating} />
            </Modal.Window>
        </Modal>
    );
}

export default AddDatabaseButton;
