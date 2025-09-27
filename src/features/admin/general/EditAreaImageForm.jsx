import { useForm } from "react-hook-form";
import styles from "../../../styles/EditImageForm.module.css";
import useUpdateAreaImage from "./useUpdateAreaImage";

function EditAreaImageForm({ areaData, onCloseModal }) {
    const { updateAreaImage, isPending } = useUpdateAreaImage();
    const { handleSubmit, register } = useForm();

    function onSubmit(data) {
        if (data.imageFile.length === 0) return;

        updateAreaImage(
            {
                id: areaData.id,
                imageFile: data.imageFile[0],
            },
            { onSettled: onCloseModal }
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.editImageForm}
        >
            <h3>Edit Image</h3>
            <p>Area Name: {areaData.name}</p>
            <input type="file" accept="image/*" {...register("imageFile")} />
            <div className="btnsContainer">
                <button
                    onClick={onCloseModal}
                    className="btnFormNormal"
                    type="button"
                    disabled={isPending}
                >
                    Cancel
                </button>
                <button
                    className="btnSubmit"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? "Processing..." : "Submit"}
                </button>
            </div>
        </form>
    );
}

export default EditAreaImageForm;
