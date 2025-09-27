import styles from "../../styles/Listings.module.css";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import {
    bedroomString,
    dateToYMD,
    formatNum,
    getDaysFromCurrentDate,
} from "../../utils/utils";
import useCreateProject from "./useCreateProject";
import { useAuth } from "../../context/AuthContext";
import { POOL_TYPES } from "../../utils/constants";

function NewProjects({ 
    isLoading, 
    data, 
    error,
    isFetchingNextPage 
}) {
    const navigate = useNavigate();
    const { addProject, isPending } = useCreateProject();
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();
    const projectStatus = searchParams.get("status");

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    function handleNavigate(id) {
        projectStatus === "POOL"
            ? navigate(`/new-projects/list/${id}?status=POOL`)
            : navigate(`/new-projects/list/${id}`);
    }

    function handleClaim(data) {
        data.projectStatus = "ACTIVE";
        addProject({ newProject: { ...data, agent_Id: currentUser.id } });
    }

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            {isLoading ? (
                <div >
                    <Spinner type="fullPage" />
                </div>
            ) : (
                <>
                    <div className={styles.listings}>
                        {data.map((item) => {
                            // Find the pool type configuration based on item.pool_type
                            const poolTypeConfig = POOL_TYPES.find(
                                (type) => type.value === item.pool_type
                            );

                            return (
                                <div className={styles.listingItem} key={item.id}>
                                    <div
                                        className="imgContainer"
                                        onClick={() => handleNavigate(item.id)}
                                        style={{ position: "relative" }}
                                    >
                                        <img src={item?.photos?.[0]} alt={item?.name} />
                                        {poolTypeConfig && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "16px",
                                                    left: "16px",
                                                    background: "rgba(255,255,255,0.98)",
                                                    borderRadius: "12px",
                                                    minWidth: "90px",
                                                    height: "38px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-start",
                                                    gap: "8px",
                                                    fontSize: "18px",
                                                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                                    zIndex: 10,
                                                    border: "1px solid #e5e7eb",
                                                    padding: "0 14px",
                                                    fontWeight: 500,
                                                }}
                                                title={poolTypeConfig.label}
                                                aria-label={`Pool Type: ${poolTypeConfig.label}`}
                                            >
                                                <span style={{ display: "flex", alignItems: "center" }}>
                                                    {poolTypeConfig.icon}
                                                </span>
                                                <span style={{
                                                    marginLeft: "4px",
                                                    fontSize: "15px",
                                                    color: "#444",
                                                    fontWeight: 600,
                                                    textTransform: "capitalize",
                                                    letterSpacing: "0.01em"
                                                }}>
                                                    {poolTypeConfig.label}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.listingContent}>
                                        <div className={styles.listingTop}>
                                            <h2>{item?.name}</h2>
                                            <div>
                                                {projectStatus === "POOL" && (
                                                    <button
                                                        className="btnNormalSmall"
                                                        onClick={() =>
                                                            handleClaim(item)
                                                        }
                                                        disabled={isPending}
                                                    >
                                                        Claim
                                                    </button>
                                                )}
                                                <span>
                                                    {`${getDaysFromCurrentDate(item?.createTime)} days ago`}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={styles.listingType}>
                                            {item?.propertyTypes?.join(" ")}
                                        </span>
                                        <p
                                            className={styles.price}
                                            onClick={() => handleNavigate(item.id)}
                                        >
                                            <span>
                                                {formatNum(item?.newParam?.price)}
                                            </span>
                                            <span>AED Starting</span>
                                        </p>
                                        <ul onClick={() => handleNavigate(item.id)}>
                                            <li>
                                                <span>Area</span>
                                                <span>{item?.area?.name || "N/A"}</span>
                                            </li>
                                            <li>
                                                <span>Developer</span>
                                                <span>
                                                    {item?.developer?.name || "N/A"}
                                                </span>
                                            </li>
                                            <li>
                                                <span>Handover</span>
                                                <span>
                                                    {dateToYMD(
                                                        item?.newParam?.handoverTime
                                                    ) || "N/A"}
                                                </span>
                                            </li>
                                            <li>
                                                <span>Bedrooms</span>
                                                <span>
                                                    {`${bedroomString(item?.newParam?.bedroomMin)} - ${bedroomString(item?.newParam?.bedroomMax)}`}
                                                </span>
                                            </li>
                                            <li>
                                                <span>Size</span>
                                                <span>
                                                    {`${item?.newParam?.size_min || "N/A"} - ${item?.newParam?.size_max || "N/A"} sq.ft`}
                                                </span>
                                            </li>
                                            <li>
                                                <span>Agent</span>
                                                <span>
                                                    {item?.agent?.name || "N/A"}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {isFetchingNextPage && (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            padding: '1rem',
                            backgroundColor: 'transparent' 
                        }}>
                            <Spinner />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default NewProjects;
