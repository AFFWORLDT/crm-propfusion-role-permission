import { useMyPermissions } from "../../../hooks/useHasPermission";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import Table from "../../../ui/Table";
import TeamForm from "./TeamForm";
import useDeleteTeam from "./useDeleteTeam";
import { useState } from "react";
import CustomModal from "./CustomModal";

function TeamRow({ teamData, level = 0 }) {
    const { removeTeam, isPending: isDeleting } = useDeleteTeam();
    const [expandedTeams, setExpandedTeams] = useState(new Set());
    const { hasPermission } = useMyPermissions();

    const toggleTeam = (teamId) => {
        setExpandedTeams((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(teamId)) {
                newSet.delete(teamId);
            } else {
                newSet.add(teamId);
            }
            return newSet;
        });
    };

    const isTeamExpanded = (teamId) => {
        return expandedTeams.has(teamId);
    };

    // Create a separate component for individual team rows to have their own state
    const TeamRowItem = ({ team, isSubTeam = false }) => {
        const [editModalOpen, setEditModalOpen] = useState(false);
        const [deleteModalOpen, setDeleteModalOpen] = useState(false);

        return (
            <Table.Row
                key={team.team_id}
                style={{
                    backgroundColor: isSubTeam ? "#f5f5f5" : "transparent",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        paddingLeft: `${level * 40}px`,
                    }}
                >
                    {(team.sub_teams?.length > 0 || team.members?.length > 0) && (
                        <button
                            onClick={() => toggleTeam(team.team_id)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            <img
                                src={
                                    isTeamExpanded(team.team_id)
                                        ? "/icons/arrow-downn.svg"
                                        : "/icons/arrow-right.svg"
                                }
                                alt="toggle"
                                width="20"
                                height="20"
                            />
                        </button>
                    )}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        {team.team_leader && (
                            <img
                                src={team.team_leader.avatar}
                                alt={team.team_leader.name}
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                }}
                            />
                        )}
                        <span>{team.name}</span>
                    </div>
                </div>
                <span style={{ textAlign: "center" }}>{team.members_count}</span>

                <div className="btnsTableRow">
                    {hasPermission("update_teams") && (
                        <button onClick={() => setEditModalOpen(true)}>
                            <img src="/icons/edit.svg" />
                            <span>Edit</span>
                        </button>
                    )}
                    <button 
                        className="btnDeleteRow" 
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        <img src="/icons/delete.svg" />
                        <span>Delete</span>
                    </button>
                </div>

                <CustomModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
                    <TeamForm teamToEdit={team} setIsOpen={setEditModalOpen} />
                </CustomModal>

                <CustomModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                    <ConfirmDelete
                        resourceName="team"
                        resourceId={team.team_id}
                        onConfirm={() => {
                            removeTeam(team.team_id);
                            setDeleteModalOpen(false);
                        }}
                        isDeleting={isDeleting}
                    />
                </CustomModal>
            </Table.Row>
        );
    };

    const renderTeamRow = (team, isSubTeam = false) => (
        <TeamRowItem team={team} isSubTeam={isSubTeam} />
    );

    const renderMembers = (members, currentLevel) => {
        return members.map((member) => (
            <Table.Row
                key={member.id}
                style={{
                    backgroundColor: "#f9f9f9",
                    paddingLeft: `${(currentLevel + 1) * 40}px`,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        paddingLeft: `${(currentLevel + 1) * 40}px`,
                    }}
                >
                    <img
                        src={member.avatar}
                        alt={member.name}
                        style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                    />
                    <span>{member.name}</span>
                </div>
                <span style={{ textAlign: "center" }}>-</span>
                <span></span>
            </Table.Row>
        ));
    };

    const renderSubTeams = (subTeams, currentLevel) => {
        return subTeams.map((subTeam) => (
            <div key={subTeam.team_id}>
                {renderTeamRow(subTeam, true)}
                {isTeamExpanded(subTeam.team_id) && (
                    <>
                        {subTeam.members?.length > 0 &&
                            renderMembers(subTeam.members, currentLevel)}
                        {subTeam.sub_teams?.length > 0 &&
                            renderSubTeams(subTeam.sub_teams, currentLevel + 1)}
                    </>
                )}
            </div>
        ));
    };

    return (
        <>
            {renderTeamRow(teamData)}
            {isTeamExpanded(teamData.team_id) && (
                <>
                    {teamData.members?.length > 0 &&
                        renderMembers(teamData.members, level)}
                    {teamData.sub_teams?.length > 0 &&
                        renderSubTeams(teamData.sub_teams, level + 1)}
                </>
            )}
        </>
    );
}

export default TeamRow;
