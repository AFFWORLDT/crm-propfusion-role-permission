import useAllMetaAds from "./useAllMetaAds";
import Spinner from "../../../ui/Spinner";
import styles from "./ListMetaAds.module.css";
import { useNavigate } from "react-router-dom";
import {
    FormInput,
    User,
    Users,
    Building,
    Home,
    Bed,
    Bath,
    Wallet,
    Calendar,
    CreditCard,
    UserCircle,
    MapPin,
    Building2,
    Factory,
    AlertCircle,
    Pencil,
    Trash2,
    Hash,
} from "lucide-react";
import useDeleteMetaAd from "./useDeleteMetaAd";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";

function ListMetaAds() {
    const { data, isLoading, error } = useAllMetaAds();
    const { mutate: deleteMetaAd, isPending } = useDeleteMetaAd();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFormId, setSelectedFormId] = useState(null);

    const handleEdit = (formId) => {
        navigate(`/meta-ads/edit/${formId}`);
    };

    const handleDelete = (formId) => {
        setSelectedFormId(formId);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedFormId) {
            deleteMetaAd(selectedFormId);
            setIsModalOpen(false);
            setSelectedFormId(null);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFormId(null);
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <AlertCircle size={48} />
                <h2>Error Loading Meta Ads</h2>
                <p>{error.message || "An unexpected error occurred"}</p>
            </div>
        );
    }

    const renderValue = (value) => {
        if (value === null || value === undefined) return "-";
        if (Array.isArray(value)) {
            return (
                <div className={styles.propertyList}>
                    {value.map((item, index) => (
                        <span key={index} className={styles.propertyTag}>
                            {item}
                        </span>
                    ))}
                </div>
            );
        }
        if (typeof value === "object") {
            if (value.city || value.community || value.sub_community || value.property_name) {
                return (
                    <>
                        {value.city && <div>{value.city}</div>}
                        {value.community && <div>{value.community}</div>}
                        {value.sub_community && <div>{value.sub_community}</div>}
                        {value.property_name && <div>{value.property_name}</div>}
                    </>
                );
            }
            return JSON.stringify(value);
        }
        return value;
    };

    const renderPropertyInfo = (properties) => {
        if (!properties?.length) return "-";
        return (
            <div className={styles.scrollableList}>
                {properties.map((prop) => (
                    <div key={prop.id} className={styles.infoCard}>
                        <div className={styles.infoHeader}>
                            <Hash size={16} />
                            <span>{prop.propertyId}</span>
                        </div>
                        <div className={styles.infoTitle}>{prop.title}</div>
                    </div>
                ))}
            </div>
        );
    };

    const renderDeveloperInfo = (developers) => {
        if (!developers?.length) return "-";
        return (
            <div className={styles.scrollableList}>
                {developers.map((dev) => (
                    <div key={dev.id} className={styles.infoCard}>
                        <div className={styles.infoHeader}>
                            {dev.logoUrl && (
                                <img 
                                    src={dev.logoUrl} 
                                    alt={dev.name} 
                                    className={styles.developerLogo}
                                />
                            )}
                            <span>{dev.name}</span>
                        </div>
                        <div className={styles.infoId}>ID: {dev.id}</div>
                    </div>
                ))}
            </div>
        );
    };

    const renderProjectInfo = (projects) => {
        if (!projects?.length) return "-";
        return (
            <div className={styles.scrollableList}>
                {projects.map((proj) => (
                    <div key={proj.id} className={styles.infoCard}>
                        <div className={styles.infoHeader}>
                            <Building2 size={16} />
                            <span>{proj.name}</span>
                        </div>
                        {proj.location && (
                            <div className={styles.projectLocation}>
                                <MapPin size={14} />
                                <span>
                                    {[
                                        proj.location.city,
                                        proj.location.community,
                                        proj.location.sub_community,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderField = (label, value, icon, renderer) => {
        if (value === undefined) return null;
        return (
            <div className={styles.field}>
                <div className={styles.labelWrapper}>
                    {icon}
                    <span className={styles.label}>{label}</span>
                </div>
                <div className={styles.value}>
                    {renderer ? renderer(value) : renderValue(value)}
                </div>
            </div>
        );
    };

    if (!data?.length) {
        return (
            <div className={styles.error}>
                <AlertCircle size={48} />
                <h2>No Meta Ads Found</h2>
                <p>There are no meta ads available at the moment.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete Meta Ad Form"
                message="Are you sure you want to delete this Meta Ad Form? This action cannot be undone."
            />
            {data.map((item) => (
                <div key={item.form_id} className={styles.card}>
                    <div className={styles.actionButtons}>
                        <button
                            className={`${styles.actionButton} ${styles.editButton}`}
                            onClick={() => handleEdit(item.form_id)}
                            title="Edit"
                        >
                            <Pencil size={22} />
                        </button>
                        <button
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => handleDelete(item.form_id)}
                            title="Delete"
                        >
                            <Trash2 size={22} />
                        </button>
                    </div>

                    {/* Section 1: Form Information */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Form Information</h3>
                        <div className={styles.sectionContent}>
                            {renderField("Form Name", item.form_name, <FormInput size={24} />)}
                            {renderField("Form ID", item.form_id, <FormInput size={24} />)}
                            {renderField("Page Name", item.page_name, <FormInput size={24} />)}
                            {renderField("Page ID", item.page_id, <FormInput size={24} />)}
                        </div>
                    </div>

                    {/* Section 2: Client Information */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Client Information</h3>
                        <div className={styles.sectionContent}>
                            {renderField("Client Type", item.clientType, <User size={24} />)}
                            {renderField("Client Source", item.clientSource, <Users size={24} />)}
                            {renderField("Client Sub Source", item.clientSubSource, <Users size={24} />)}
                        </div>
                    </div>

                    {/* Section 3: Location */}
                    {item.location && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Location</h3>
                            <div className={styles.sectionContent}>
                                <div className={styles.location}>
                                    <div className={styles.labelWrapper}>
                                        <MapPin size={24} />
                                        <span className={styles.label}>Location</span>
                                    </div>
                                    <div className={styles.value}>{renderValue(item.location)}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 4: Property Details */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Property Details</h3>
                        <div className={styles.sectionContent}>
                            {renderField("Project Type", item.projectType, <Building size={24} />)}
                            {renderField("Property Types", item.property_type, <Home size={24} />)}
                           
                            {renderField("Rooms", 
                                item.roomsFrom === item.roomsTo
                                    ? item.roomsFrom
                                    : `${item.roomsFrom} - ${item.roomsTo}`,
                                <Bed size={24} />
                            )}
                            {renderField("Bathrooms",
                                item.from_bathroom === item.to_bathroom
                                    ? item.from_bathroom
                                    : `${item.from_bathroom} - ${item.to_bathroom}`,
                                <Bath size={24} />
                            )}
                            {renderField("Budget", `${item.budgetFrom} - ${item.budgetTo}`, <Wallet size={24} />)}
                            {renderField("Payment Method", item.payMethod, <CreditCard size={24} />)}
                            {renderField("Agent ID", item.agent_Id, <UserCircle size={24} />)}
                            {renderField(
                                "Preferred Projects",
                                item.preferred_project_info,
                                <Building2 size={24} />,
                                renderProjectInfo
                            )}
                            {renderField(
                                "Preferred Developers",
                                item.preferred_developer_info,
                                <Factory size={24} />,
                                renderDeveloperInfo
                            )}
                             {renderField(
                                "Preferred Properties",
                                item.preferred_property_info,
                                <Building2 size={24} />,
                                renderPropertyInfo
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ListMetaAds;
