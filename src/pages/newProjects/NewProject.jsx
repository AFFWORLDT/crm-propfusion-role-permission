/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import styles from "../../styles/ListingItem.module.css";
import useProject from "../../features/newProjects/useProject";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../PageNotFound";
import SectionTop from "../../ui/SectionTop";
import NewProjectTop from "../../features/newProjects/NewProjectTop";
import { bedroomString, dateToYMD, formatNum } from "../../utils/utils";
import FollowUps from "../../features/followUps/FollowUps";
import { useSearchParams } from "react-router-dom";
import { PROPERTY_TYPES } from "../../utils/constants";
import { PropertyTypeFloorPlans } from "../../features/newProjects/StepFloorPlans";
import floorPlanStyles from "../../features/newProjects/StepFloorPlans.module.css";

function NewProject() {
    const { data, isLoading, error } = useProject();
    const [searchParams] = useSearchParams();
    const projectStatus = searchParams.get("status");
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showPropertyTypes, setShowPropertyTypes] = useState(false);
    const [selectedTower, setSelectedTower] = useState(null);
    const [floorPlanList, setFloorPlanList] = useState([]);
    const [propertyType, setPropertyType] = useState(null);

    // Get the correct project object based on API response
    const project = data?.projects ? data.projects[0] : data?.[0];
    const paymentPlan =
        project?.payment_plans?.[0] || project?.payment_planParam || null;

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= 768);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    if (isLoading) return <Spinner type="fullPage" />;
    if (data.length === 0) return <PageNotFound />;

    return (
        <div className="sectionContainer">
            <SectionTop heading="New Project Detail" />

            <section className="sectionStyles">
                <div className={styles.listingItem}>
                    <NewProjectTop
                        data={data[0]}
                        projectStatus={projectStatus}
                    />

                    <div className={styles.gridContainer}>
                        <div className={`sectionDiv ${styles.details}`}>
                            <h3>
                                <img src="/icons/grid.svg" alt="" />
                                <span>Details</span>
                            </h3>
                            <ul>
                                <li>
                                    <span>ID: </span>
                                    <span>{data[0].id}</span>
                                </li>
                                <li>
                                    <span>Bedrooms: </span>
                                    <span>
                                        {`${bedroomString(data[0].newParam.bedroomMin)} - ${bedroomString(data[0].newParam.bedroomMax)}`}
                                    </span>
                                </li>
                                <li>
                                    <span>Size: </span>
                                    <span>
                                        {`${data[0].newParam.size_min || "N/A"} - ${data[0].newParam.size_max || "N/A"} sq.ft`}
                                    </span>
                                </li>
                                <li>
                                    <span>Service Charge: </span>
                                    <span>
                                        {data[0].newParam.propertyFee || "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Total Floor: </span>
                                    <span>
                                        {data[0].newParam.totalFloor || "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Total Units: </span>
                                    <span>
                                        {data[0].newParam.totalUnits || "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Listed On: </span>
                                    <span>
                                        {dateToYMD(data[0].createTime) || "N/A"}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {projectStatus !== "POOL" && (
                            <FollowUps
                                type="project"
                                targetId={data[0].id}
                                maxWidth="100%"
                                maxHeight="30rem"
                            />
                        )}
                    </div>

                    <div className={styles.gridContainer}>
                        <div
                            className={`sectionDiv ${styles.description}`}
                            style={{
                                overflowY: "auto",
                                position: "relative",
                                padding: "0", // Remove default padding
                                maxHeight: "calc(100vh - 200px)", // Adjust based on viewport
                            }}
                        >
                            <div
                                style={{
                                    position: "sticky",
                                    top: "0",
                                    backgroundColor: "var(--bg-color)",
                                    padding: "1.5rem",
                                    zIndex: "1",
                                    borderBottom:
                                        "1px solid var(--border-color)",
                                }}
                            >
                                <h3 style={{ margin: 0 }}>
                                    <img src="/icons/document.svg" alt="" />
                                    <span>Description</span>
                                </h3>
                            </div>
                            <p style={{ padding: "1.5rem" }}>
                                {data[0].description}
                            </p>
                        </div>
                        <div
                            className={`sectionDiv ${styles.paymentPlan}`}
                            style={{
                                minHeight: "calc(100vh - 300px)", // Adjust based on viewport
                                overflowY: "auto",
                                position: "relative",
                                padding: "0", // Remove default padding
                                display: "block",
                                gap: "2.4rem",
                            }}
                        >
                            <div
                                style={{
                                    position: "sticky",
                                    top: "0",
                                    backgroundColor: "var(--bg-color)",
                                    padding: "1.5rem",
                                    zIndex: "1",
                                    borderBottom:
                                        "1px solid var(--border-color)",
                                }}
                            >
                                <h3 style={{ margin: 0 }}>
                                    <img
                                        src="/icons/wallet.svg"
                                        alt=""
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            color: "var(--primary-color)",
                                        }}
                                    />
                                    <span>Payment Plans</span>
                                </h3>
                            </div>

                            <div
                                style={{
                                    padding: "0 1.5rem 1.5rem",
                                    marginTop: "1.5rem",
                                }}
                            >
                                {project?.payment_plans &&
                                project.payment_plans.length > 0 ? (
                                    project.payment_plans.map((plan, index) => (
                                        <div
                                            key={plan.id}
                                            style={{
                                                marginBottom: "2rem",
                                                backgroundColor:
                                                    "var(--bg-light)",
                                                borderRadius: "0.8rem",
                                                overflow: "hidden",
                                                boxShadow:
                                                    "0 1px 3px rgba(0,0,0,0.1)",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: "1rem",
                                                    backgroundColor:
                                                        "var(--primary-color)",
                                                    color: "white",
                                                    position: "sticky",
                                                    top: "0",
                                                }}
                                            >
                                                <h4 style={{ margin: 0 }}>
                                                    {plan.name ||
                                                        `Payment Plan ${index + 1}`}
                                                    {plan.description && (
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    "1.2rem",
                                                                marginLeft:
                                                                    "1rem",
                                                                opacity: 0.8,
                                                            }}
                                                        >
                                                            ({plan.description})
                                                        </span>
                                                    )}
                                                </h4>
                                            </div>

                                            <div style={{ overflowX: "auto" }}>
                                                <table
                                                    style={{
                                                        width: "100%",
                                                        minWidth: "600px", // Ensure minimum width for readability
                                                        borderCollapse:
                                                            "collapse",
                                                        fontSize: "1.4rem",
                                                    }}
                                                >
                                                    <thead>
                                                        <tr
                                                            style={{
                                                                backgroundColor:
                                                                    "var(--bg-medium)",
                                                                fontWeight:
                                                                    "bold",
                                                                position:
                                                                    "sticky",
                                                                top: "0",
                                                            }}
                                                        >
                                                            <th
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    textAlign:
                                                                        "left",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                            >
                                                                Stage
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    textAlign:
                                                                        "right",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                            >
                                                                Percentage
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    textAlign:
                                                                        "right",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                            >
                                                                Installments
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                            >
                                                                T (First
                                                                Payment)
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    textAlign:
                                                                        "right",
                                                                }}
                                                            >
                                                                {plan.first_installment ??
                                                                    "N/A"}
                                                                %
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    textAlign:
                                                                        "right",
                                                                }}
                                                            >
                                                                {plan.first_installment_count ||
                                                                    "-"}
                                                            </td>
                                                        </tr>
                                                        <tr
                                                            style={{
                                                                backgroundColor:
                                                                    "var(--bg-light)",
                                                            }}
                                                        >
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                            >
                                                                B (Under
                                                                Construction)
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    textAlign:
                                                                        "right",
                                                                }}
                                                            >
                                                                {plan.under_construction ??
                                                                    "N/A"}
                                                                %
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    textAlign:
                                                                        "right",
                                                                }}
                                                            >
                                                                {plan.under_construction_count ||
                                                                    "-"}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                            >
                                                                L (On Handover)
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    textAlign:
                                                                        "right",
                                                                }}
                                                            >
                                                                {plan.on_handover ??
                                                                    "N/A"}
                                                                %
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    textAlign:
                                                                        "right",
                                                                }}
                                                            >
                                                                {plan.on_handover_count ||
                                                                    "-"}
                                                            </td>
                                                        </tr>
                                                        <tr
                                                            style={{
                                                                backgroundColor:
                                                                    "var(--bg-light)",
                                                            }}
                                                        >
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                            >
                                                                R (Post
                                                                Handover)
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    textAlign:
                                                                        "right",
                                                                }}
                                                            >
                                                                {plan.post_handover ??
                                                                    "N/A"}
                                                                %
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "1rem",
                                                                    textAlign:
                                                                        "right",
                                                                }}
                                                            >
                                                                {plan.post_handover_count ||
                                                                    "-"}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div
                                                style={{
                                                    padding: "1rem",
                                                    borderTop:
                                                        "1px solid var(--border-color)",
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    fontSize: "1.3rem",
                                                    backgroundColor: "white",
                                                }}
                                            >
                                                <span>
                                                    Created:{" "}
                                                    {dateToYMD(plan.createTime)}
                                                </span>
                                                <span
                                                    style={{
                                                        color: plan.is_active
                                                            ? "var(--success)"
                                                            : "var(--error)",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {plan.is_active
                                                        ? "● Active"
                                                        : "● Inactive"}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No payment plans available.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.gridContainer}>
                        <FloorPlans
                            floorPlansData={data[0].floor_plans}
                            showPropertyTypes={showPropertyTypes}
                            setShowPropertyTypes={setShowPropertyTypes}
                        />

                        {data[0].masterPlans &&
                            data[0].masterPlans.length > 0 && (
                                <MasterPlans
                                    masterPlans={data[0].masterPlans}
                                />
                            )}
                    </div>

                    {showPropertyTypes && (
                        <div className={styles.gridContainer}>
                            <div
                                className={`sectionDiv ${styles.multiStepFormGrid}`}
                            >
                                <h3>
                                    <img
                                        src="/icons/star.svg"
                                        style={{
                                            width: "30px",
                                            color: "var(--primary-color)",
                                        }}
                                    />
                                    <span>
                                        Floor Plans Based on Property Types
                                    </span>
                                </h3>
                                {/* Tower Tabs */}
                                <div className={floorPlanStyles.towerTabs}>
                                    <div
                                        className={`${floorPlanStyles.towerTab} ${!selectedTower ? floorPlanStyles.active : ""}`}
                                        onClick={() => setSelectedTower(null)}
                                    >
                                        All Towers
                                    </div>
                                    {Array.from(
                                        new Set(
                                            floorPlanList.map((plan) =>
                                                plan.tower || plan.id
                                                    ? plan.tower
                                                    : ""
                                            )
                                        )
                                    )
                                        .filter(Boolean)
                                        .map((tower) => (
                                            <div
                                                key={tower}
                                                className={`${floorPlanStyles.towerTab} ${selectedTower === tower ? floorPlanStyles.active : ""}`}
                                                onClick={() =>
                                                    setSelectedTower(tower)
                                                }
                                            >
                                                {tower}
                                            </div>
                                        ))}
                                </div>

                                {PROPERTY_TYPES?.map((type) => (
                                    <PropertyTypeFloorPlans
                                        key={type?.value}
                                        floorPlans={data[0].floor_plans}
                                        propertyType={type?.value}
                                        setPropertyType={setPropertyType}
                                        setFloorPlanList={setFloorPlanList}
                                        floorPlanList={floorPlanList}
                                        selectedTower={selectedTower}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {data[0]?.brochureUrl && (
                        <div className={`sectionDiv ${styles.pdfSection}`}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "1rem",
                                }}
                            >
                                <h3 style={{ margin: 0 }}>
                                    <img
                                        src="/icons/document.svg"
                                        alt=""
                                        style={{
                                            width: "30px",
                                            color: "var(--primary-color)",
                                        }}
                                    />
                                    <span>Project Brochure</span>
                                </h3>
                                <button
                                    onClick={() =>
                                        window.open(
                                            data[0].brochureUrl,
                                            "_blank"
                                        )
                                    }
                                    style={{
                                        padding: "0.5rem 1.4rem",
                                        backgroundColor: "var(--primary-color)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "1.4rem",
                                        cursor: "pointer",
                                        fontSize: "1.4rem",
                                    }}
                                >
                                    Full Screen View
                                </button>
                            </div>
                            <div
                                style={{
                                    height: "100vh",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                }}
                            >
                                <iframe
                                    src={data[0].brochureUrl}
                                    title="Project Brochure PDF"
                                    style={{
                                        width: "100%",
                                        height: "100vh",
                                        border: "none",
                                    }}
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

function MasterPlans({ masterPlans }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoadingImg, setIsLoadingImg] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleMasterPlanToggle(index) {
        if (selectedIndex === index) return;
        setSelectedIndex(index);
        setIsLoadingImg(true);
    }

    function handleImageClick() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    return (
        <div className={`sectionDiv ${styles.floorPlan}`}>
            <h3>
                <img src="/icons/map.svg" alt="" />
                <span>Master Plans</span>
            </h3>

            <div className={styles.floorSelect}>
                {masterPlans.map((_, index) => (
                    <button
                        className={selectedIndex === index ? styles.active : ""}
                        onClick={() => handleMasterPlanToggle(index)}
                        key={index}
                    >
                        Plan {index + 1}
                    </button>
                ))}
            </div>

            <div className={styles.floorContainer}>
                <div
                    className={`imgContainer ${isLoadingImg ? styles.imgLazyLoad : ""}`}
                >
                    <img
                        style={{
                            visibility: isLoadingImg ? "hidden" : "visible",
                        }}
                        onLoad={() => setIsLoadingImg(false)}
                        src={masterPlans[selectedIndex]}
                        alt={`Master Plan ${selectedIndex + 1}`}
                        onClick={handleImageClick}
                    />
                </div>
            </div>

            {isModalOpen && (
                <div className={styles.modal} onClick={closeModal}>
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={masterPlans[selectedIndex]}
                            alt={`Master Plan ${selectedIndex + 1}`}
                            className={styles.fullImage}
                        />
                        <button
                            onClick={closeModal}
                            className={styles.closeButton}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function FloorPlans({
    floorPlansData,
    showPropertyTypes,
    setShowPropertyTypes,
}) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoadingImg, setIsLoadingImg] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleFloorPlanToggle(index) {
        if (selectedIndex === index) return;
        setSelectedIndex(index);
        setIsLoadingImg(true);
    }

    function handleImageClick() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function togglePropertyTypes() {
        setShowPropertyTypes(!showPropertyTypes);
    }

    if (!floorPlansData || floorPlansData.length === 0) return null;
    const selectedStyleObj = floorPlansData[selectedIndex];

    return (
        <>
            <div className={`sectionDiv ${styles.floorPlan}`}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "1rem",
                    }}
                >
                    <h3 style={{ margin: 0 }}>
                        <img
                            src="/icons/book.svg"
                            alt=""
                            style={{
                                width: "20px",
                                height: "20px",
                                color: "var(--primary-color)",
                            }}
                        />
                        <span>Floor Plan</span>
                    </h3>
                    <button
                        onClick={togglePropertyTypes}
                        style={{
                            padding: "0.5rem 1.4rem",
                            backgroundColor: "var(--primary-color)",
                            color: "white",
                            border: "none",
                            borderRadius: "1.4rem",
                            cursor: "pointer",
                            fontSize: "1.4rem",
                        }}
                    >
                        {showPropertyTypes
                            ? "Hide Property Types"
                            : "Show Property Types"}
                    </button>
                </div>

                <div className={styles.floorSelect}>
                    {floorPlansData.map((item, index) => (
                        <button
                            className={
                                selectedIndex === index ? styles.active : ""
                            }
                            onClick={() => handleFloorPlanToggle(index)}
                            key={`${item.id}-${index}`}
                        >
                            {item.title}
                        </button>
                    ))}
                </div>

                <div className={styles.floorContainer}>
                    <div
                        className={`imgContainer ${isLoadingImg ? styles.imgLazyLoad : ""}`}
                    >
                        <img
                            style={{
                                visibility: isLoadingImg ? "hidden" : "visible",
                            }}
                            onLoad={() => setIsLoadingImg(false)}
                            src={selectedStyleObj.layout}
                            alt=""
                            onClick={handleImageClick}
                        />
                    </div>

                    <div className={styles.floorContent}>
                        <span>{selectedStyleObj.title}</span>
                        <span>
                            Price: {formatNum(selectedStyleObj.price) || "N/A"}
                        </span>
                        <span>Size: {selectedStyleObj.size} sq.ft</span>
                    </div>
                </div>

                {isModalOpen && (
                    <div className={styles.modal} onClick={closeModal}>
                        <div
                            className={styles.modalContent}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedStyleObj.layout}
                                alt=""
                                className={styles.fullImage}
                            />
                            <button
                                onClick={closeModal}
                                className={styles.closeButton}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default NewProject;
