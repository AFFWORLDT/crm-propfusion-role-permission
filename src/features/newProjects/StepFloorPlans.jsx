import styles from "../../styles/MultiStepForm.module.css";
import floorPlanStyles from "./StepFloorPlans.module.css";
import MultiStepForm, { useMultiStepForm } from "../../ui/MultiStepForm";
import { BEDROOM_NUM_OPTIONS, PROPERTY_TYPES } from "../../utils/constants";
import Table from "../../ui/Table";
import useDeleteFloorPlan from "./useDeleteFloorPlan";
import { formatNum } from "../../utils/utils";
import { useState } from "react";
import { ChevronDown, ChevronUp, X, Download } from "lucide-react";
import EditFloorPlanButton from "./EditFloorPlanButton";

const INPUT_FIELDS = [
    "floorPlanTitle",
    "floorPlanBedroom",
    "floorPlanPrice",
    "floorPlanSize",
    "floorPlanLayout",
    "property_type",
    "tower",
    "sold_out"
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

// Image Modal Component
const ImageModal = ({ isOpen, imageUrl, onClose, title }) => {
    if (!isOpen) return null;

    const handleDownload = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${title || "floor-plan-layout"}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            window.open(imageUrl, "_blank");
        }
    };

    const handleModalClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
    };

    const handleContentClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "2rem",
            }}
            onClick={handleModalClick}
        >
            <div
                style={{
                    position: "relative",
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    overflow: "hidden",
                }}
                onClick={handleContentClick}
            >
                <div
                    style={{
                        padding: "1rem",
                        borderBottom: "1px solid #eee",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h3 style={{ margin: 0 }}>
                        {title || "Floor Plan Layout"}
                    </h3>
                    <div
                        style={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                        }}
                    >
                        <button
                            onClick={handleDownload}
                            style={{
                                background: "#007bff",
                                border: "none",
                                color: "white",
                                cursor: "pointer",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                fontSize: "0.9rem",
                            }}
                        >
                            <Download size={16} />
                            Download
                        </button>
                        <button
                            onClick={handleModalClick}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "0.5rem",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
                <div style={{ padding: "1rem" }}>
                    <img
                        src={imageUrl}
                        alt={title || "Floor Plan Layout"}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "70vh",
                            objectFit: "contain",
                        }}
                        onClick={handleContentClick}
                    />
                </div>
            </div>
        </div>
    );
};

export const PropertyTypeFloorPlans = ({ floorPlans, propertyType }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedBedrooms, setExpandedBedrooms] = useState({});
    const [modalState, setModalState] = useState({
        isOpen: false,
        imageUrl: "",
        title: "",
    });
    const filteredPlans = floorPlans.filter(
        (plan) => plan.property_type === propertyType
    );

    if (filteredPlans.length === 0) return null;

    // Group plans by bedroom count
    const plansByBedroom = filteredPlans.reduce((acc, plan) => {
        const bedroom = plan.Bedroom || plan.floorPlanBedroom || "N/A";
        if (!acc[bedroom]) {
            acc[bedroom] = [];
        }
        acc[bedroom].push(plan);
        return acc;
    }, {});

    const toggleBedroom = (bedroom) => {
        setExpandedBedrooms((prev) => ({
            ...prev,
            [bedroom]: !prev[bedroom],
        }));
    };

    const handleViewLayout = (e, layoutUrl, title) => {
        e.preventDefault();
        e.stopPropagation();
        setModalState({
            isOpen: true,
            imageUrl: layoutUrl,
            title: `${title} - Layout`,
        });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, imageUrl: "", title: "" });
    };

    return (
        <>
            <ImageModal
                isOpen={modalState.isOpen}
                imageUrl={modalState.imageUrl}
                title={modalState.title}
                onClose={handleCloseModal}
            />
            <div className={floorPlanStyles.floorPlanContainer}>
                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        padding: "1rem",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: isExpanded ? "#f0f0f0" : "#f8f8f8",
                        borderRadius: isExpanded ? "8px 8px 0 0" : "8px",
                        transition: "all 0.3s ease",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                        }}
                    >
                        {isExpanded ? (
                            <ChevronUp size={20} strokeWidth={2} />
                        ) : (
                            <ChevronDown size={20} strokeWidth={2} />
                        )}
                        <h4
                            style={{
                                margin: 0,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <span>{propertyType}</span>
                            <span
                                style={{
                                    backgroundColor: "#e0e0e0",
                                    padding: "0.2rem 0.8rem",
                                    borderRadius: "12px",
                                    fontSize: "0.9rem",
                                }}
                            >
                                {filteredPlans.length}
                            </span>
                        </h4>
                    </div>
                </div>

                {isExpanded && (
                    <div style={{ padding: "1rem" }}>
                        {Object.entries(plansByBedroom).map(
                            ([bedroom, plans]) => (
                                <div
                                    key={bedroom}
                                    style={{ marginBottom: "1rem" }}
                                >
                                    <div
                                        onClick={() => toggleBedroom(bedroom)}
                                        style={{
                                            padding: "0.8rem",
                                            cursor: "pointer",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            backgroundColor: "#f8f8f8",
                                            borderRadius: "4px",
                                            marginBottom: expandedBedrooms[
                                                bedroom
                                            ]
                                                ? "0.5rem"
                                                : 0,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "1rem",
                                            }}
                                        >
                                            {expandedBedrooms[bedroom] ? (
                                                <ChevronUp
                                                    size={16}
                                                    strokeWidth={2}
                                                />
                                            ) : (
                                                <ChevronDown
                                                    size={16}
                                                    strokeWidth={2}
                                                />
                                            )}
                                            <span style={{ fontWeight: 500 }}>
                                                {bedroom === "0"
                                                    ? "Studio"
                                                    : `${bedroom} Bed`}
                                            </span>
                                            <span
                                                style={{
                                                    backgroundColor: "#e0e0e0",
                                                    padding: "0.2rem 0.8rem",
                                                    borderRadius: "12px",
                                                    fontSize: "0.9rem",
                                                }}
                                            >
                                                {plans.length}
                                            </span>
                                        </div>
                                    </div>

                                    {expandedBedrooms[bedroom] && (
                                        <Table
                                            columns="1fr 1fr 1fr 1fr 1fr"
                                            rowWidth="120rem"
                                        >
                                            <Table.Header>
                                                <div>Title</div>
                                                <div>Price</div>
                                                <div>Size</div>
                                                <div>Sold Out</div>
                                                <div>Layout</div>
                                            </Table.Header>
                                            <Table.Body
                                                data={plans}
                                                render={(data) => {
                                                    const layoutUrl =
                                                        data.layout ||
                                                        data
                                                            .floorPlanLayout?.[0]
                                                            ?.name;
                                                    const title =
                                                        data.title ||
                                                        data.floorPlanTitle;

                                                    return (
                                                        <div key={data.id}>
                                                            <Table.Row>
                                                                <span>
                                                                    {title}
                                                                </span>
                                                                <span>
                                                                    AED{" "}
                                                                    {formatNum(
                                                                        data.price ||
                                                                            data.floorPlanPrice
                                                                    ) || "N/A"}
                                                                </span>
                                                                <span>
                                                                    {data.size ||
                                                                        data.floorPlanSize ||
                                                                        "N/A"}{" "}
                                                                    sqft
                                                                </span>
                                                                <span>
                                                                    {data.sold_out
                                                                        ? "Yes"
                                                                        : "No"}
                                                                </span>
                                                                {layoutUrl ? (
                                                                    <button
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleViewLayout(
                                                                                e,
                                                                                layoutUrl,
                                                                                title
                                                                            )
                                                                        }
                                                                        style={{
                                                                            background:
                                                                                "none",
                                                                            border: "1px solid #007bff",
                                                                            color: "#007bff",
                                                                            padding:
                                                                                "0.25rem 0.5rem",
                                                                            borderRadius:
                                                                                "4px",
                                                                            cursor: "pointer",
                                                                            fontSize:
                                                                                "0.9rem",
                                                                        }}
                                                                    >
                                                                        View
                                                                        Layout
                                                                    </button>
                                                                ) : (
                                                                    <span>
                                                                        N/A
                                                                    </span>
                                                                )}
                                                            </Table.Row>
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </Table>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

function StepFloorPlans({
    floorPlanList,
    setFloorPlanList,
    isEditSession = false,
    projectId,
}) {
    const { setValue, getValues } = useMultiStepForm();
    const { removeFloorPlan, isPending } = useDeleteFloorPlan();
    const [modalState, setModalState] = useState({
        isOpen: false,
        imageUrl: "",
        title: "",
    });
    const [selectedTower, setSelectedTower] = useState(null);

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

        setFloorPlanList([...floorPlanList, {
            ...newFloorPlan,
            tower: getValues("tower")
        }]);
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

    const handleViewLayout = (e, layoutUrl, title) => {
        e.preventDefault();
        e.stopPropagation();
        setModalState({
            isOpen: true,
            imageUrl: layoutUrl,
            title: `${title} - Layout`,
        });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, imageUrl: "", title: "" });
    };

    return (
        <>
            <ImageModal
                isOpen={modalState.isOpen}
                imageUrl={modalState.imageUrl}
                title={modalState.title}
                onClose={handleCloseModal}
            />
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
                            { label: "studio", value: 0 },
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
                      <MultiStepForm.InputSelect
                        registerName="property_type"
                        label="Property Type"
                        options={PROPERTY_TYPES}
                        placeholder={"Select Property Type"}
                    />

                    <MultiStepForm.Input
                        registerName="tower"
                        placeholder="Tower"
                        type="text"
                        label="Tower"
                    />
                    <MultiStepForm.InputFileLocal
                        registerName="floorPlanLayout"
                        accept="image/*"
                        label="Layout"
                    />
                    <MultiStepForm.InputToggle
                        registerName="sold_out"
                        label="Sold Out"
                        valueToEnable={false}
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

                <Table
                    columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 2fr 1fr "
                    rowWidth="120rem"
                >
                    <Table.Header>
                        <div>Title</div>
                        <div>Tower</div>
                        <div>Bedroom</div>
                        <div>Price</div>
                        <div>Size</div>
                        <div>Sold Out</div>
                        <div>Property Type</div>
                        <div>Layout</div>
                        <div></div>
                    </Table.Header>
                    <Table.Body
                        data={floorPlanList}
                        render={(data, i) => {
                            const layoutUrl = data.id
                                ? data.layout
                                : data.floorPlanLayout?.[0]?.name;
                            const title = data.id
                                ? data.title
                                : data.floorPlanTitle;

                            return (
                                <div key={i}>
                                    <Table.Row>
                                        {data.id ? (
                                            <>
                                                <span>{data.title}</span>
                                                <span>
                                                    {data.tower || "N/A"}
                                                </span>
                                                <span>
                                                    {data.Bedroom === "0"
                                                        ? "Studio"
                                                        : data.Bedroom || "N/A"}
                                                </span>
                                                <span>
                                                    AED{" "}
                                                    {formatNum(data.price) ||
                                                        "N/A"}
                                                </span>
                                                <span>
                                                    {data.size || "N/A"} sqft
                                                </span>
                                                <span>
                                                    {data.sold_out
                                                        ? "Yes"
                                                        : "No"}
                                                </span>
                                                <span>
                                                    {data.property_type ||
                                                        "N/A"}
                                                </span>
                                                {layoutUrl ? (
                                                    <button
                                                        onClick={(e) =>
                                                            handleViewLayout(
                                                                e,
                                                                layoutUrl,
                                                                title
                                                            )
                                                        }
                                                        style={{
                                                            background: "none",
                                                            border: "1px solid #007bff",
                                                            color: "#007bff",
                                                            padding:
                                                                "0.25rem 0.5rem",
                                                            borderRadius: "4px",
                                                            cursor: "pointer",
                                                            fontSize: "0.9rem",
                                                        }}
                                                    >
                                                        View Layout
                                                    </button>
                                                ) : (
                                                    <span>N/A</span>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <span>
                                                    {data.floorPlanTitle}
                                                </span>
                                                <span>
                                                    {data.tower || "N/A"}
                                                </span>
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
                                                    {data.floorPlanSize ||
                                                        "N/A"}{" "}
                                                    sqft
                                                </span>
                                                <span>
                                                    {data.sold_out
                                                        ? "Yes"
                                                        : "No"}
                                                </span>
                                                <span>
                                                    {data.property_type ||
                                                        "N/A"}
                                                </span>
                                                {layoutUrl ? (
                                                    <button
                                                        onClick={(e) =>
                                                            handleViewLayout(
                                                                e,
                                                                layoutUrl,
                                                                title
                                                            )
                                                        }
                                                        style={{
                                                            background: "none",
                                                            border: "1px solid #007bff",
                                                            color: "#007bff",
                                                            padding:
                                                                "0.25rem 0.5rem",
                                                            borderRadius: "4px",
                                                            cursor: "pointer",
                                                            fontSize: "0.9rem",
                                                        }}
                                                    >
                                                        View Layout
                                                    </button>
                                                ) : (
                                                    <span>N/A</span>
                                                )}
                                            </>
                                        )}

                                        <div className="btnsTableRow">
                                            {data.id && (
                                                <EditFloorPlanButton
                                                    floorPlanId={data.id}
                                                    projectId={projectId}
                                                    defaultValues={data}
                                                    setFloorPlanList={
                                                        setFloorPlanList
                                                    }
                                                >
                                                    Edit
                                                </EditFloorPlanButton>
                                            )}
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
                            );
                        }}
                    />
                </Table>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Floor Plans Based on Property Types</span>
                </h3>
                
                
                {/* Tower Tabs */}
                <div className={floorPlanStyles.towerTabs}>
                    <div 
                        className={`${floorPlanStyles.towerTab} ${!selectedTower ? floorPlanStyles.active : ''}`}
                        onClick={() => setSelectedTower(null)}
                    >
                        All Towers
                    </div>
                    {Array.from(new Set(floorPlanList.map(plan => plan.tower || plan.id ? plan.tower : ''))).filter(Boolean).map((tower) => (
                        <div
                            key={tower}
                            className={`${floorPlanStyles.towerTab} ${selectedTower === tower ? floorPlanStyles.active : ''}`}
                            onClick={() => setSelectedTower(tower)}
                        >
                            {tower}
                        </div>
                    ))}
                </div>

                {PROPERTY_TYPES?.map((type) => (
                    <PropertyTypeFloorPlans
                        key={type.value}
                        floorPlans={selectedTower ? floorPlanList.filter(plan => plan.tower === selectedTower) : floorPlanList}
                        propertyType={type.value}
                    />
                ))}
            </div>
        </>
    );
}

export default StepFloorPlans;
