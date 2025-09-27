import { useForm } from "react-hook-form";
import styles from "../../styles/FormGrid.module.css";
import useAllDetails from "../all-details/useAllDetails";

function DataBaseForm({
    onCloseModal,
    defaultValues,
    isEditSession,
    onSubmit,
    isWorking,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: defaultValues || {
            name: "",
            description: "",
        },
    });
    const { data } = useAllDetails();
    const bgColor = data?.company_settings?.sidebar_color_code || "#020079";

    const handleFormSubmit = (data) => {
        const payload = {
            name: data.name,
            description: data.description,
        };
        onSubmit(payload);
        onCloseModal?.();
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className={styles.formGrid}
        >
            <h3>{isEditSession ? "Edit Database" : "Create New Database"}</h3>
            <div className={styles.formContainer}>
                <div>
                    <label>Name</label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        className={styles.input}
                    />
                    {errors.name && (
                        <span className={styles.errorText}>
                            {errors.name.message}
                        </span>
                    )}
                </div>

                <div>
                    <label>Description</label>
                    <input
                        {...register("description", { required: "Description is required" })}
                        className={styles.input}
                    />
                    {errors.description && (
                        <span className={styles.errorText}>
                            {errors.description.message}
                        </span>
                    )}
                </div>

                <div className="btnsContainer">
                    <button
                        onClick={onCloseModal}
                        className="btnFormNormal"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        className="btnSubmit"
                        type="submit"
                        disabled={isWorking}
                        style={{
                            backgroundColor: bgColor,
                            border: `1px solid ${bgColor}`,
                        }}
                    >
                        {isWorking
                            ? "Processing..."
                            : isEditSession
                              ? "Update"
                              : "Submit"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default DataBaseForm;
