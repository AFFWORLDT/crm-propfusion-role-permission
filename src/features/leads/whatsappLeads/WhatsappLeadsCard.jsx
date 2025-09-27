import { useNavigate } from "react-router-dom";
import styles from "../LeadBtns.module.css";
import WhatsAppLeadsTags from "../../../pages/leads/WhatsAppLeadsTags";
import { useWhatsAppLeads } from "../../../store/whatsAppLeadDataStore";
import { useState } from "react";
import { Calendar, Phone, MapPin, Building2, User, Clock } from "lucide-react";
import useAllDetails from "../../all-details/useAllDetails";

function WhatsappLeadsCard({ whatsappLeadData }) {
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
    } = whatsappLeadData || {};

    const setDefaultListView = useWhatsAppLeads(
        (state) => state.setDefaultListView
    );
    const navigate = useNavigate();
    const { data } = useAllDetails();

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
        <div className={styles.cardContainer}>
            <div className={styles.cardHeader}>
                <div className={styles.leadTime}>
                    <Clock size={16} />
                    <span>
                        {date_time
                            ? new Intl.DateTimeFormat("en-GB", {
                                  dateStyle: "full",
                                  timeStyle: "short",
                                  hourCycle: "h12",
                              }).format(new Date(date_time))
                            : "NA"}
                    </span>
                </div>
                <LeadIcon portal={portal} />
            </div>

            <div className={styles.cardBody}>
                <div className={styles.senderInfo}>
                    <div className={styles.leadName}>
                        <User size={16} />
                        <span>{lead_name || "NA"}</span>
                    </div>
                    <div className={styles.leadPhone}>
                        <Phone size={16} />
                        <span>{cell || "NA"}</span>
                    </div>
                </div>

                <div className={styles.propertyInfo}>
                    <div className={styles.propertyTitle}>
                        <Building2 size={16} />
                        <span>{property_title || "NA"}</span>
                    </div>
                    <div className={styles.propertyType}>
                        <span className={`${styles.badge} ${listingType === "SELL" ? styles.badgeSell : styles.badgeRent}`}>
                            {listingType || "NA"}
                        </span>
                    </div>
                </div>

                <div className={styles.areaInfo}>
                    <MapPin size={16} />
                    <span>{area_info?.name || "Unavailable"}</span>
                </div>

                <div className={styles.agentInfo}>
                    <AgentInfo agent={agent_info} />
                </div>

                <div className={styles.statusInfo}>
                    <span className={styles.statusBadge}>{status ? status.toUpperCase() : "NA"}</span>
                    {timeline && (
                        <div className={styles.timelineInfo}>
                            <span className={styles.seeMore}>Timeline</span>
                            <div className={styles.timelinePopover}>
                                <table className={styles.timelineTable}>
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeline.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.status ? item.status.toUpperCase() : "NA"}</td>
                                                <td>{new Date(item.created_at).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.cardFooter}>
                <div className={styles.tags}>
                    <WhatsAppLeadsTags wpleadData={whatsappLeadData} />
                </div>
                <div className={styles.actions}>
                    {main_leads_id ? (
                        <button onClick={handleNavigateToLeadDetails} className={styles.viewLeadBtn}>
                            View Lead
                        </button>
                    ) : (
                        <button onClick={handleNavigateAddPortalLead} className={styles.addLeadBtn}  style={{
                            background:
                            data?.company_settings
                                ?.sidebar_color_code || "#020079",
                        }}>
                            Add Leads
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function AgentInfo({ agent }) {
    if (!agent) return <span>NA</span>;

    return (
        <div className={styles.agentCard}>
            <div className={styles.agentAvatar}>
                {agent.avatar ? (
                    <img src={agent.avatar} alt={`${agent.name}'s avatar`} />
                ) : (
                    <div className={styles.avatarPlaceholder}>
                        {agent.name?.charAt(0)}
                    </div>
                )}
            </div>
            <div className={styles.agentDetails}>
                <span className={styles.agentName}>{agent.name || "NA"}</span>
                <span className={styles.agentContact}>{agent.contact || "NA"}</span>
            </div>
        </div>
    );
}

export function LeadIcon({ portal }) {
    if (!portal) return null;
    return (
        <div className={styles.portalIcon}>
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

export default WhatsappLeadsCard; 