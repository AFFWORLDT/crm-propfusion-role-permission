import styles from "./AgentChangeModal.module.css";

function AgentChangeModal({
    staffData,
    onChangeAgent,
    isChangingAgent,
    onCloseModal,
}) {
    return (
        <div className={styles.agentModal}>
            <h3>Select Agent</h3>
            <ul>
                {staffData.map((agent) => (
                    <li key={agent.id}>
                        <button
                            onClick={() =>
                                onChangeAgent(agent.id, onCloseModal)
                            }
                            disabled={isChangingAgent}
                        >
                            {agent.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AgentChangeModal;
