import {  Phone, ExternalLink, Eye, Plus } from "lucide-react";
import Table from "../../../ui/Table";
import styles from "./PortalCallRow.module.css";
import { useNavigate } from "react-router-dom";
import { useCallLeads } from "../../../store/callLeadDatastore";
import { useWhatsAppLeads } from "../../../store/whatsAppLeadDataStore";
import useAllDetails from "../../all-details/useAllDetails";

function PortalCallRow({ portalCallData }) {
    const { agent_info, clientType, main_leads_id, lead_id } =
        portalCallData || {};
        const {data:allDetailsData}=useAllDetails()
        const backgroundColor=allDetailsData?.company_settings?.sidebar_color_code

    const formatDuration = (duration) => {
        if (!duration) return "--:--";
        const [hours, minutes, seconds] = duration.split(":");
        return `${hours}h ${minutes}m ${seconds}s`;
    };


    const getStatusColor = (status) => {
        const statusColors = {
            connected: "#10B981",
            missed: "#EF4444",
            notconnected: "#F59E0B",
            voicemail: "#6366F1",
        };
        return statusColors[status] || "#6B7280";
    };
    const setDefaultList = useCallLeads((state) => state.setDefaultList);
    const { resetDefaultListView } = useWhatsAppLeads();

    const navigate = useNavigate();
    const formatCallStatus = (status) => {
        if (!status) return "Unknown";
        return status === "notconnected"
            ? "Not Connected"
            : status.charAt(0).toUpperCase() + status.slice(1);
    };
    const handleNavigateAddPortalLead = () => {
        resetDefaultListView()
        navigate(`/leads/add-portal-lead?no=${portalCallData?.receiver_number}`);
        setDefaultList({
            agent_info: agent_info || null,
            lead_id: lead_id || null
        });
    };
    const handleNavigateToLeadDetails = () => {
        if (!main_leads_id) return;

        const urls = {
            RENT: `/leads/details/${main_leads_id}`,
            SELL: `/leads/details/${main_leads_id}`,
            PROJECT: `/leads/details/${main_leads_id}`,
        };

        if (urls[clientType]) {
            navigate(urls[clientType]);
        }
    };

    const handleNavigateToPropertyDetails = (id, listingType) => {
        navigate(`/for-${listingType.toLowerCase()}/new-list/${id}`);
    };

    return (
        <Table.Row className={styles.tableRow}>
            <div >
                {new Intl.DateTimeFormat("en-GB", {
                    timeZone: "Asia/Dubai",
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }).format(new Date(portalCallData?.date_time))}
            </div>

            <div className={styles.statusCell}>
                <span
                
                    className={styles.statusBadge}
                    style={{
                        backgroundColor: getStatusColor(
                            portalCallData?.call_status
                        ),
                        textAlign: "center",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {formatCallStatus(portalCallData?.call_status)}
                </span>
            </div>

            <div className={styles.agentCell}>
                {portalCallData?.agent_info?.avatar ? (
                    <div className={styles.agentInfo}>
                        <img
                            src={portalCallData?.agent_info?.avatar}
                            alt={portalCallData?.agent_info?.name}
                            className={styles.agentAvatar}
                        />
                        <span className={styles.agentTooltip}>
                            {portalCallData?.agent_info?.name}
                        </span>
                    </div>
                ) : (
                    <div className={styles.noAgent}>No Agent</div>
                )}
            </div>
            <div className={styles.propertyCell}>
                <div className={styles.propertyInfo}>
                    <span
                        onClick={() => portalCallData?.property_info?.title && handleNavigateToPropertyDetails(portalCallData?.property_info?.id, portalCallData?.property_info?.listingType)}
                        style={{
                            color: portalCallData?.property_info?.title ? '#0680fb' : '#D3D3D3',
                            fontWeight: 'bold',
                            fontSize: '1.3rem',
                            cursor: portalCallData?.property_info?.title ? 'pointer' : 'default',
                            textDecoration: portalCallData?.property_info?.title ? 'underline' : 'none',
                        }}
                    >
                        {portalCallData?.property_info?.title || 'N/A'}
                    </span>
                </div>
            </div>

            <div className={styles.phoneCell}>
                <Phone size={16} className={styles.phoneIcon} />
                {portalCallData?.caller_number || 'N/A'}
            </div>

            <div className={styles.phoneCell}>
                <Phone size={16} className={styles.phoneIcon} />
                {portalCallData?.receiver_number || 'N/A'}
            </div>



            <div className={styles.recordingCell}>
                {portalCallData?.call_recording_url ? (
                    <div className={styles.audioPlayer}>
                        <audio
                            src={portalCallData?.call_recording_url}
                            controls
                            className={styles.audioElement}
                        />
                    </div>
                ) : (
                    <span className={styles.noRecording}>No recording</span>
                )}
            </div>
            <div className={styles.durationCell}>
                {formatDuration(portalCallData?.call_total_duration)}
            </div>
            <div className={styles.portalCell}>
                <ExternalLink size={14} className={styles.portalIcon} />
                {portalCallData?.source === "propertyfinder" ? "PF" : "Bayut"}
            </div>

            <div className={styles.actionCell}>
                {main_leads_id ? (
                    <button
                        onClick={handleNavigateToLeadDetails}
                        className={styles.addLeadButton}
                        style={{
                            backgroundColor: backgroundColor,
                            color: 'white',
                        }}
                    >
                        <Eye size={15} /> View Lead
                    </button>
                ) : (
                    <button
                        onClick={handleNavigateAddPortalLead}
                        className={styles.addLeadButton}
                        style={{
                            backgroundColor: backgroundColor,
                            color: 'white',
                        }}
                    >

                        <Plus size={15} />  Add Lead

                    </button>
                )}
            </div>
        </Table.Row>
    );
}

export default PortalCallRow;
