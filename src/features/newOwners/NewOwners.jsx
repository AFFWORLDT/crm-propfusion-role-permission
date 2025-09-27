import { useEffect, useRef } from 'react';
import styles from './NewOwners.module.css';
import OwnerMenus from './OwnerMenus';
import AssignedOwnerButton from '../Tenants/AssinedOwnerButton';

function NewOwners({
    isLoading,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
}) {
    const loadMoreRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div >
            {data.map((owner) => (
                <div key={owner.id} className={styles.ownerCard}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatar}>
                            {owner.profile_pic && owner.profile_pic !== '' ? (
                                <img 
                                    src={owner.profile_pic} 
                                    alt={`${owner.owner_name}'s profile`}
                                    className={styles.profileImage}
                                />
                            ) : (
                                getInitials(owner.owner_name)
                            )}
                        </div>
                        <div className={styles.badge}>{owner.owner_type}</div>
                    </div>
                    <div className={styles.detailsSection}>
                        <div className={styles.header}>
                            <h2 className={styles.ownerName}>{owner.owner_name}</h2>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <span className={styles.label}>License Number</span>
                                <div className={styles.value}>{owner.license_no}</div>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.label}>Nationality</span>
                                <div className={styles.value}>{owner.nationality}</div>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.label}>Lessor Name</span>
                                <div className={styles.value}>{owner.lessor_name}</div>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.label}>Lessor Email</span>
                                <div className={styles.value}>{owner.lessor_email}</div>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.label}>Phone</span>
                                <div className={styles.value}>{owner.lessor_phone}</div>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.label}>Secondary Phone</span>
                                <div className={styles.value}>{owner.secondryPhone}</div>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.label}>Emirates ID</span>
                                <div className={styles.value}>{owner.lessor_emirates_id}</div>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.label}>Agent Name</span>
                                <div className={styles.value}>{owner.agent_name || 'Not Assigned'}</div>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.label}>Date of Birth</span>
                                <div className={styles.value}>{owner.dob ? formatDate(owner.dob) : 'N/A'}</div>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.label}>Created At</span>
                                <div className={styles.value}>{formatDate(owner.created_at)}</div>
                            </div>
                            {owner.owner_info && (
                                <div className={styles.field}>
                                    <span className={styles.label}>Additional Info</span>
                                    <div className={styles.value}>{owner.owner_info}</div>
                                </div>
                            )}
                        </div>
                        <div className={styles.menuContainer}>
                            <OwnerMenus ownerId={owner.id} />
                        </div>
                        <div className={styles.bottomRightAction}>
                            <AssignedOwnerButton id={owner.id}  name={owner.agent_name} ownerName={owner.owner_name}/>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={loadMoreRef} className={styles.loadingMore}>
                {isFetchingNextPage 
                    ? 'Loading more...'
                    : hasNextPage 
                        ? 'Scroll to load more'
                        : 'No more owners to load'}
            </div>
        </div>
    );
}

export default NewOwners;
