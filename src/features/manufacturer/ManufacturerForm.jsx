import { useForm } from "react-hook-form";
import styles from "./ManufacturerForm.module.css";
import useCreateManufacturer from "./useCreateManufacturer";
import FormInputCountries from "../../ui/FormInputCountries";

// eslint-disable-next-line no-unused-vars
const ManufacturerForm = ({ onCloseModal, manufacturerData = {} }) => {
    const { isPending, addManufacturer } = useCreateManufacturer();
    const { register, handleSubmit, formState: { errors }, control } = useForm();

    const onSubmit = (data) => {
        if (data.logo.length === 0) return;
        addManufacturer({
            data: {
                ...data,
                country: data.country.value
            },
            logo: data.logo[0]

        }, { onSettled: onCloseModal });
    };

    return (
        <div    >
            <h2 className={styles.formHeading}>Manufacturer Form</h2>
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

                <div className={styles.formGroup}>
                    <label className={styles.label}>Country</label>
                    <FormInputCountries
                        control={control}
                        registerName="country"
                        placeholder="Select country"
                        required={true}
                    />
                </div>

                <button disabled={isPending} type="submit" className={styles.submitBtn}>{isPending ? "Processing..." : "Submit"}</button>
            </form>
        </div>
    );
};

export default ManufacturerForm;
