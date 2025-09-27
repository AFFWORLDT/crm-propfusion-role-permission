import { useNavigate } from "react-router-dom";
import useInfiniteLeads from "../../features/leads/useInfiniteLeads";
import Table from "../../ui/Table";
import styles from "./LeadReportInTable.module.css";
import { Eye, AlertCircle } from "lucide-react";


function LeadReportInTable() {
    const navigate = useNavigate();
    const {
        isLoading: isLoadingLeads,
        leads,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteLeads();

    const displayLeads = leads.length > 0 ? leads : null;

    if (isLoadingLeads) return <div className={styles.loading}>Loading...</div>;

    const getPriorityClass = (priority) => {
        switch (priority?.toLowerCase()) {
            case "high":
                return styles.priorityHigh;
            case "medium":
                return styles.priorityMedium;
            case "low":
                return styles.priorityLow;
            default:
                return styles.priorityMedium;
        }
    };

    const getStageClass = (stage) => {
        switch (stage?.toLowerCase()) {
            case "new":
                return styles.stageNew;
            case "interested":
                return styles.stageInterested;
            case "contacted":
                return styles.stageContacted;
            case "proposal sent":
                return styles.stageProposal;
            case "negotiation":
                return styles.stageNegotiation;
            default:
                return styles.stageNew;
        }
    };

    return (
        <div
            style={{
                marginTop: "2rem",
            }}
        >
            <Table
                columns="2fr 1.5fr 1.2fr  1.2fr 1.2fr 0.8fr 1fr 1fr 0.5fr"
                rowWidth="140rem"
            >
                <Table.Header>
                    <div>Client Info</div>
                    <div>Agent</div>
                    <div>Location</div>
                    <div>Property Type</div>
                    <div>Next Follow-up</div>
                    <div>Rating</div>
                    <div>Stage</div>
                    <div>Status</div>
                    <div>Action</div>
                </Table.Header>

                <Table.Body
                    data={displayLeads}
                    render={(lead) => (
                        <Table.Row key={lead.id}>
                            <div className={styles.clientInfo}>
                                <div className={styles.clientName}>
                                    {lead.name}
                                    {lead.email && (
                                        <img
                                            src="/icons/email.svg"
                                            alt="email"
                                            className={styles.emailIcon}
                                        />
                                    )}
                                </div>
                                <div className={styles.clientPhone}>
                                    {lead.phone}
                                </div>
                                {lead.email && (
                                    <div className={styles.clientEmail}>
                                        {lead.email}
                                    </div>
                                )}
                            </div>

                            <div className={styles.agent}>
                                <div className={styles.agentInfo}>
                                    {lead.agent?.avatar ? (
                                        <img
                                            src={lead.agent.avatar}
                                            alt={lead.agent.name}
                                            className={styles.agentAvatar}
                                        />
                                    ) : (
                                        <div className={styles.agentName}>
                                            {"Unassigned"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.location}>
                                {lead.areas?.length > 0
                                    ? lead.areas
                                          .map((area) => area.name)
                                          .join(", ")
                                    : "-"}
                            </div>

                            <div className={styles.propertyType}>
                                {lead.property_type?.length > 0
                                    ? lead.property_type.join(", ")
                                    : "-"}
                            </div>

                            {lead.nextfollowupdate ? (
                                <div className={styles.nextFollowup}>
                                    <div className={styles.nextFollowupContent}>
                                        <div className={styles.followupDate}>
                                            <span>
                                                {new Date(
                                                    lead.nextfollowupdate
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className={styles.followupTime}>
                                            <span>
                                                {new Date(
                                                    lead.nextfollowupdate
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.notSet}>
                                    <AlertCircle size={14} />
                                    <span>Not scheduled</span>
                                </div>
                            )}

                            <div className={styles.priority}>
                                <span
                                    className={`${styles.priorityBadge} ${getPriorityClass(lead?.latest_followup_detailed?.rating?.name)}`}
                                >
                                    {lead?.latest_followup_detailed?.rating
                                        ?.name || "Not set"}
                                </span>
                            </div>

                            <div className={styles.stage}>
                                <span
                                    className={`${styles.stageBadge} ${getStageClass(lead?.latest_followup_detailed?.stages?.name)}`}
                                >
                                    {lead?.latest_followup_detailed?.stages
                                        ?.name || "Not set"}
                                </span>
                            </div>

                            <div className={styles.status}>
                                <span
                                    className={styles.statusBadge}
                                    style={{
                                        backgroundColor:
                                            lead?.latest_followup_detailed
                                                ?.status?.color_code ||
                                            "#6b7280",
                                        color: "white",
                                    }}
                                >
                                    {lead?.latest_followup_detailed?.status
                                        ?.name || "Not set"}
                                </span>
                            </div>

                            <div className={styles.action}>
                                <button
                                    onClick={() =>
                                        navigate(`/leads/details/${lead.id}`)
                                    }
                                    className={styles.viewButton}
                                >
                                    <Eye size={18} />
                                </button>
                            </div>
                        </Table.Row>
                    )}
                />
            </Table>

            <div className={styles.footer}>
                <p>Showing {displayLeads?.length || 0} leads.</p>
                {hasNextPage && (
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className={styles.loadMoreButton}
                    >
                        {isFetchingNextPage ? "Loading more..." : "Load More"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default LeadReportInTable;
