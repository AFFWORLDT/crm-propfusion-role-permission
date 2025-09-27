import PageNotFound from "../../pages/PageNotFound";
import Spinner from "../../ui/Spinner";
import styles from "./RentalAgreements.module.css";
import {
    Building2,
    Users,
    Calendar,
    Wallet,
    CreditCard,
    Shield,
    FileText,
    CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function RentalAgreements({ isLoading, error, data, isFetchingNextPage }) {
    const navigate = useNavigate();

    if (isLoading) return <Spinner type="fullPage" />;
    if (error) return <PageNotFound error={error} />;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return 'N/A';
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'AED'
        }).format(amount);
    };

    const handleAgreementClick = (agreementId) => {
        navigate(`/rental-agreement/list/${agreementId}`);
    };

    const handlePropertyClick = (propertyId) => {
        window.open(`/for-rent/new-list/${propertyId}`, '_blank');
    };

    return (
        <div>
            <div className={styles.agreementList}>
                {data?.map((agreement) => (
                    <div
                        key={agreement?.id}
                        className={styles.agreementCard}
                        onClick={() => handleAgreementClick(agreement?.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className={styles.agreementHeader}>
                            <FileText className={styles.headerIcon} />
                            <span className={styles.agreementId}>#{agreement?.id}</span>
                        </div>
                        <div className={styles.details}>
                            <div 
                                className={`${styles.detailItem} ${styles.clickableCell}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePropertyClick(agreement?.property?.id);
                                }}
                            >
                                <Building2 className={styles.detailIcon} />
                                <span className={styles.label}>Property:</span>
                                <span className={styles.value}>
                                    {agreement?.property?.title || agreement?.property_id}
                                    {agreement?.property?.buildingName && ` - ${agreement.property.buildingName}`}
                                    {agreement?.property?.location && ` (${agreement.property.location})`}
                                    {agreement?.property?.property_type && ` [${agreement.property.property_type}]`}
                                </span>
                            </div>
                            <div className={styles.detailItem}>
                                <Users className={styles.detailIcon} />
                                <span className={styles.label}>Tenant :</span>
                                <span className={styles.value}>{agreement?.tenant?.name || agreement?.tenant_id}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Users className={styles.detailIcon} />
                                <span className={styles.label}>Unit Number :</span>
                                <span className={styles.value}>{agreement?.property?.house_no || "--"}</span>
                            </div>

                            <div className={styles.detailItem}>
                                <Users className={styles.detailIcon} />
                                <span className={styles.label}>Building Name :</span>
                                <span className={styles.value}>{agreement?.property?.building?.building_name || "--"}</span>
                            </div>

                            <div className={styles.detailItem}>
                                <Calendar className={styles.detailIcon} />
                                <span className={styles.label}>Start :</span>
                                <span className={styles.value}>{formatDate(agreement?.start_date)}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Calendar className={styles.detailIcon} />
                                <span className={styles.label}>End :</span>
                                <span className={styles.value}>{formatDate(agreement?.end_date)}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Wallet className={styles.detailIcon} />
                                <span className={styles.label}>Rent :</span>
                                <span className={`${styles.value} ${styles.amount}`}>
                                    {formatCurrency(agreement?.rent_amount)}
                                </span>
                            </div>
                            <div className={styles.detailItem}>
                                <CreditCard className={styles.detailIcon} />
                                <span className={styles.label}>Payment :</span>
                                <span className={styles.value}>{agreement?.payment_frequency}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Shield className={styles.detailIcon} />
                                <span className={styles.label}>Deposit :</span>
                                <span className={styles.value}>{formatCurrency(agreement?.security_deposit)}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <CreditCard className={styles.detailIcon} />
                                <span className={styles.label}>Admin Fees :</span>
                                <span className={styles.value}>{agreement?.admin_fees ? formatCurrency(agreement.admin_fees) : 'N/A'}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <CreditCard className={styles.detailIcon} />
                                <span className={styles.label}>Management Fees :</span>
                                <span className={styles.value}>{agreement?.management_fees ? formatCurrency(agreement.management_fees) : 'N/A'}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <CreditCard className={styles.detailIcon} />
                                <span className={styles.label}>Broker Fees :</span>
                                <span className={styles.value}>{agreement?.broker_fees ? formatCurrency(agreement.broker_fees) : 'N/A'}</span>
                            </div>
                        </div>
                        <span className={`${styles.status} ${styles.statusActive}`}>
                            <CheckCircle2 className={styles.statusIcon} />
                            {agreement?.status}
                        </span>
                    </div>
                ))}
            </div>
            {isFetchingNextPage && (
                <div className={styles.loadingMore}>
                    <Spinner type="small" />
                    <span>Loading more agreements...</span>
                </div>
            )}
        </div>
    );
}

export default RentalAgreements;
