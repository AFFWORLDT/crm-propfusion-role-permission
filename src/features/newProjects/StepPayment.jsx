import styles from "../../styles/MultiStepForm.module.css";
import MultiStepForm, { useMultiStepForm } from "../../ui/MultiStepForm";
import Table from "../../ui/Table";
import { POOL_TYPES } from "../../utils/constants";
import { useDeleteProjectPaymentPlan } from "./useDeleteProjectPaymentPlan";
import ProjectToggle from "./ProjectToggle";
import EditPaymentPlanButton from "./EditPaymentPlanButton";

// Add CSS for text truncation
const truncateStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "200px",
    display: "inline-block",
};

const INPUT_FIELDS = [
    "first_installment",
    "under_construction",
    "on_handover",
    "post_handover",
    "pay-name",
    "pay-description",
    "first_installment_count",
    "under_construction_count",
    "on_handover_count",
    "post_handover_count",
];

function StepPayment({
    paymentPlanList,
    setPaymentPlanList,
    isEditSession = false,
    projectId,
}) {
    const { watch, setValue, getValues } = useMultiStepForm();
    const firstInstallment = watch("first_installment");
    const underConstruction = watch("under_construction");
    const onHandover = watch("on_handover");
    const postHandover = watch("post_handover");
    const payName = watch("pay-name");
    const isActive = watch("is_active");
    // const payDescription = watch("pay-description");
    // const firstInstallmentCount = watch("first_installment_count");
    // const underConstructionCount = watch("under_construction_count");
    // const onHandoverCount = watch("on_handover_count");
    // const postHandoverCount = watch("post_handover_count");
    const { isDeleting, deletePaymentPlan } = useDeleteProjectPaymentPlan();

    const totalPercent =
        (Number(firstInstallment) || 0) +
        (Number(underConstruction) || 0) +
        (Number(postHandover) || 0) +
        (Number(onHandover) || 0);

    function validatePercent() {
        if (totalPercent === 100) {
            // return true;
        }
        // return "The 'Total Percentage' should be 100%";
    }

    function handleAddPaymentPlan() {
        const newPaymentPlan = {};
        INPUT_FIELDS.forEach((field) => {
            if (field === "pay-name") {
                newPaymentPlan["name"] = getValues()[field];
            } else if (field === "pay-description") {
                newPaymentPlan["description"] = getValues()[field];
            } else {
                const value = getValues()[field];
                // Handle count fields
                if (field.endsWith("_count")) {
                    newPaymentPlan[field] =
                        !isNaN(value) && value !== "" ? Number(value) : 0;
                } else {
                    newPaymentPlan[field] = value || 0;
                }
            }
        });

        // Add is_active field with proper boolean value
        newPaymentPlan["is_active"] = getValues()["is_active"] || false;

        [
            "first_installment",
            "under_construction",
            "on_handover",
            "post_handover",
        ].forEach((field) => {
            newPaymentPlan[field] = Number(newPaymentPlan[field]) || 0;
        });

        setPaymentPlanList([...paymentPlanList, newPaymentPlan]);
        INPUT_FIELDS.forEach((field) => setValue(field, ""));
        setValue("is_active", false); // Reset the toggle after adding
    }

    return (
        <>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <div className={styles.formContainer}>
                    <MultiStepForm.Input
                        registerName="pay-name"
                        type="text"
                        placeholder="Name"
                        label="Name"
                    />
                    <MultiStepForm.Input
                        registerName="pay-description"
                        type="text"
                        placeholder="Description"
                        label="Description"
                    />

                    <MultiStepForm.Input
                        registerName="first_installment"
                        type="number"
                        placeholder="First Installment(in %)"
                        valueAsNumber={true}
                        customValidation={validatePercent}
                        label="First Installment"
                    />

                    <MultiStepForm.Input
                        registerName="first_installment_count"
                        type="number"
                        placeholder="First Installment Count(in months)"
                        valueAsNumber={true}
                        label="First Installment Count"
                    />

                    <MultiStepForm.Input
                        registerName="under_construction"
                        type="number"
                        placeholder="Under Construction (in %)"
                        valueAsNumber={true}
                        customValidation={validatePercent}
                        label="Under Construction"
                    />
                    <MultiStepForm.Input
                        registerName="under_construction_count"
                        type="number"
                        placeholder="Under Construction Count(in months)"
                        valueAsNumber={true}
                        label="Under Construction Count"
                    />
                    <MultiStepForm.Input
                        registerName="on_handover"
                        type="number"
                        placeholder=" On Handover (in %)"
                        valueAsNumber={true}
                        customValidation={validatePercent}
                        label="On Handover "
                    />
                    <MultiStepForm.Input
                        registerName="on_handover_count"
                        type="number"
                        placeholder="On Handover Count (in months)"
                        valueAsNumber={true}
                        label="On Handover Count"
                    />
                    <MultiStepForm.Input
                        registerName="post_handover"
                        type="number"
                        placeholder=" Post Handover (in %)"
                        valueAsNumber={true}
                        customValidation={validatePercent}
                        label="Post Handover"
                    />
                    <MultiStepForm.Input
                        registerName="post_handover_count"
                        type="number"
                        placeholder="Post Handover Count (in months)"
                        valueAsNumber={true}
                        label="Post Handover Count"
                    />
                    <div className={styles.inputContainer}>
                        <label>Total Percentage: </label>
                        <div className={styles.subContainer}>
                            <input
                                type="text"
                                value={`${totalPercent}%`}
                                disabled
                            />
                        </div>
                    </div>

                    <MultiStepForm.InputDataList
                        registerName="pool_type"
                        label="Pool Type"
                        data={POOL_TYPES}
                        placeholder={"Select Pool Type"}
                    />
                    <MultiStepForm.InputToggle
                        registerName="is_active"
                        label="Is Active"
                        placeholder={"Is Active"}
                        valueToEnable={true}
                    />
                </div>
                <button
                    type="button"
                    style={{ justifySelf: "end", marginTop: "3rem" }}
                    className="btnFormNormal"
                    onClick={handleAddPaymentPlan}
                >
                    Add
                </button>
            </div>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img
                        style={{ filter: "saturate(0)" }}
                        src="/icons/grid.svg"
                    />
                    <span>Payment Plans List</span>
                </h3>

                <Table
                    columns="1fr 1fr 1fr 1fr 1fr 1fr 0.5fr 1.6fr" 
                    rowWidth="120rem"
                >
                    <Table.Header>
                        <div>Name</div>
                        <div>Description</div>
                        <div>First Installment</div>
                        <div>Under Construction</div>
                        <div>On Handover</div>
                        <div>Post Handover</div>
                        <div>Active</div>
                        <div>Action</div>
                    </Table.Header>
                    <Table.Body
                        data={paymentPlanList}
                        render={(data, i) => {
                            return (
                                <div key={i}>
                                    <Table.Row>
                                        <span
                                            style={truncateStyle}
                                            title={data.name}
                                        >
                                            {data.name
                                                .split(" ")
                                                .slice(0, 3)
                                                .join(" ")}
                                            {data.name.split(" ").length > 3
                                                ? "..."
                                                : ""}
                                        </span>
                                        <span
                                            style={truncateStyle}
                                            title={data.description}
                                        >
                                            {data.description
                                                .split(" ")
                                                .slice(0, 3)
                                                .join(" ")}
                                            {data.description.split(" ")
                                                .length > 3
                                                ? "..."
                                                : ""}
                                        </span>
                                        <span>
                                            {data.first_installment}% (
                                            {data.first_installment_count}{" "}
                                            months)
                                        </span>
                                        <span>
                                            {data.under_construction}% (
                                            {data.under_construction_count}{" "}
                                            months)
                                        </span>
                                        <span>
                                            {data.on_handover}% (
                                            {data.on_handover_count} months)
                                        </span>
                                        <span>
                                            {data.post_handover}% (
                                            {data.post_handover_count} months)
                                        </span>
                                        <span>
                                            {
                                                <ProjectToggle
                                                    isActive={data.is_active}
                                                    data={{
                                                        ...data,
                                                        projectId,
                                                        paymentPlanId: data.id,
                                                        index: i
                                                    }}
                                                    setPaymentPlanList={setPaymentPlanList}
                                                    paymentPlanList={paymentPlanList}
                                                />
                                            }
                                        </span>
                                        <div className="btnsTableRow">
                                            {
                                                isEditSession &&  data.id && (
                                                   <EditPaymentPlanButton
                                                   paymentPlanId={data.id}
                                                   projectId={projectId}
                                                   defaultValues={data}
                                                   setPaymentPlanList={setPaymentPlanList}
                                                   >
                                                   Edit
                                               </EditPaymentPlanButton>
                                                )
                                            }   
                                            <button
                                                disabled={isDeleting}
                                                type="button"
                                                style={{
                                                    display: "flex",
                                                    gap: ".8rem",
                                                }}
                                                className="btnDeleteRow"
                                                onClick={() => {
                                                    if (
                                                        isEditSession &&
                                                        paymentPlanList[i].id
                                                    ) {
                                                        return deletePaymentPlan(
                                                            {
                                                                projectId,
                                                                paymentPlanId:
                                                                    paymentPlanList[
                                                                        i
                                                                    ].id,
                                                            },
                                                            {
                                                                onSuccess:
                                                                    () => {
                                                                        setPaymentPlanList(
                                                                            paymentPlanList.filter(
                                                                                (
                                                                                    _,
                                                                                    index
                                                                                ) =>
                                                                                    index !==
                                                                                    i
                                                                            )
                                                                        );
                                                                    },
                                                            }
                                                        );
                                                    }
                                                    setPaymentPlanList(
                                                        paymentPlanList.filter(
                                                            (_, index) =>
                                                                index !== i
                                                        )
                                                    );
                                                }}
                                            >
                                                <img
                                                    style={{
                                                        maxWidth: "2rem",
                                                    }}
                                                    src="/icons/delete.svg"
                                                />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </Table.Row>
                                </div>
                            );
                        }}
                    />
                </Table>
            </div>
        </>
    );
}

export default StepPayment;
