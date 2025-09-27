import { useForm } from "react-hook-form";
import styles from "./ResetPassForm.module.css";

function ResetPassForm({ name, id, onConfirm, isUpdatingPass, onCloseModal }) {
    const { register, handleSubmit } = useForm();

    function onSubmit(data) {
        onConfirm({ id, payload: data }, { onSettled: onCloseModal });
    }

    return (
        <div className={styles.resetPassForm}>
            <h3>Reset Password</h3>
            <p>{`Please enter new password for "${name}"`}</p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="password" required {...register("new_password")} />
                <div className="btnsContainer">
                    <button
                        onClick={onCloseModal}
                        className="btnFormNormal"
                        type="button"
                        disabled={isUpdatingPass}
                    >
                        Cancel
                    </button>
                    <button
                        className="btnSubmit"
                        type="submit"
                        disabled={isUpdatingPass}
                    >
                        Confirm
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ResetPassForm;
