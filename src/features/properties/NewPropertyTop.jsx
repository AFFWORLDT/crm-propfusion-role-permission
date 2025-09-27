import { useState } from "react";
import PropertyLightboxGallery from "./PropertyLightboxGallery.jsx";
import AgentContact from "../../ui/AgentContact.jsx";
import styles from "../../styles/ListingItemTop.module.css";
import modalStyles from "../../styles/DeactivationModal.module.css";
import { formatNum } from "../../utils/utils";
import NewPropertyMenus from "./NewPropertyMenus.jsx";
import useUpdateProperty from "./useUpdateProperty.js";
import { ConfirmDeActivate } from "../../ui/ConfirmDelete.jsx";
import Modal from "../calendar/Modal.jsx";
import useAllDetails from "../all-details/useAllDetails.js";
import { useNavigate } from "react-router-dom";
import PropertyQualityScore from "./PropertyQualityScore";
import RenewDate from "./RenewDate";
import { Clock7, Watch } from "lucide-react";
import { Tooltip } from "@mui/material";
import CurrencySwitcher from "../../components/CurrencySwitcher";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

function NewPropertyTop({ data }) {
    const { changeProperty, isPending } = useUpdateProperty();
    const { data: allData } = useAllDetails();
    const navigate = useNavigate();

    // State for controlling modals
    const [isModalOpen, setModalOpen] = useState(false);
    const [isRenewModalOpen, setRenewModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isToggleOn, setIsToggleOn] = useState(false);

    // Currency conversion state
    const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState("AED");
    const [currencyRate, setCurrencyRate] = useState(1);
    const [convertedPrice, setConvertedPrice] = useState(data.price || 0);

    function handleChangeAgent(agentId, onCloseModal) {
        changeProperty(
            {
                id: data.id,
                updatedProperty: { agent_Id: agentId },
            },
            {
                onSettled: onCloseModal,
            }
        );
    }

    function handleRenewDates(newDates) {
        changeProperty({
            id: data.id,
            updatedProperty: { ...data, ...newDates },
        });
    }

    function openRemoveLocationModal(locationType) {
        setSelectedLocation(locationType);
        setModalOpen(true);
    }

    function handleConfirmRemoveLocation() {
        if (selectedLocation) {
            changeProperty({
                id: data.id,
                updatedProperty: { ...data, [selectedLocation]: "" },
            });
        }
        setModalOpen(false);
    }

    function handleWhatsappClick() {
        navigate(`/leads/whatsapp-leads?property_id=${data.id}`);
    }

    // Currency conversion handler
    const handleCurrencySelect = (currencyCode, rate, converted) => {
        setSelectedCurrency(currencyCode);
        setCurrencyRate(rate);
        setConvertedPrice(converted);
    };

    // WhatsApp icon component
    const WhatsAppIcon = () => {
        const [showPopover, setShowPopover] = useState(false);

        return (
            <div
                onClick={handleWhatsappClick}
                onMouseEnter={() => setShowPopover(true)}
                onMouseLeave={() => setShowPopover(false)}
                style={{ position: "relative" }}
            >
                <img
                    src="/icons/whatsapp.png"
                    alt=""
                    style={{ width: "4rem", height: "4rem" }}
                />
                {showPopover && (
                    <div
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: "#ffffff",
                            color: "#000",
                            padding: "5px 10px",
                            borderRadius: "40px",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            zIndex: 10,
                            border: "1px solid #ccc",
                        }}
                    >
                        See all whatsapp leads for this property
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className={`sectionDiv ${styles.listingItemTop}`}
            style={{ border: "1px solid red" }}
        >
            {/* Property Images */}
            <div style={{ position: "relative" }}>
                {(data.completionStatus === "completed_primary" ||
                    data.completionStatus === "completed") && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            position: "absolute",
                            top: "0px",
                            left: "0px",
                            zIndex: 1,
                        }}
                    >
                        <span
                            style={{
                                padding: "8px 10px",
                                backgroundColor: "#4CAF50", // Green for Completed
                                color: "white",
                                fontWeight: "bold",
                                borderRadius: "12px",
                                fontSize: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                textTransform: "uppercase",
                            }}
                        >
                            Completed
                        </span>
                        <WhatsAppIcon />
                    </div>
                )}
                {(data.completionStatus === "off_plan" ||
                    data.completionStatus === "off_plan_primary") && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            position: "absolute",
                            top: "1px",
                            left: "1px",
                            zIndex: 1,
                        }}
                    >
                        <span
                            style={{
                                padding: "5px 8px",
                                backgroundColor: "#FF5722", // Red for Off Primary
                                color: "white",
                                fontWeight: "bold",
                                borderRadius: "12px",
                                fontSize: "8px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                textTransform: "uppercase",
                            }}
                        >
                            Off Plan
                        </span>
                        <WhatsAppIcon />
                    </div>
                )}
                {!data.completionStatus && (
                    <div
                        style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            zIndex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                    >
                        <WhatsAppIcon />
                    </div>
                )}
                {/* <PropertyImageGallery
                    images={
                        data.photos?.map((url) => {
                            return {
                                original: url,
                                thumbnail: url,
                            };
                        }) || []
                    }
                /> */}

                <PropertyLightboxGallery images={data.photos || []} />
            </div>
            <div className={styles.listingItemTopContent}>
                <NewPropertyMenus data={data} />

                <div className={styles.statusContainer}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            justifyContent: "space-between",
                        }}
                    >
                        <span className={styles.status}>{data.status}</span>
                        <PropertyQualityScore
                            qualityScoreDetails={data?.quality_score}
                            propertyTitle={data?.title}
                            propertyId={data?.id}
                        />
                    </div>
                    <div className={styles.propertyFinderImageContainer}>
                        {/* Property Finder */}
                        {data?.propertyFinder && (
                            <span
                                style={{
                                    position: "relative",
                                    display: "inline-block",
                                }}
                            >
                                <img
                                    src="/icons/property-finder.png"
                                    className={`${data?.propertyFinder === "REQ_ENABLE" ? "image-adjuster" : ""}`}
                                    onClick={() =>
                                        openRemoveLocationModal(
                                            "propertyFinder"
                                        )
                                    }
                                />
                                {/* Show watch icon if no auto disable time set */}
                                {data.pf_auto_disable_time && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: -10,
                                            right: 20,
                                            borderRadius: "50%",
                                            boxShadow:
                                                "0 1px 4px rgba(0,0,0,0.15)",
                                            background: "#fff",
                                            zIndex: 2,
                                            display: "flex",
                                        }}
                                    >
                                        <Clock7 size={14} color="#f97314" />
                                    </span>
                                )}
                            </span>
                        )}
                        {/* Bayut */}
                        {data?.bayut && (
                            <span
                                style={{
                                    position: "relative",
                                    display: "inline-block",
                                }}
                            >
                                <img
                                    className={
                                        data?.bayut === "REQ_ENABLE"
                                            ? "image-adjuster"
                                            : ""
                                    }
                                    src="/icons/bayut.png"
                                    onClick={() =>
                                        openRemoveLocationModal("bayut")
                                    }
                                />
                                {/* Show watch icon if no auto disable time set */}
                                {data.bayut_auto_disable_time && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: -10,
                                            right: 20,
                                            borderRadius: "50%",
                                            boxShadow:
                                                "0 1px 4px rgba(0,0,0,0.15)",
                                            background: "#fff",
                                            zIndex: 2,
                                            display: "flex",
                                        }}
                                    >
                                        <Clock7 size={14} color="#f97314" />
                                    </span>
                                )}
                            </span>
                        )}
                        {/* Dubizzle */}
                        {data?.dubizzle && (
                            <span
                                style={{
                                    position: "relative",
                                    display: "inline-block",
                                }}
                            >
                                <img
                                    className={
                                        data?.dubizzle === "REQ_ENABLE"
                                            ? "image-adjuster"
                                            : ""
                                    }
                                    src="/icons/dubizzle.png"
                                    onClick={() =>
                                        openRemoveLocationModal("dubizzle")
                                    }
                                />
                                {/* Show watch icon if no auto disable time set */}
                                {data.dubizzle_auto_disable_time && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: -10,
                                            right: 20,
                                            borderRadius: "50%",
                                            boxShadow:
                                                "0 1px 4px rgba(0,0,0,0.15)",
                                            background: "#fff",
                                            zIndex: 2,
                                            display: "flex",
                                        }}
                                    >
                                        <Clock7 size={14} color="#f97314" />
                                    </span>
                                )}
                            </span>
                        )}
                        {data?.propfusionPortal && (
                            <span>
                                <img
                                    className={
                                        data?.propfusionPortal === "REQ_ENABLE"
                                            ? "image-adjuster"
                                            : ""
                                    }
                                    src="/icons/PROPFUSION_LOGO.png"
                                    onClick={() =>
                                        openRemoveLocationModal(
                                            "propfusionPortal"
                                        )
                                    }
                                />
                            </span>
                        )}
                        {data?.customPortal && (
                            <img
                                className={
                                    data?.customPortal === "REQ_ENABLE"
                                        ? "image-adjuster"
                                        : ""
                                }
                                src="/icons/customePortal.png"
                                onClick={() =>
                                    openRemoveLocationModal("customPortal")
                                }
                            />
                        )}
                        {data?.ownPortal && (
                            <img
                                className={
                                    data?.ownPortal === "REQ_ENABLE"
                                        ? "image-adjuster"
                                        : ""
                                }
                                src={
                                    allData?.company_settings?.company_logo_url
                                }
                                onClick={() =>
                                    openRemoveLocationModal("ownPortal")
                                }
                            />
                        )}
                        {data?.propsearch && (
                            <img
                                src="/icons/propsearch.png"
                                onClick={() =>
                                    openRemoveLocationModal("propsearch")
                                }
                            />
                        )}
                    </div>
                </div>

                <h1>{data.title}</h1>
                <p className={styles.location}>
                    <img src="/icons/location.svg" alt="" />
                    <span>{data.area?.name}</span>
                </p>

                <p className={styles.price}>
                    <span>
                        {data.price
                            ? selectedCurrency === "AED"
                                ? `AED ${formatNum(data.price)}`
                                : `${selectedCurrency} ${formatNum(convertedPrice)}`
                            : "Not specified"}
                        {data.listingType === "RENT" && data?.priceType
                            ? ` / ${data.priceType}`
                            : ""}
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

                {selectedCurrency !== "AED" && data.price && (
                    <p
                        style={{
                            fontSize: "0.85rem",
                            color: "#666",
                            marginTop: "-10px",
                        }}
                    >
                        (AED {formatNum(data.price)})
                    </p>
                )}

                <div
                    className={styles.type}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <span>{data.property_type}</span>
                </div>

                <p className={styles.community}>
                    <span>Location: </span>
                    <span>
                        {[
                            data.location?.property_name,
                            data.location?.sub_community,
                            data.location?.community,
                            data.location?.city,
                        ]
                            .filter(Boolean)
                            .map((field, index, array) =>
                                index < array.length - 1 ? `${field}, ` : field
                            )}
                    </span>
                </p>

                <p className={styles.developer}>
                    <span>Developer: </span>
                    <span>{data.developer?.name ?? "N/A"}</span>
                </p>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <Tooltip
                        placement="right-end"
                        title="Renew Portal Dates"
                        slotProps={{
                            tooltip: {
                                sx: {
                                    fontSize: "14px",
                                    padding: "8px 12px",
                                },
                            },
                        }}
                    >
                        <button
                            onClick={() => setRenewModalOpen(true)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 16px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                background: "white",
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.background = "#f7fafc")
                            }
                            onMouseOut={(e) =>
                                (e.currentTarget.style.background = "white")
                            }
                        >
                            <Watch size={18} />
                            <span>Portal Dates</span>
                        </button>
                    </Tooltip>
                </div>
                <AgentContact
                    onChangeAgent={handleChangeAgent}
                    isChangingAgent={isPending}
                    agentAvatar={data?.agent?.avatar}
                    agentName={data?.agent?.name}
                    agentPhone={data?.agent?.phone}
                    agentMail={data?.agent?.email}
                />
            </div>

            {/* Modal for Deactivate/Schedule */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setModalOpen(false);
                }}
                title="Alert!"
            >
                <DeactivationModalContent
                    selectedLocation={selectedLocation}
                    onConfirmRemove={handleConfirmRemoveLocation}
                    onCancel={() => setModalOpen(false)}
                    isDeleting={isPending}
                    propertyData={data}
                    changeProperty={changeProperty}
                    closeModal={() => setModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isRenewModalOpen}
                onClose={() => {
                    setRenewModalOpen(false);
                }}
                title="Renew Portal Dates"
            >
                <RenewDate
                    data={data}
                    onCloseModal={() => setRenewModalOpen(false)}
                    onSubmit={handleRenewDates}
                />
            </Modal>

            {/* Currency Switcher Modal */}
            <CurrencySwitcher
                open={currencyModalOpen}
                onClose={() => setCurrencyModalOpen(false)}
                onSelectCurrency={handleCurrencySelect}
                price={data.price || 0}
            />
        </div>
    );
}

// --- New Modal Content Component for Deactivation/Schedule ---

function DeactivationModalContent({
    selectedLocation,
    onConfirmRemove,
    onCancel,
    isDeleting,
    propertyData,
    changeProperty,
    closeModal,
}) {
    // Map portal to API field
    const portalToField = {
        propertyFinder: "pf_auto_disable_time",
        bayut: "bayut_auto_disable_time",
        dubizzle: "dubizzle_auto_disable_time",
    };

    // Get the current scheduled time if any
    const field = portalToField[selectedLocation];
    const currentScheduledTime = field ? propertyData[field] : "";

    // Convert to datetime-local format if value exists
    function toDatetimeLocal(val) {
        if (!val) return "";
        const date = new Date(val);
        if (isNaN(date.getTime())) return "";
        const pad = (n) => n.toString().padStart(2, "0");
        return (
            date.getFullYear() +
            "-" +
            pad(date.getMonth() + 1) +
            "-" +
            pad(date.getDate()) +
            "T" +
            pad(date.getHours()) +
            ":" +
            pad(date.getMinutes())
        );
    }

    const [scheduleDate, setScheduleDate] = useState(
        toDatetimeLocal(currentScheduledTime)
    );
    const [isScheduling, setIsScheduling] = useState(false);

    const handleSchedule = () => {
        if (!scheduleDate || !selectedLocation) return;
        setIsScheduling(true);
        const field = portalToField[selectedLocation];
        if (!field) {
            setIsScheduling(false);
            return;
        }
        changeProperty(
            {
                id: propertyData.id,
                updatedProperty: {
                    ...propertyData,
                    [field]: scheduleDate,
                },
            },
            {
                onSettled: () => {
                    setIsScheduling(false);
                    closeModal();
                },
            }
        );
    };

    return (
        <div className={modalStyles.container}>
            <div className={modalStyles.header}>
                <strong>
                    Do you want to deactivate now or schedule deactivation?
                </strong>
            </div>
            <div className={modalStyles.buttonContainer}>
                <button
                    onClick={onConfirmRemove}
                    disabled={isDeleting}
                    className={`${modalStyles.button} ${modalStyles.buttonDeactivate}`}
                >
                    Deactivate Now
                </button>
                {(selectedLocation === "propertyFinder" ||
                    selectedLocation === "bayut" ||
                    selectedLocation === "dubizzle") && (
                    <>
                        <input
                            type="datetime-local"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className={modalStyles.input}
                        />
                        {currentScheduledTime && (
                            <>
                                <div className={modalStyles.scheduledTime}>
                                    Current scheduled time:{" "}
                                    {new Date(
                                        currentScheduledTime
                                    ).toLocaleString()}
                                </div>
                                <button
                                    onClick={() => {
                                        const field =
                                            portalToField[selectedLocation];
                                        if (!field) return;
                                        setIsScheduling(true);
                                        changeProperty(
                                            {
                                                id: propertyData.id,
                                                updatedProperty: {
                                                    ...propertyData,
                                                    [field]: "",
                                                },
                                            },
                                            {
                                                onSettled: () => {
                                                    setIsScheduling(false);
                                                    closeModal();
                                                },
                                            }
                                        );
                                    }}
                                    disabled={isScheduling}
                                    className={`${modalStyles.button} ${modalStyles.buttonRemove}`}
                                >
                                    Remove Scheduled Deactivation
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleSchedule}
                            disabled={isScheduling || !scheduleDate}
                            className={`${modalStyles.button} ${modalStyles.buttonSchedule}`}
                        >
                            {isScheduling
                                ? "Scheduling..."
                                : "Schedule Deactivation"}
                        </button>
                    </>
                )}
                <button
                    onClick={onCancel}
                    className={`${modalStyles.button} ${modalStyles.buttonCancel}`}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default NewPropertyTop;
