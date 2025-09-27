import { useForm } from "react-hook-form";
import styles from "./DeveloperForm.module.css";
import useCreateDeveloper from "./useCreateDeveloper";

// eslint-disable-next-line no-unused-vars
const DeveloperForm = ({ onCloseModal, developerData = {} }) => {
    const { isPending, addDeveloper } = useCreateDeveloper();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        if (data.logo.length === 0) return;
        addDeveloper({
            name: data.name,
            logo: data.logo[0]
        }, { onSettled: onCloseModal });

    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formHeading}>Developer Form</h2>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className={styles.styledForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Name</label>
                    <input
                        id="name"
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className={`${styles.input} ${errors.name ? styles.errorInput : ""}`}
                    />
                    {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="logo" className={styles.label}>Logo</label>
                    <input
                        id="logo"
                        type="file"
                        {...register("logo", { required: "Logo is required" })}
                        className={`${styles.input} ${errors.logo ? styles.errorInput : ""}`}
                    />
                    {errors.logo && <span className={styles.errorText}>{errors.logo.message}</span>}
                </div>

                <button disabled={isPending} type="submit" className={styles.submitBtn}>{isPending ? "Processing..." : "Submit"}</button>
            </form>
        </div>
    );
};

export default DeveloperForm;
