
import { Link } from 'react-router-dom';
import styles from './ViewingsInGrid.module.css';


function ViewingsInGrid({
    data,
    isFetchingNextPage,
    hasNextPage,
})

{
    return (
        <div className={styles.gridContainer}>
            {data.map(viewing => (
                <Link to={`/viewings/${viewing?.id}`} key={viewing?.id} className={styles.gridItemLink}>
                    <div className={styles.gridItem}>
                        <h3>{viewing?.property?.title}</h3>
                        <p>Date: {new Date(viewing?.viewing_date).toLocaleString()}</p>
                        <div className={styles.agentInfo}>
                            <img 
                                src={viewing?.agent?.avatar} 
                                alt={viewing?.agent?.name} 
                                className={styles.agentAvatar}
                            />
                            <div className={styles.agentDetails}>
                                <p>{viewing?.agent?.name}</p>
                                {/* You can add agent email/phone here if needed */}
                            </div>
                        </div>
                        <p>Client: {viewing?.client_name}</p>
                        <p>Status: {viewing?.status}</p>
                        {/* Add more viewing details as needed */}
                    </div>
                </Link>
            ))}
             {isFetchingNextPage && (
                <div className={styles.loadingRow}>Loading more viewings...</div>
            )}

            {!isFetchingNextPage && !hasNextPage && data.length > 0 && (
                <div className={styles.noMoreDataRow}>No more viewings available</div>
            )}
        </div>
    );
}

export default ViewingsInGrid; 