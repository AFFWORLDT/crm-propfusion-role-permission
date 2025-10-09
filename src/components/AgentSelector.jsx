import React, { useState, useEffect } from "react";
import { getStaff } from "../services/apiStaff";
import { User, Users } from "lucide-react";
import toast from "react-hot-toast";
import styles from "./AgentSelector.module.css";

function AgentSelector({ selectedAgent, onAgentChange }) {
    const [agents, setAgents] = useState([]);
    const [loadingAgents, setLoadingAgents] = useState(false);

    // Fetch all agents
    useEffect(() => {
        const fetchAgents = async () => {
            setLoadingAgents(true);
            try {
                const data = await getStaff("all");
                setAgents(data || []);
            } catch (error) {
                console.error("Error fetching agents:", error);
                toast.error("Failed to fetch agents");
            } finally {
                setLoadingAgents(false);
            }
        };

        fetchAgents();
    }, []);

    const handleAgentChange = (agentId) => {
        const agent = agents.find((a) => a.id === parseInt(agentId));
        onAgentChange(agent);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerIcon}>
                    <Users />
                </div>
                <div className={styles.headerContent}>
                    <h2>Agent Wallet Dashboard</h2>
                    <p>
                        Select an agent to view their wallet balance and
                        transaction history
                    </p>
                </div>
            </div>

            <div className={styles.selectorContainer}>
                <label className={styles.label}>Choose Agent</label>
                <select
                    value={selectedAgent?.id || ""}
                    onChange={(e) => handleAgentChange(e.target.value)}
                    disabled={loadingAgents}
                    className={styles.select}
                >
                    <option value="">Select an agent to begin...</option>
                    {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                            {agent.name} ({agent.email})
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default AgentSelector;
