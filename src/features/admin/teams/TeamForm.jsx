import { useForm } from "react-hook-form";
import styles from "../../../styles/FormGrid.module.css";
import useCreateTeam from "./useCreateTeam";
import useUpdateTeam from "./useUpdateTeam";
import useStaff from "../staff/useStaff";
import FormInputDataList from "../../../ui/FormInputDataList";
import { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl } from "../../../utils/getApiUrl";
import { useMyPermissions } from "../../../hooks/useHasPermission";

function TeamForm({ setIsOpen, teamToEdit = {} }) {
    const { hasPermission } = useMyPermissions();

    const isEditSession = teamToEdit.team_id ? true : false;
    const BACKEND_URL = getApiUrl();

    const { register, handleSubmit, control } = useForm({
        defaultValues: isEditSession
            ? {
                  ...teamToEdit,
                  team_leader_id: {
                      label: teamToEdit.team_leader?.name,
                      value: teamToEdit.team_leader?.id,
                  },
                  parent_team_id: {
                      label: teamToEdit.parent_team_name,
                      value: teamToEdit.parent_team_id,
                  },
              }
            : {},
    });

    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(
                    `${BACKEND_URL}/api/all_teams`
                );
                setTeams(response.data);
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        };
        fetchTeams();
    }, []);

    const teamOptions = teams.map((team) => {
        return {
            value: team.team_id,
            label: `${team.name} ${team.team_leader_name ? `(Leader: ${team.team_leader_name})` : ""}`,
        };
    });

    const { addTeam, isPending: isCreating } = useCreateTeam();
    const { changeTeam, isPending: isUpdating } = useUpdateTeam();
    const isWorking = isCreating || isUpdating;

    const { data: staffData, isLoading: isLoadingStaff } = useStaff();

    const staffOptions = staffData.map((item) => {
        return { value: item.id, label: item.name };
    });

    function onSubmit(data) {
        data.team_leader_id = String(data.team_leader_id.value);
        data.parent_team_id = data.parent_team_id?.value
            ? String(data.parent_team_id.value)
            : null;

        if (isEditSession) {
            changeTeam(
                {
                    id: teamToEdit.team_id,
                    payload: data,
                },
                {
                    onSuccess: () => {
                        setIsOpen(false);
                    },
                }
            );
        } else {
            addTeam(data, {
                onSuccess: () => {
                    setIsOpen(false);
                },
            });
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setIsOpen(false);
    };

    const formStyles = {
        formWrapper: {
            maxWidth: "600px",
            margin: "0 auto",
        },
        title: {
            fontSize: "2rem",
            textAlign: "center",
            color: "#0369a1",
            marginBottom: "2rem",
            fontWeight: "600",
        },
        formContainer: {
            display: "grid",
            gap: "2rem",
            width: "100%",
        },
        inputGroup: {
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
        },
        label: {
            fontSize: "1.4rem",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "0.25rem",
        },
        input: {
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "1rem",
            width: "100%",
            transition: "border-color 0.2s",
            outline: "none",
            "&:focus": {
                borderColor: "#0369a1",
                boxShadow: "0 0 0 2px rgba(3, 105, 161, 0.2)",
            },
        },
        buttonGroup: {
            display: "flex",
            gap: "1rem",
            justifyContent: "flex-end",
            marginTop: "2rem",
            flexWrap: "wrap",
        },
        cancelButton: {
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            backgroundColor: "#fff",
            color: "#374151",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.2s",
            flex: "1",
            minWidth: "120px",
            maxWidth: "200px",
            "&:hover": {
                backgroundColor: "#f3f4f6",
            },
            "&:disabled": {
                opacity: 0.7,
                cursor: "not-allowed",
            },
        },
        submitButton: {
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#0369a1",
            color: "#fff",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.2s",
            flex: "1",
            minWidth: "120px",
            maxWidth: "200px",
            "&:hover": {
                backgroundColor: "#0284c7",
            },
            "&:disabled": {
                opacity: 0.7,
                cursor: "not-allowed",
            },
        },
    };

    return (
        <form
            className={styles.formGrid}
            onSubmit={handleSubmit(onSubmit)}
            style={formStyles.formWrapper}
        >
            <h3 style={formStyles.title}>
                {isEditSession ? "Edit Team" : "Create New Team"}
            </h3>

            <div style={formStyles.formContainer}>
                <div style={formStyles.inputGroup}>
                    <label style={formStyles.label}>Team Name</label>
                    <input
                        type="text"
                        required
                        {...register("name")}
                        placeholder="Enter team name"
                    />
                </div>

                <div style={formStyles.inputGroup}>
                    <label style={formStyles.label}>Team Leader</label>
                    <FormInputDataList
                        control={control}
                        registerName={"team_leader_id"}
                        data={staffOptions}
                        isLoading={isLoadingStaff}
                        required={true}
                        placeholder="Select Team Leader"
                        styles={{
                            control: (base) => ({
                                ...base,
                                padding: "0.25rem",
                                borderRadius: "8px",
                                minHeight: "45px",
                                border: "1px solid #d1d5db",
                                "&:hover": {
                                    borderColor: "#0369a1",
                                },
                            }),
                            menu: (base) => ({
                                ...base,
                                borderRadius: "8px",
                                marginTop: "4px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected
                                    ? "#0369a1"
                                    : state.isFocused
                                      ? "#e5e7eb"
                                      : "white",
                                "&:hover": {
                                    backgroundColor: "#e5e7eb",
                                },
                            }),
                        }}
                    />
                </div>

                <div style={formStyles.inputGroup}>
                    <label style={formStyles.label}>Parent Team</label>
                    <FormInputDataList
                        control={control}
                        registerName={"parent_team_id"}
                        data={teamOptions}
                        isLoading={false}
                        required={false}
                        placeholder="Select Parent Team"
                        styles={{
                            control: (base) => ({
                                ...base,
                                padding: "0.25rem",
                                borderRadius: "8px",
                                minHeight: "45px",
                                border: "1px solid #d1d5db",
                                "&:hover": {
                                    borderColor: "#0369a1",
                                },
                            }),
                            menu: (base) => ({
                                ...base,
                                borderRadius: "8px",
                                marginTop: "4px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected
                                    ? "#0369a1"
                                    : state.isFocused
                                      ? "#e5e7eb"
                                      : "white",
                                "&:hover": {
                                    backgroundColor: "#e5e7eb",
                                },
                            }),
                        }}
                    />
                </div>

                <div style={formStyles.buttonGroup}>
                    {hasPermission("create_teams") && (
                        <button
                            type="submit"
                            disabled={isWorking}
                            style={formStyles.submitButton}
                        >
                            {isWorking ? "Processing..." : "Submit"}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}

export default TeamForm;
