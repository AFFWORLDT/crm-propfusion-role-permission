import styles from "./KpiInTable.module.css";
import { useState } from "react";

function KpiInGrid({ data = [], isLoading }) {
    const [expandedItems, setExpandedItems] = useState({});

    // Function to toggle expanded state
    const toggleExpand = (id, field) => {
        setExpandedItems(prev => ({
            ...prev,
            [`${id}-${field}`]: !prev[`${id}-${field}`]
        }));
    };

    // Function to truncate text to first 4 words
    const truncateText = (text) => {
        if (!text || text === '-') return '-';
        const words = text.split(' ');
        if (words.length <= 4) return text;
        return words.slice(0, 4).join(' ') + '...';
    };

    if (isLoading) {
        return <div style={{ fontSize: "16px" }}>Loading...</div>;
    }
    if (!data || data.length === 0) {
        return <div style={{ fontSize: "16px" }}>No data found.</div>;
    }
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3rem", marginTop: "2rem", justifyContent: "flex-start" }}>
            {data.map((item, idx) => (
                <div
                    key={item.id || idx}
                    style={{
                        background: "#fff",
                        borderRadius: "1.2rem",
                        boxShadow: "0 4px 24px rgba(52,27,128,0.08)",
                        padding: "2.5rem 2.5rem 2rem 2.5rem",
                        minWidth: 400,
                        maxWidth: 480,
                        flex: "1 1 440px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                        border: "1.5px solid #ece9f6",
                        transition: "box-shadow 0.2s, border 0.2s",
                        position: "relative",
                        cursor: "pointer",
                        marginBottom: "1.5rem",
                    }}
                    onMouseOver={e => e.currentTarget.style.boxShadow = "0 8px 32px rgba(52,27,128,0.16)"}
                    onMouseOut={e => e.currentTarget.style.boxShadow = "0 4px 24px rgba(52,27,128,0.08)"}
                >
                    {/* Header */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: "20px", color: "#341b80", letterSpacing: 0.2 }}> {item.agent_name} </span>
                        <span style={{ color: "#595e85", fontSize: "16px", marginTop: 4 }}> {new Date(new Date(item?.create_time).getTime() + 4 * 60 * 60 * 1000).toLocaleString()} </span>
                    </div>
                    {/* Metrics Grid */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem 1.5rem",
                        fontSize: "16px",
                        color: "#23223a"
                    }}>
                        <div><b>Leads:</b> {item.leads_generated}</div>
                        <div><b>Calls:</b> {item.calls_made}</div>
                        <div><b>Meetings:</b> {item.meetings_scheduled}</div>
                        <div><b>Viewings:</b> {item.property_viewings}</div>
                        <div><b>Offers:</b> {item.offers_made}</div>
                        <div><b>Deals:</b> {item.deals_closed}</div>
                        <div><b>Client Followups:</b> {item.client_followups}</div>
                        <div className={styles.truncatedTextContainer}>
                            <b>Followup Details:</b> 
                            <span style={{ color: '#6b7280' }} onClick={(e) => {
                                e.stopPropagation();
                                if (item.followup_details) toggleExpand(item.id || idx, 'followupDetails');
                            }}>
                                {expandedItems[`${item.id || idx}-followupDetails`] 
                                    ? item.followup_details || '-'
                                    : truncateText(item.followup_details)}
                                {item.followup_details && item.followup_details.split(' ').length > 4 && (
                                    <button 
                                        className={styles.expandButton} 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            toggleExpand(item.id || idx, 'followupDetails');
                                        }}
                                        style={{ fontSize: "16px" }}
                                    >
                                        {expandedItems[`${item.id || idx}-followupDetails`] ? '−' : '+'}
                                    </button>
                                )}
                            </span>
                        </div>
                        <div><b>Total Calls:</b> {item.total_calls}</div>
                        <div><b>Connected Calls:</b> {item.connected_calls}</div>
                        <div><b>Followups Scheduled:</b> {item.followups_scheduled}</div>
                        <div><b>With Agents:</b> <span style={{ color: item.meeting_status?.with_agents ? '#059669' : '#ef4444', fontWeight: 600 }}>{item.meeting_status?.with_agents ? 'Yes' : 'No'}</span></div>
                        <div><b>With Management:</b> <span style={{ color: item.meeting_status?.with_management ? '#059669' : '#ef4444', fontWeight: 600 }}>{item.meeting_status?.with_management ? 'Yes' : 'No'}</span></div>
                        <div><b>Property Hunting:</b> <span style={{ color: item.meeting_status?.property_hunting ? '#059669' : '#ef4444', fontWeight: 600 }}>{item.meeting_status?.property_hunting ? 'Yes' : 'No'}</span></div>
                        <div><b>Sellers Added:</b> {item.broadcast_metrics?.sellers_added}</div>
                        <div><b>Buyers Added:</b> {item.broadcast_metrics?.buyers_added}</div>
                        <div><b>Agents Added:</b> {item.broadcast_metrics?.agents_added}</div>
                        <div><b>New Listings:</b> {item.new_listings_added}</div>
                    </div>
                    {/* Notes */}
                    <div style={{
                        background: "#f5f4fa",
                        borderRadius: "0.8rem",
                        padding: "1rem 1.2rem",
                        marginTop: "1rem",
                        color: "#341b80",
                        fontSize: "16px",
                        fontWeight: 500,
                        letterSpacing: 0.1,
                        minHeight: 40
                    }}>
                        <div className={styles.truncatedTextContainer}>
                            <b>Notes:</b> 
                            <span onClick={(e) => {
                                e.stopPropagation();
                                if (item.notes && item.notes !== '-') toggleExpand(item.id || idx, 'notes');
                            }}>
                                {expandedItems[`${item.id || idx}-notes`]
                                    ? item.notes || '-'
                                    : truncateText(item.notes || '-')}
                                {item.notes && item.notes !== '-' && item.notes.split(' ').length > 4 && (
                                    <button 
                                        className={styles.expandButton} 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            toggleExpand(item.id || idx, 'notes');
                                        }}
                                        style={{ fontSize: "16px" }}
                                    >
                                        {expandedItems[`${item.id || idx}-notes`] ? '−' : '+'}
                                    </button>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default KpiInGrid; 