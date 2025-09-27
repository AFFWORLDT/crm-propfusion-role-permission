import { formatNum, formatMonthYear } from "../../utils/utils";
import PropertyImageGallery from "../properties/PropertyImageGallery";
import styles from "../../styles/ListingItemTop.module.css";
import AgentContact from "../../ui/AgentContact";
import NewProjectMenus from "./NewProjectMenus";
import useUpdateProject from "./useUpdateProject";
import useCreateProject from "./useCreateProject";
import { useAuth } from "../../context/AuthContext";
import { POOL_TYPES } from "../../utils/constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CurrencySwitcher from "../../components/CurrencySwitcher";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import PropertyLightboxGallery from "../properties/PropertyLightboxGallery";

function NewProjectTop({ data, projectStatus }) {
    const { changeProject, isPending: isPendingUpdate } = useUpdateProject();
    const { addProject, isPending: isPendingAdd } = useCreateProject();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState("AED");
    const [currencyRate, setCurrencyRate] = useState(1);
    const [convertedPrice, setConvertedPrice] = useState(
        data.newParam?.price || 0
    );

    function handleChangeAgent(agentId, onCloseModal) {
        changeProject(
            {
                projectId: data.id,
                updatedProject: { ...data, agent_Id: agentId },
            },
            {
                onSettled: onCloseModal,
            }
        );
    }

    function handleClaim(data) {
        data.projectStatus = "ACTIVE";
        addProject(
            { newProject: { ...data, agent_Id: currentUser.id } },
            {
                onSuccess: () => {
                    if (projectStatus === "POOL") {
                        navigate(`/new-projects/list/${data.id}`, {
                            replace: true,
                        });
                        toast.success("Project claimed successfully");
                    }
                },
            }
        );
    }

    const handleCurrencySelect = (currencyCode, rate, converted) => {
        setSelectedCurrency(currencyCode);
        setCurrencyRate(rate);
        setConvertedPrice(converted);
    };

    // Find the pool type configuration based on data.pool_type
    const poolTypeConfig = POOL_TYPES.find(
        (type) => type.value === data.pool_type
    );

    return (
        <>
            <div
                className={`sectionDiv ${styles.listingItemTop} ${styles.card}`}
                style={{ position: "relative", border: "1px solid green" }}
            >
                {" "}
                {/* Card style */}
                {/* Pool Type Icon - Absolutely positioned in top left */}
                {poolTypeConfig && (
                    <div
                        style={{
                            position: "absolute",
                            top: "16px",
                            left: "16px",
                            background: "rgba(255,255,255,0.98)",
                            borderRadius: "12px",
                            minWidth: "90px",
                            height: "38px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "8px",
                            fontSize: "18px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                            zIndex: 10,
                            border: "1px solid #e5e7eb",
                            padding: "0 14px",
                            fontWeight: 500,
                        }}
                        title={poolTypeConfig.label}
                        aria-label={`Pool Type: ${poolTypeConfig.label}`}
                    >
                        <span style={{ display: "flex", alignItems: "center" }}>
                            {poolTypeConfig.icon}
                        </span>
                        <span
                            style={{
                                marginLeft: "4px",
                                fontSize: "15px",
                                color: "#444",
                                fontWeight: 600,
                                textTransform: "capitalize",
                                letterSpacing: "0.01em",
                            }}
                        >
                            {poolTypeConfig.label}
                        </span>
                    </div>
                )}
                {/* <PropertyImageGallery
                    images={
                        data.photos?.map((url) => {
                            return {
                                original: url,
                                thumbnail: url,
                                originalAlt: data.name + " photo",
                                thumbnailAlt: data.name + " thumbnail",
                            };
                        }) || []
                    }
                /> */}
                <PropertyLightboxGallery images={data.photos || []} />
                <div className={styles.listingItemTopContent}>
                    {projectStatus !== "POOL" && (
                        <NewProjectMenus data={data} />
                    )}

                    <span className={styles.status} aria-label="Project Status">
                        {projectStatus === "POOL" ? "POOL" : data.projectStatus}
                    </span>

                    <h1 className={styles.projectName}>{data.name}</h1>

                    <p className={styles.location} aria-label="Location">
                        <img src="/icons/location.svg" alt="Location icon" />
                        <span>
                            {[
                                data?.location?.community,
                                data?.location?.sub_community,
                            ]
                                .filter(Boolean)
                                .join(", ") || "N/A"}
                        </span>
                    </p>

                    <p className={styles.price} aria-label="Starting Price">
                        <span>
                            {selectedCurrency === "AED"
                                ? `${formatNum(data.newParam?.price)} AED Starting`
                                : `${formatNum(convertedPrice)} ${selectedCurrency} Starting`}
                        </span>
                        <button
                            onClick={() => setCurrencyModalOpen(true)}
                            style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                color: "#2563eb",
                            }}
                            title="Convert Currency"
                        >
                            <CurrencyExchangeIcon />
                        </button>
                    </p>

                    {selectedCurrency !== "AED" && (
                        <p
                            style={{
                                fontSize: "0.85rem",
                                color: "#666",
                                marginTop: "-10px",
                            }}
                        >
                            (AED {formatNum(data.newParam?.price)})
                        </p>
                    )}

                    <div
                        className={styles.typeBadges}
                        aria-label="Property Types"
                    >
                        {data.propertyTypes.map((item, i) => (
                            <span className={styles.statusBadge} key={i}>
                                {item}
                            </span>
                        ))}
                    </div>

                    <p className={styles.developer} aria-label="Developer">
                        <span>Developer: </span>
                        <span>{data?.developer?.name || "N/A"}</span>
                    </p>

                    <p
                        className={styles.handoverTime}
                        aria-label="Handover Date"
                    >
                        <span>Handover Date: </span>
                        <span>
                            {data.newParam.handoverTime
                                ? formatMonthYear(data.newParam.handoverTime)
                                : "N/A"}
                        </span>
                    </p>

                    {projectStatus === "POOL" ? (
                        <button
                            style={{ width: "100%" }}
                            className="btnNormalLarge"
                            onClick={() => handleClaim(data)}
                            disabled={isPendingAdd}
                        >
                            Claim Project
                        </button>
                    ) : (
                        <AgentContact
                            onChangeAgent={handleChangeAgent}
                            isChangingAgent={isPendingUpdate}
                            agentAvatar={data?.agent?.avatar}
                            agentName={data?.agent?.name}
                            agentPhone={data?.agent?.phone}
                            agentMail={data?.agent?.email}
                            projectId={data.id}
                        />
                    )}
                </div>
            </div>

            {/* Currency Switcher Modal */}
            <CurrencySwitcher
                open={currencyModalOpen}
                onClose={() => setCurrencyModalOpen(false)}
                onSelectCurrency={handleCurrencySelect}
                price={data.newParam?.price || 0}
            />
        </>
    );
}

export default NewProjectTop;
