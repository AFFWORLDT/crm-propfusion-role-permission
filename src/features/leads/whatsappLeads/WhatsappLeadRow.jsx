import { useNavigate } from "react-router-dom";
import Table from "../../../ui/Table";
import styles from "../LeadBtns.module.css";
import WhatsAppLeadsTags from "../../../pages/leads/WhatsAppLeadsTags";
import { useWhatsAppLeads } from "../../../store/whatsAppLeadDataStore";
import { useState } from "react";
import useAllDetails from "../../all-details/useAllDetails";

function WhatsappLeadRow({ whatsappLeadData }) {
    const {
        lead_id,
        status,
        timeline,
        portal,
        lead_name,
        cell,
        message,
        agent_info,
        property_id,
        property_title,
        listingType,
        date_time,
        area_info,
        main_leads_id,
        // propertyId,
    } = whatsappLeadData || {};

    const { data: allDetails } = useAllDetails();

    const backgroundColor =
        allDetails?.company_settings?.sidebar_color_code || "#020079";
    const makeLinksClickable = (text) => {
        if (!text) return "";

        // Regular expression to find URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        // Extract links from the message
        const links = text.match(urlRegex) || [];

        // If no links, show original message
        if (links.length === 0) return text;

        // If there are links, display them as boxes
        return (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {links.map((link, index) => (
                    <LinkBox key={index} url={link} />
                ))}
            </div>
        );
    };

    const LinkBox = ({ url }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const toggleExpand = (e) => {
            e.preventDefault();
            setIsExpanded(!isExpanded);
        };

        return (
            <div style={{ position: "relative" }}>
                <div
                    onClick={toggleExpand}
                    style={{
                        backgroundColor: "#e9ecef",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontSize: "1.3rem",
                        color: "#495057",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        width: "80px",
                        height: "32px",
                    }}
                >
                    Link {isExpanded ? "▲" : "▼"}
                </div>

                {isExpanded && (
                    <div
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: "0",
                            zIndex: 1000,
                            backgroundColor: "white",
                            padding: "1.2rem",
                            borderRadius: "4px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            marginTop: "8px",
                            width: "400px",
                            wordBreak: "break-all",
                        }}
                    >
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "#007bff",
                                textDecoration: "none",
                                fontWeight: "500",
                                fontSize: "1.4rem",
                            }}
                        >
                            {url}
                        </a>
                    </div>
                )}
            </div>
        );
    };
    const setDefaultListView = useWhatsAppLeads(
        (state) => state.setDefaultListView
    );
    const navigate = useNavigate();

    // Navigate to property details based on type
    function handleNavigateProperty(id, type) {
        if (!type) return;

        const urls = {
            RENT: `/for-rent/new-list/${id}`,
            SELL: `/for-sell/new-list/${id}`,
            PROJECT: `/new-projects/list/${id}`,
        };

        if (urls[type]) {
            window.open(urls[type], "_blank");
        }
    }

    // Navigate and set default list view for Add Portal Lead
    const handleNavigateAddPortalLead = () => {
        navigate(`/leads/add-portal-lead`);
        setDefaultListView({
            name: lead_name || null,
            cell: cell || null,
            message: message || null,
            listing_id: whatsappLeadData?.listing_id || null,
            listing_reference: whatsappLeadData?.listing_reference || null,
            lead_id: lead_id || null,
            lead_type: whatsappLeadData?.lead_type || null,
            lead_source: whatsappLeadData?.lead_source || null,
            lead_status: whatsappLeadData?.lead_status || null,
            listingType: listingType || null,
            agent_info: agent_info || null,
            portal: portal || null,
            title: property_title || null,
            property_id: property_id || null,
            area_id: area_info?.id || null,
            area_name: area_info?.name || null,
        });
    };

    const handleNavigateToLeadDetails = () => {
        if (!main_leads_id) return;

        const urls = {
            RENT: `/leads/details/${main_leads_id}`,
            SELL: `/leads/details/${main_leads_id}`,
            PROJECT: `/leads/details/${main_leads_id}`,
        };

        if (urls[listingType]) {
            navigate(urls[listingType]);
        }
    };

    return (
        <Table.Row>
            {/* Lead Time */}
            <div
                className={styles.cellWrapper}
                style={{
                    fontSize: "1.05rem",
                    lineHeight: "1.05",
                    padding: "0.1rem 0.2rem",
                }}
            >
                {date_time
                    ? (() => {
                        const d = new Date(date_time);
                        const dateStr = d.toLocaleDateString('en-GB', { timeZone: 'Asia/Dubai' });
                        const timeStr = d.toLocaleTimeString('en-US', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: true });
                        return `${dateStr} ${timeStr}`;
                    })()
                    : "NA"}
            </div>

            {/* Portal Icon */}
            <div>
                <LeadIcon portal={portal} />
            </div>

            {/* Sender Info */}
            <div
                style={{
                    fontSize: "1.05rem",
                    lineHeight: "1.05",
                    padding: "0.1rem 0.2rem",
                }}
            >
                <span
                    className={styles.leadName}
                    style={{ fontWeight: "500", fontSize: "1.05rem" }}
                >
                    {lead_name || "NA"}
                </span>
                <span style={{ display: "block", marginTop: "0.05rem" }}>
                    {cell || "NA"}
                </span>
                <div className={styles.cellInfo}>
                    <span
                        className={styles.seeMore}
                        style={{ fontSize: "0.95rem", marginTop: "0.05rem" }}
                    >
                        see message
                    </span>
                    <div
                        className={styles.popover}
                        style={{ fontSize: "0.95rem" }}
                    >
                        <p>
                            <strong>Message:</strong> {message || "NA"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Agent Info */}
            <div
                style={{
                    fontSize: "1.05rem",
                    lineHeight: "1.05",
                    padding: "0.1rem 0.2rem",
                }}
            >
                <AgentInfo agent={agent_info} />
            </div>

            {/* Area Info */}
            <div
                style={{
                    fontSize: "1.05rem",
                    lineHeight: "1.05",
                    padding: "0.1rem 0.2rem",
                }}
            >
                <span>{area_info?.name || "Unavailable"}</span>
            </div>

            {/* Property Details */}
            <div
                style={{
                    fontSize: "1.05rem",
                    lineHeight: "1.05",
                    padding: "0.1rem 0.2rem",
                }}
            >
                <PropertyDetails
                    propertyId={property_id}
                    propertyTitle={property_title}
                    listingType={listingType}
                    onNavigate={handleNavigateProperty}
                />
            </div>

            {/* Status */}
            <div
                style={{
                    fontSize: "1.05rem",
                    padding: "0.1rem 0.2rem",
                    lineHeight: "1.05",
                }}
            >
                <span style={{ fontWeight: "500" }}>
                    {status ? status.toUpperCase() : "NA"}
                </span>
                <br />
                {timeline && (
                    <div className={styles.statusInfo}>
                        <span
                            className={styles.seeMore}
                            style={{ fontSize: "0.95rem", marginTop: "0.05rem" }}
                        >
                            see more
                        </span>
                        <div
                            className={styles.popover}
                            style={{
                                fontSize: "0.95rem",
                                padding: "0.3rem",
                                minWidth: "120px",
                            }}
                        >
                            <table className={styles.timelineTable}>
                                <thead>
                                    <tr>
                                        <th
                                            style={{
                                                padding: "0.1rem",
                                                fontSize: "0.95rem",
                                            }}
                                        >
                                            Status
                                        </th>
                                        <th
                                            style={{
                                                padding: "0.1rem",
                                                fontSize: "0.95rem",
                                            }}
                                        >
                                            Created At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeline.map((item, index) => (
                                        <tr key={index}>
                                            <td
                                                style={{
                                                    padding: "0.1rem",
                                                    fontSize: "0.95rem",
                                                }}
                                            >
                                                {item.status
                                                    ? item.status.toUpperCase()
                                                    : "NA"}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "0.1rem",
                                                    fontSize: "0.95rem",
                                                }}
                                            >
                                                {new Date(
                                                    item.created_at
                                                ).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            {/* Message */}
            <div
                style={{
                    fontSize: "1.05rem",
                    lineHeight: "1.05",
                    wordWrap: "break-word",
                    padding: "0.1rem 0.2rem",
                }}
            >
                {makeLinksClickable(message)}
            </div>

            {/* Operations */}
            <div className={styles.leadBtns} style={{ padding: "0.05rem 0.1rem" }}>
                {main_leads_id ? (
                    <button
                        onClick={handleNavigateToLeadDetails}
                        className={styles.viewLeadBtn}
                    >
                        View Lead
                    </button>
                ) : (
                    <button
                        onClick={handleNavigateAddPortalLead}
                        className={styles.addLeadBtn}
                        style={{
                            backgroundColor,
                        }}
                    >
                        Add Lead
                    </button>
                )}
            </div>

            {/* Tags */}
            <div>
                <WhatsAppLeadsTags wpleadData={whatsappLeadData} />
            </div>

            {/* ID */}
            <div>
                <div className={styles.idCell} style={{ padding: "0.05rem 0.1rem" }}>
                    <span className={styles.truncatedId}>
                        {lead_id ? lead_id.slice(0, 9) + "..." : "NA"}
                    </span>
                    {lead_id && lead_id.length > 9 && (
                        <div className={styles.idPopover}>
                            <span className={styles.seeMore} style={{ fontSize: "1.4rem" }}>see more</span>
                            <div className={styles.popover}>
                                <p style={{ fontSize: "1.4rem" }}>
                                    <strong>Full ID:</strong> {lead_id}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Table.Row>
    );
}

export default WhatsappLeadRow;
function AgentInfo({ agent }) {
    if (!agent) return <span>NA</span>;

    // initials निकालना
    const getInitials = (name) => {
        if (!name) return "NA";
        const parts = name.split(" ");
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {agent.avatar ? (
                <img
                    src={agent.avatar}
                    alt={agent.name || "Agent"}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1.5px solid #e0e0e0",
                        background: "#fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                    }}
                />
            ) : (
                <div
                style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#f0f0f0",
                        color: "#333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        border: "1.5px solid #e0e0e0",
                    }}
                >
                    {getInitials(agent.name)}
                </div>
            )}
        </div>
    );
}

function PropertyDetails({
    propertyId,
    propertyTitle,
    listingType,
    onNavigate,
}) {
    return (
        <div>
            <span>{propertyId || "NA"}</span>
            <br />
            <span
                className={styles.seeMore}
                style={{ cursor: "pointer", fontSize: "1.3rem" }}
                onClick={() => onNavigate(propertyId, listingType)}
            >
                {propertyTitle || "NA"} ,{" "}
                <span style={{ color: "black" }}> {listingType || "NA"}</span>
            </span>
        </div>
    );
}

export function LeadIcon({ portal }) {
    if (!portal) return null;
    return (
        <div className={styles.leadIcon}>
            {portal === "property_finder" ? (
                <img src={"/icons/property-finder.png"} alt="property-finder" />
            ) : null}
            {portal === "bayut" ? (
                <img src={"/icons/bayut.png"} alt="bayut" />
            ) : null}
            {portal === "dubizzle" ? (
                <img src={"/icons/dubizzle.png"} alt="dubizzle" />
            ) : null}
        </div>
    );
}
