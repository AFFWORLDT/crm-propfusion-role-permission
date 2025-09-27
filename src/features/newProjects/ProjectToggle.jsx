import styles from "./ProjectToggle.module.css";
import { useUpdateProjectPaymentPlan } from "./useUpdateProjectPaymentPlan";

function ProjectToggle({ isActive, data, setPaymentPlanList, paymentPlanList }) {
    const { updatePaymentPlan, isPending } = useUpdateProjectPaymentPlan();

    return (
        <label className={styles.toggleSwitch}>
            <input
                type="checkbox"
                checked={isActive}
                onChange={() => {
                    const updatedData = {
                        ...data,
                        is_active: !isActive,
                    };

                    // If it's an existing payment plan (has an ID)
                    if (data.paymentPlanId) {
                        updatePaymentPlan(
                            {
                                projectId: data.projectId,
                                paymentPlanId: data.paymentPlanId,
                                paymentPlanData: updatedData,
                            },
                            {
                                onSuccess: () => {
                                    setPaymentPlanList((prev) =>
                                        prev.map((item) =>
                                            item.id === data.paymentPlanId
                                                ? {
                                                      ...item,
                                                      is_active: !isActive,
                                                  }
                                                : item
                                        )
                                    );
                                },
                            }
                        );
                    } else {
                        // For new payment plans (no ID yet)
                        setPaymentPlanList((prev) => {
                            const newList = [...prev];
                            newList[data.index] = {
                                ...newList[data.index],
                                is_active: !isActive
                            };
                            return newList;
                        });
                    }
                }}
                disabled={isPending}
            />
            <span className={styles.slider}></span>
        </label>
    );
}

export default ProjectToggle;
