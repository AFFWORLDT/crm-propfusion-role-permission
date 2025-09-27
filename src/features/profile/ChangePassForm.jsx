import { useForm } from "react-hook-form";
import styles from "../../styles/FormGrid.module.css";
import useUpdatePass from "../admin/staff/useUpdatePass";

function ChangePassForm({ id }) {
    console.log(id);
    const { changePass, isPending } = useUpdatePass();
    const { register, handleSubmit, reset } = useForm();

    function onSubmit(data) {
        if (data.confirmNew !== data.new_password) return;
        changePass({ id, payload: { new_password: data.new_password } });
    }

    return (
        <form className={styles.formGrid} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formContainer}>
                <div>
                    <label>Old Password</label>
                    <input type="password" required />
                </div>
                <div>
                    <label>New Password</label>
                    <input
                        type="password"
                        required
                        {...register("new_password")}
                    />
                </div>
                <div>
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        required
                        {...register("confirmNew")}
                    />
                </div>

                <div className="btnsContainer">
                    <button
                        onClick={() => reset()}
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
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
}

export default ChangePassForm;
