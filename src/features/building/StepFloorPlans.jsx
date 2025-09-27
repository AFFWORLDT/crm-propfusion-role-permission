import styles from "../../styles/MultiStepForm.module.css";
import MultiStepForm, { useMultiStepForm } from "../../ui/MultiStepForm";
import {
    BEDROOM_NUM_OPTIONS,
    POOL_TYPES,
    PROPERTY_TYPES,
} from "../../utils/constants";
import Table from "../../ui/Table";
import useDeleteFloorPlan from "./useDeleteFloorPlan";
import { formatNum } from "../../utils/utils";

const INPUT_FIELDS = [
    "floorPlanTitle",
    "floorPlanBedroom",
    "floorPlanPrice",
    "floorPlanSize",
    "floorPlanLayout",
];

/* 
    This form is managed separately from react-hook-form as its
    fields are not directly required for final submission or 
    validation but to construct an array of nested objects
    which will then be submitted.
*/
/*
    For "isEditSession=true", if objects inside "floorPlanList"
    contain "id" field, they are deleted using the API and contain
    different field names.
*/
function StepFloorPlans({
    floorPlanList,
    setFloorPlanList,
    isEditSession = false,
    projectId,
}) {
    const { setValue, getValues } = useMultiStepForm();
    const { removeFloorPlan, isPending } = useDeleteFloorPlan();

    function handleAddFloorPlan() {
        const newFloorPlan = {};
        INPUT_FIELDS.forEach((field) => {
            if (field === "floorPlanLayout") {
                return (newFloorPlan[field] = Array.from(
                    getValues()[field] || []
                ));
            }
            newFloorPlan[field] = getValues()[field];
        });

        if (
            !newFloorPlan.floorPlanTitle ||
            isNaN(newFloorPlan.floorPlanBedroom)
        )
            return;
            console.log(newFloorPlan);

        setFloorPlanList([...floorPlanList, newFloorPlan]);
        INPUT_FIELDS.forEach((field) => setValue(field, ""));
    }

    function handleDeleteFloorPlan(index) {
        if (isEditSession && floorPlanList[index].id) {
            return removeFloorPlan({
                projectId,
                floorPlanId: floorPlanList[index].id,
            });
        }

        setFloorPlanList(floorPlanList.filter((_, i) => i !== index));
    }

    return (
        <>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Add Floor Plans</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.Input
                        registerName="floorPlanTitle"
                        placeholder="Title"
                        label="Title"
                    />
                    <MultiStepForm.InputSelect
                        registerName="floorPlanBedroom"
                        valueAsNumber={true}
                        options={[
                            { label: "Type", value: "" },
                            ...BEDROOM_NUM_OPTIONS.slice(1),
                        ]}
                        label="Bedroom"
                    />
                    <MultiStepForm.Input
                        registerName="floorPlanPrice"
                        placeholder="(in AED)"
                        type="number"
                        valueAsNumber={true}
                        label="Price"
                    />
                    <MultiStepForm.Input
                        registerName="floorPlanSize"
                        placeholder="(in sqft)"
                        type="number"
                        valueAsNumber={true}
                        label="Size"
                    />
                    <MultiStepForm.InputFileLocal
                        registerName="floorPlanLayout"
                        accept="image/*"
                        label="Layout"
                    />
                </div>
                <button
                    type="button"
                    style={{ justifySelf: "end", marginTop: "3rem" }}
                    className="btnFormNormal"
                    onClick={handleAddFloorPlan}
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
                    <span>Floor Plans List</span>
                </h3>

                <Table columns="1fr 1fr 1fr 1fr 2fr 1fr" rowWidth="100rem">
                    <Table.Header>
                        <div>Title</div>
                        <div>Bedroom</div>
                        <div>Price</div>
                        <div>Size</div>
                        <div>Layout</div>
                        <div></div>
                    </Table.Header>
                    <Table.Body
                        data={floorPlanList}
                        render={(data, i) => (
                            <div key={i}>
                                <Table.Row>
                                    {data.id ? (
                                        <>
                                            <span>{data.title}</span>
                                            <span>
                                                {data.Bedroom === "0"
                                                    ? "Studio"
                                                    : data.Bedroom || "N/A"}
                                            </span>
                                            <span>
                                                AED{" "}
                                                {formatNum(data.price) || "N/A"}
                                            </span>
                                            <span>
                                                {data.size || "N/A"} sqft
                                            </span>
                                            <a
                                                href={data.layout ?? ""}
                                                target="_blank"
                                            >
                                                {data.layout
                                                    ? "Click Here"
                                                    : "N/A"}
                                            </a>
                                        </>
                                    ) : (
                                        <>
                                            <span>{data.floorPlanTitle}</span>
                                            <span>
                                                {data.floorPlanBedroom === 0
                                                    ? "Studio"
                                                    : data.floorPlanBedroom ||
                                                      "N/A"}
                                            </span>
                                            <span>
                                                AED{" "}
                                                {formatNum(
                                                    data.floorPlanPrice
                                                ) || "N/A"}
                                            </span>
                                            <span>
                                                {data.floorPlanSize || "N/A"}{" "}
                                                sqft
                                            </span>
                                            <span>
                                                {data.floorPlanLayout?.[0]
                                                    ?.name || "N/A"}
                                            </span>
                                        </>
                                    )}

                                    <div className="btnsTableRow">
                                        <button
                                            type="button"
                                            style={{
                                                display: "flex",
                                                gap: ".8rem",
                                            }}
                                            className="btnDeleteRow"
                                            onClick={() =>
                                                handleDeleteFloorPlan(i)
                                            }
                                            disabled={isPending}
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
                        )}
                    />
                </Table>
            </div>
        </>
    );
}

export default StepFloorPlans;
