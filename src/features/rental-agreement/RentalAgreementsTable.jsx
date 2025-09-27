import PageNotFound from "../../pages/PageNotFound";
import Spinner from "../../ui/Spinner";
import EditRentalAgreeMent from "./EditRentalAgreeMent";
import styles from "./RentalAgreements.module.css";
import { useNavigate } from "react-router-dom";
import { FileText, Building2, Users, Calendar, CreditCard, CheckCircle2 } from "lucide-react";
import Table from "../../ui/Table";

function RentalAgreementsTable({ isLoading, error, data, isFetchingNextPage }) {
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

    const handleDetailsClick = (agreementId) => {
        navigate(`/rental-agreement/list/${agreementId}`);
    };

    const handleEditClick = (agreementId) => {
        navigate(`/rental-agreement/edit/${agreementId}`);
    };

    const handlePropertyClick = (propertyId) => {
        window.open(`/for-rent/new-list/${propertyId}`, '_blank');
    };

    const columns = "80px 250px 150px 100px 150px 120px 120px 120px 120px 100px 120px 120px 100px 100px";

    return (
        <div className={styles.tableContainer}>
            <Table columns={columns} rowWidth="1800px">
                <Table.Header>
                    <div>ID</div>
                    <div>Property</div>
                    <div>Tenant</div>
                    <div>Unit Number</div>
                    <div>Building Name</div>
                    <div>Ejari No</div>
                    <div>Start Date</div>
                    <div>End Date</div>
                    <div>Rent</div>
                    <div>Payment</div>
                    <div>Deposit</div>
                    <div>Status</div>
                    <div>Details</div>
                    <div>Edit</div>
                </Table.Header>
                <Table.Body 
                    data={data} 
                    render={(agreement) => (
                        <Table.Row key={agreement?.id}>
                            <div className={styles.tableCell}>
                                <FileText className={styles.tableIcon} />
                                #{agreement?.id}
                            </div>
                            <div 
                                className={`${styles.tableCell} ${styles.clickableCell}`}
                                onClick={() => handlePropertyClick(agreement?.property?.id)}
                            >
                                <Building2 className={styles.tableIcon} />
                                <div className={styles.propertyInfo}>
                                    <div >{agreement?.property?.title || agreement?.property_id}</div>
                                    <div className={styles.unitNumber}>Unit: {agreement?.property?.house_no || "--"}</div>
                                    <div className={styles.propertyDetails}>
                                        {agreement?.property?.buildingName && `Building: ${agreement?.property?.buildingName} | `}
                                        {agreement?.property?.location && `Location: ${agreement?.property?.location} | `}
                                        {agreement?.property?.property_type && `Type: ${agreement?.property?.property_type}`}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.tableCell}>
                                <Users className={styles.tableIcon} />
                                {agreement?.tenant?.name || agreement?.tenant_id}
                            </div>
                            <div className={styles.tableCell}>
                                {agreement?.property?.house_no || "--"}
                            </div>
                            <div className={styles.tableCell}>
                                {agreement?.property?.building?.building_name || "--"}
                            </div>
                            <div className={styles.tableCell}>
                                {agreement?.ejari_no || "--"}
                            </div>
                            <div className={styles.tableCell}>
                                <Calendar className={styles.tableIcon} />
                                {formatDate(agreement?.start_date)}
                            </div>
                            <div className={styles.tableCell}>
                                <Calendar className={styles.tableIcon} />
                                {formatDate(agreement?.end_date)}
                            </div>
                            <div className={styles.tableCell}>
                                <CreditCard className={styles.tableIcon} />
                                {formatCurrency(agreement?.rent_amount)}
                            </div>
                            <div className={styles.tableCell}>
                                {agreement?.payment_frequency}
                            </div>
                            <div className={styles.tableCell}>
                                {formatCurrency(agreement?.security_deposit)}
                            </div>
                            <div className={`${styles.tableCell} ${styles.statusCell}`}>
                                <CheckCircle2 className={styles.tableIcon} />
                                {agreement?.status}
                            </div>
                            <div className={styles.tableCell}>
                                <button 
                                    className={styles.actionButton}
                                    onClick={() => handleDetailsClick(agreement?.id)}
                                >
                                    Details
                                </button>
                            </div>
                            <div className={styles.tableCell}>
                                <EditRentalAgreeMent defaultValues={agreement}>
                                    <button 
                                        className={styles.actionButton}
                                        onClick={() => handleEditClick(agreement?.id)}
                                    >
                                        Edit
                                    </button>
                                </EditRentalAgreeMent>
                            </div>
                        </Table.Row>
                    )}
                />
            </Table>
            {isFetchingNextPage && (
                <div className={styles.loadingMore}>
                    <Spinner type="small" />
                    <span>Loading more agreements...</span>
                </div>
            )}
        </div>
    );
}

export default RentalAgreementsTable; 