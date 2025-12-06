import { useForm } from "react-hook-form";
import styles from "./ConfirmDelete.module.css";
import FormInputDataList from "./FormInputDataList";
import useUpdateBulkAgent from "../features/admin/staff/useUpdateBulkAgent";
import useStaff from "../features/admin/staff/useStaff";
import toast from "react-hot-toast";
import useAllDetails from "../features/all-details/useAllDetails";

function ConfirmDelete({ resourceName, onConfirm, isDeleting, onCloseModal }) {
    return (
        <div className={styles.confirmDelete}>
            <h3>Delete {resourceName}</h3>
            <p>
                Are you sure you want to delete this {resourceName} permanently?
                This action cannot be undone.
            </p>

            <div className="btnsContainer">
                <button
                    onClick={onCloseModal}
                    className="btnFormNormal"
                    disabled={isDeleting}
                >
                    Cancel
                </button>
                <button
                    onClick={
                        () => {
                            onConfirm()
                            onCloseModal()
                        }
                    }
                    className="btnDelete"
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );
}

export default ConfirmDelete;

export function ConfirmDeleteWithAgentForm({
    resourceName,
    onConfirm,
    isDeleting,
    onCloseModal,
    agentIdToReplace,
    staffName,
}) {
    const { control, handleSubmit } = useForm();
    const { updateBulkAgent, isPending, error } = useUpdateBulkAgent();
    const { data: staffData, isLoading: isLoadingStaff } = useStaff();

    // Prepare staff options for dropdowns
    const staffOptions = staffData?.map((item) => {
        return { value: item.id, label: item.name };
    });

    const onSubmit = (data) => {
        if (!data.propertyAgent && !data.leadAgent) {
            toast.error("Please select at least one agent to replace with");
            return;
        }

        if (data.propertyAgent) {
            updateBulkAgent(
                {
                    agentIdToReplace: agentIdToReplace,
                    agentIdToReplaceWith: data.propertyAgent.value,
                    type: "property",
                },
                {
                    onSettled: onCloseModal(),
                }
            );
        }

        if (data.leadAgent) {
            updateBulkAgent(
                {
                    agentIdToReplace: agentIdToReplace,
                    agentIdToReplaceWith: data.leadAgent.value,
                    type: "lead",
                },
                {
                    onSettled: onCloseModal(),
                }
            );
        }
        onConfirm();

        toast.success("Staff updated successfully!");
    };

    return (
        <div className={styles.confirmDeleteForAgent}>
            <h3>⚠️ Delete {resourceName}</h3>
            {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
            <p>
                Are you sure you want to permanently delete this {resourceName}
                {staffName && <strong style={{ color: "#dc2626", fontWeight: "600" }}> &quot;{staffName}&quot;</strong>}?
                This action cannot be undone. All agent data will be transferred
                to the newly selected agent.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="leadAgent">
                        {" "}
                        Select Agent for Property
                    </label>

                    <FormInputDataList
                        control={control}
                        data={staffOptions || []}
                        placeholder={"Select Agent for Property"}
                        registerName={"propertyAgent"}
                        isDisabled={isDeleting || isLoadingStaff || isPending}
                        isLoading={isLoadingStaff}
                    />
                </div>

                <div style={{ marginTop: "20px" }}>
                    <label htmlFor="leadAgent"> Select Agent for Lead</label>
                    <FormInputDataList
                        control={control}
                        data={staffOptions || []}
                        placeholder={"Select Agent for Lead"}
                        registerName={"leadAgent"}
                        isDisabled={isDeleting || isLoadingStaff || isPending}
                        isLoading={isLoadingStaff}
                    />
                </div>

                <div className="btnsContainer">
                    <button
                        type="button"
                        onClick={onCloseModal}
                        className="btnFormNormal"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btnDelete"
                        disabled={isDeleting}
                    >
                        Delete
                    </button>
                </div>
            </form>
        </div>
    );
}

export function ConfirmDeActivate({
    resourceName,
    onConfirm,
    isDeleting,
    onCloseModal,
}) {
    return (
        <div className={styles.confirmDelete}>
            <h3>Deactivate {resourceName}</h3>
            <p>
                Are you sure you want to deactivate this property from this
                portal? You can always reactivate it later.
            </p>

            <div className="btnsContainer">
                <button
                    onClick={onCloseModal}
                    className="btnFormNormal"
                    disabled={isDeleting}
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="btnDelete"
                    disabled={isDeleting}
                >
                    Deactivate
                </button>
            </div>
        </div>
    );
}

export function AssignOwnerForm({
    resourceName,
    onConfirm,
    isPending,
    onCloseModal,
}) {
    const { control, handleSubmit } = useForm();
    const { data: staffData, isLoading: isLoadingStaff } = useStaff();
    const {data:allDetails}=useAllDetails()
const backgroundColor=allDetails?.company_settings?.sidebar_color_code

    const staffOptions = staffData?.map((item) => {
        return { value: item.id, label: item.name };
    });

    const onSubmit = async (data) => {
        onCloseModal();
        await onConfirm(data);
    };

    return (
        <div className={styles.confirmDelete}>
            <h3>Assign New Agent</h3>
            <p>Please select a new agent to assign to this {resourceName}.</p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <FormInputDataList
                    control={control}
                    registerName="newOwnerId"
                    rules={{ required: "Please select a new agent" }}
                    label="New Agent"
                    placeholder="Select new agent"
                    data={staffOptions || []}
                    isDisabled={isPending || isLoadingStaff}
                    isLoading={isLoadingStaff}
                    required={true}
                />

                <div className="btnsContainer">
                    <button
                        type="button"
                        onClick={onCloseModal}
                        className="btnFormNormal"
                        disabled={isPending}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btnSubmit"
                        disabled={isPending}
                        style={{ backgroundColor: backgroundColor }}
                    >
                        {isPending ? "Assigning..." : "Assign Agent"}
                    </button>
                </div>
            </form>
        </div>
    );
}
export function ConfirmApiCall({
    resourceName,
    onConfirm,
    isLoading,
    onCloseModal,
    children,
}) {
    return (
        <div className={styles.confirmDelete}>
            <h3> {resourceName}</h3>
            <p>
                Are you sure you want to refresh listing ? This action will
                update the listing information.
            </p>
            <div>{children}</div>

            <div className="btnsContainer">
                <button
                    onClick={onCloseModal}
                    className="btnFormNormal"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        onConfirm();
                        onCloseModal();
                    }}
                    className="btnSubmit"
                    disabled={isLoading}
                >
                    Process
                </button>
            </div>
        </div>
    );
}
