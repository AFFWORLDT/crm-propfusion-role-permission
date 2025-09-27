import styles from './NewTenantsListCard.module.css';
import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';

function NewTenantsListCard({
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    error,
    totalSize,
}) {
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className={styles.container}>
            {data?.map((tenant) => (
                <div key={tenant.id} className={styles.card}>
                    <div className={styles.header}>
                        <img
                            src={tenant.profile_pic}
                            alt={tenant.tenant_name}
                            className={styles.profileImage}
                        />
                        <div className={styles.tenantInfo}>
                            <h3 className={styles.tenantName}>{tenant.tenant_name}</h3>
                            <p className={styles.tenantEmail}>{tenant.tenant_email}</p>
                            {tenant.kyc_verification && (
                                <div className={styles.verificationBadge}>
                                    <CheckCircle size={14} />
                                    Verified
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Emirates ID</span>
                            <span className={styles.value}>{tenant.tenant_emirates_id}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>License No</span>
                            <span className={styles.value}>{tenant.license_no}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Phone</span>
                            <span className={styles.value}>{tenant.tenant_phone}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Date of Birth</span>
                            <span className={styles.value}>
                                {format(new Date(tenant.dob), 'dd MMM yyyy')}
                            </span>
                        </div>
                    </div>

                    <div className={styles.agentSection}>
                        <img
                            src={tenant.agent?.avatar}
                            alt={tenant.agent?.name}
                            className={styles.agentImage}
                        />
                        <div className={styles.agentInfo}>
                            <span className={styles.agentName}>{tenant.agent?.name}</span>
                            <span className={styles.agentEmail}>{tenant.agent?.email}</span>
                        </div>
                    </div>
                </div>
            ))}
            
            {hasNextPage && (
                <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className={styles.loadMoreButton}
                >
                    {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                </button>
            )}
        </div>
    );
}

export default NewTenantsListCard;
