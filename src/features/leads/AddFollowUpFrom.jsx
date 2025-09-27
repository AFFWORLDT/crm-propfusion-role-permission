import useCreateFollowUp from "../followUps/useCreateFollowUp.js";
import useStatus from "../status/useStatus.js";
import useRating from "../rating/useRating.js";
import { useForm } from "react-hook-form";
import FormInputDataList from "../../ui/FormInputDataList.jsx";
import styles from "./AddFollowUpFrom.module.css";
import useStages from "../stages/useStages.js";
import useAllDetails from "../all-details/useAllDetails.js";
export function FollowUpForm({ type, targetId, onCloseModal, stage }) {
    const { data: rating, isLoading: isRatingLoading } = useRating("leads");
    const { data: status, isLoading: isStatusLoading } = useStatus("leads");
    const { data: stages, isLoading: isStagesLoading } = useStages("leads");
    const { data } = useAllDetails();
    const bgColor = data?.company_settings?.sidebar_color_code || "#020079";

    const modifiedStatusData = status?.map((status) => ({
        value: status.id,
        label: status.name,
    }));

    const modifiedRatingData = rating?.map((rating) => ({
        value: rating.id,
        label: rating.name,
    }));
    const modifiedStageData = stages?.map((stage) => ({
        value: stage.id,
        label: stage.name,
    }));

    // Current date and time for default values
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD format
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm({
        defaultValues: {
            followupDate: currentDate,
            followupTime: currentTime,
        },
    });
    const { addFollowUp, isPending } = useCreateFollowUp();

    const onSubmit = (data) => {
        const followupDateTime =
            data.followupDate && data.followupTime
                ? `${data.followupDate}T${data.followupTime}`
                : null;

        addFollowUp(
            {
                type,
                target_id: targetId,
                nextfollowupdate: followupDateTime,
                text: data?.text || null,
                stages: data.stages
                    ? data?.stages?.value?.toString()
                    : stage || null,
                rating: data.rating ? data?.rating?.value?.toString() : null,
                status: data.status ? data?.status?.value?.toString() : null,
            },
            {
                onSettled: () => {
                    reset();
                    onCloseModal();
                    // window.location.reload()
                },
            }
        );
    };

    return (
        <div className={styles.followUpForm}>
            <h3>Add {type === "lead" ? "Lead" : "Client"} Follow Up</h3>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles.followUpFormGrid}
            >
                <div>
                    <textarea
                        {...register("text")}
                        placeholder="remark"
                        rows={2}
                        className={styles.textareaField}
                    />
                    {errors.text && (
                        <span className={styles.error}>
                            {errors.text?.message}
                        </span>
                    )}
                </div>

                <div className={styles.followUpDateTimeGroup}>
                    <div className={styles.formFieldGroup}>
                        <label>Follow-up Date</label>
                        <input type="date" {...register("followupDate")} />
                    </div>
                    <div className={styles.formFieldGroup}>
                        <label>Follow-up Time</label>
                        <input type="time" {...register("followupTime")} />
                    </div>
                </div>
                {(errors.followupDate || errors.followupTime) && (
                    <span className={styles.error}>
                        {errors.followupDate?.message ||
                            errors.followupTime?.message}
                    </span>
                )}

                <div className={styles.formFieldGroup}>
                    <label>Rating</label>
                    <FormInputDataList
                        control={control}
                        registerName={"rating"}
                        isLoading={isRatingLoading}
                        isDisabled={isRatingLoading}
                        placeholder={"Rating"}
                        data={modifiedRatingData || []}
                    />
                </div>
                <div className={styles.formFieldGroup}>
                    <label>Status</label>
                    <FormInputDataList
                        control={control}
                        registerName={"status"}
                        isLoading={isStatusLoading}
                        isDisabled={isStatusLoading}
                        placeholder={"Status"}
                        data={modifiedStatusData || []}
                    />
                </div>
                <div className={styles.formFieldGroup}>
                    <label>Stages</label>
                    <FormInputDataList
                        control={control}
                        registerName={"stages"}
                        isLoading={isStagesLoading}
                        placeholder={"Stages"}
                        isDisabled={isStagesLoading}
                        data={modifiedStageData || []}
                    />
                </div>
                <button
                    className={"btnSubmit"}
                    type="submit"
                    disabled={isPending}
                    style={{
                        backgroundColor: bgColor,
                        border: `1px solid ${bgColor}`,
                    }}
                >
                    {isPending ? "Adding..." : "Add"}
                </button>
            </form>
        </div>
    );
}
