import styles from "./../../styles/Audience.module.css";
import { Users, Plus } from "lucide-react";
import useAudiences from "./useAudince";

function Header({ handleCreateClick, audienceType, setAudienceType }) {
    const { data = [] } = useAudiences(1, 10);

    // Filter unique audience types
    const uniqueAudienceTypes = Array.from(
        new Set(data?.items?.map((option) => option.audience_type))
    );

    return (
        <div className={styles.header}>
            <div className={styles.headerWithIcon}>
                <Users
                    className={`${styles.icon} ${styles.iconLarge} ${styles.iconBlue}`}
                />
                <h1>Audience Management</h1>
            </div>
            <div className={styles.controls}>
                <div className={styles.selectGroup}>
                    <label htmlFor="audienceType" className={styles.label}>
                        Select Audience Type:
                    </label>
                    <select
                        id="audienceType"
                        className={styles.select}
                        value={audienceType}
                        onChange={(e) => setAudienceType(e.target.value)}
                    >
                        <option value="">All</option>
                        {uniqueAudienceTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.buttonGroup}>
                    <button
                        className={`${styles.createButton} ${styles.createSimpleButton}`}
                        onClick={() => handleCreateClick(true)}
                    >
                        <Plus
                            className={`${styles.icon} ${styles.iconSmall}`}
                        />
                        Quick Create
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header;
