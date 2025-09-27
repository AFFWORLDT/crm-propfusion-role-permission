import { useForm } from "react-hook-form";
import styles from "../../../styles/FormGrid.module.css";
import useStaff from "./useStaff";
import FormInputDataList from "../../../ui/FormInputDataList";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import useUpdateBulkAgent from "./useUpdateBulkAgent";

function ChangeStaffForm({ closeModal }) {
    const { data: staffData, isLoading: isLoadingStaff } = useStaff();
    const {
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm({});
    const { currentUser } = useAuth();
    const { isPending, updateBulkAgent } = useUpdateBulkAgent();

    const staffOptions = staffData.map((item) => {
        return { value: item.id, label: item.name };
    });
    const currentUserId = currentUser?.id;

    const onSubmit = (data) => {
        if (!data.propertyAgent && !data.leadAgent) {
            toast.error("Please select at least one agent to replace with");
            return;
        }

        if (data.staff.value === data.propertyAgent?.value) {
            toast.error("Please select different staff");
            setError("staff", { message: "Please select different staff" });
            return;
        }

        if (data.staff.value === data.leadAgent?.value) {
            toast.error("Please select different staff");
            setError("staff", { message: "Please select different staff" });
            return;
        }

        if (data.staff.value === currentUserId) {
            toast.error("You cannot change your own staff");
            setError("staff", { message: "You cannot change your own staff" });
            return;
        }

        if (data.propertyAgent) {
            updateBulkAgent({
                agentIdToReplace: data.staff.value,
                agentIdToReplaceWith: data.propertyAgent.value,
                type: "property",
            });
        }

        if (data.leadAgent) {
            updateBulkAgent({
                agentIdToReplace: data.staff.value,
                agentIdToReplaceWith: data.leadAgent.value,
                type: "lead",
            });
        }

        toast.success("Staff updated successfully!");
        closeModal();
    };

    return (
        <div className={styles.bodyContainer}>
            <form className={styles.formGrid} onSubmit={handleSubmit(onSubmit)}>
            <h2>Change Staff</h2>
                <div className="mt-5">
                    <label htmlFor="staff"> Select Agent to change</label>
                    <FormInputDataList
                        id="staff"
                        control={control}
                        data={staffOptions || []}
                        placeholder={"Select Agent for Property"}
                        registerName={"staff"}
                        required={true}
                        isDisabled={isPending}
                        isLoading={isLoadingStaff}
                    />
                    {errors.staff && (
                        <span className="text-red-500">
                            {errors.staff.message}
                        </span>
                    )}
                </div>

                <div className="mt-5">
                    <label htmlFor="propertyAgent">
                        {" "}
                        Select Agent for Property
                    </label>
                    <FormInputDataList
                        id="propertyAgent"
                        control={control}
                        data={staffOptions || []}
                        placeholder={"Select Agent for Property"}
                        registerName={"propertyAgent"}
                        isDisabled={isPending}
                        isLoading={isLoadingStaff}
                    />
                </div>

                <div className="mt-5">
                    <label htmlFor="leadAgent"> Select Agent for Lead</label>
                    <FormInputDataList
                        id="leadAgent"
                        control={control}
                        data={staffOptions || []}
                        placeholder={"Select Agent for Lead"}
                        registerName={"leadAgent"}
                        isDisabled={isPending}
                        isLoading={isLoadingStaff}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "end",
                        marginTop: "2.8rem",
                    }}
                >
                    <button
                        className="btnSubmit"
                        type="submit"
                        disabled={isPending}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChangeStaffForm;
