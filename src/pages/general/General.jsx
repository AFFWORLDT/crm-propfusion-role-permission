import { Link } from "react-router-dom";
import SectionTop from "../../ui/SectionTop";
import styles from "./General.module.css";
import { Mail, MessageCircle, Server } from "lucide-react";
import { useDefaultSetting } from "../../store/defaultSettingStore";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useMyPermissions } from "../../hooks/useHasPermission";
import LanIcon from "@mui/icons-material/Lan";

function General() {
    const { view, setDefaultListView } = useDefaultSetting();
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === "admin" || currentUser?.role === "";

    return (
        <div className="sectionContainer">
            <SectionTop heading={`General`}>
               
            </SectionTop>
            <section
                className="sectionStyles"
              
            >
                <div
                    className={` ${styles.generalContainer}`}
                   
                >
                    <ul className={styles.generalList}>
                        <li>Info</li>
                        <li>
                            <Link to="manage-leads-interfaces">
                                <img src="/icons/build.svg" className={styles.generalListImg} />
                                <span>Manage Leads Interfaces</span>
                            </Link>
                        </li>
                        {/* <li>
                            <Link to="/user-manual">
                                <img src="/icons/book.svg" className={styles.generalListImg} />
                                <span>User Manual</span>
                            </Link>
                        </li> */}
                        <li>
                            <Link to="manage-areas">
                                <img src="/icons/location.svg" className={styles.generalListImg} />
                                <span>Manage Areas</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="manage-developers">
                                <img src="/icons/build.svg" className={styles.generalListImg} />
                                <span>Manage Developers</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="lead-rotation">
                                <img src="/icons/refresh.svg" className={styles.generalListImg} />
                                <span>Lead Rotation</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="manage-manufacturers">
                                <img src="/icons/build.svg" className={styles.generalListImg} />
                                <span>Manage Manufacturers</span>
                            </Link>
                        </li>
                        {
                            <>
                                <li>
                                    <Link to="manage-company">
                                        <img src="/icons/detail.svg" className={styles.generalListImg} />
                                        <span>Manage Company Details</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="manage-meta-ads">
                                        <img src="/icons/settings.svg" className={styles.generalListImg} />
                                        <span>Manage Meta Ads</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="manage-calls">
                                        <img src="/icons/settings.svg" className={styles.generalListImg} />
                                        <span>Manage Calls</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="xml-feeds">
                                        <img src="/icons/settings.svg" className={styles.generalListImg} />
                                        <span>XML Feeds</span>
                                    </Link>
                                </li>
                            </>
                        }

                        <li>
                            <Link to="https://affworld.io/campaign/PropFusion">
                                <img src="/icons/share-social.svg" className={styles.generalListImg} />
                                <span>Share with Friends</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="">
                                <img src="/icons/tag.svg" className={styles.generalListImg}             />
                                <span>White Label</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="smtp-setting">
                                <Mail className={styles.generalListImg} />
                                <span>Smtp Setting</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="web-apis">
                                <Server className={styles.generalListImg} />
                                <span>Website Apis</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="mobile-apps">
                                <img src="/icons/phone.svg" className={styles.generalListImg} />
                                <span>Mobile Apps</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/whatsapp-logs">
                                <MessageCircle className={styles.generalListImg} />
                                <span>Whatsapp Logs</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/integration">
                                <LanIcon className={styles.generalListImg} style={{
                                    width: "3.5rem",
                                    height: "3.5rem",
                                }} />
                                <span>Integrations</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/general/currency-converter">
                                <img src="/icons/wallet.svg" alt="Currency Icon" className={styles.generalListImg} />
                                <span>Currency Converter</span>
                            </Link>
                        </li>
                    </ul>

                    <ul className={styles.generalList}>
                        <li>Product</li>
                        {
                            <li>
                                <Link to="subscription">
                                    <img src="/icons/person-add.svg" className={styles.generalListImg} />
                                    <span>Subscription Details</span>
                                </Link>
                            </li>
                        }
                        {
                            <li>
                                <Link to="organisation-wallet">
                                    <img src="/icons/wallet.svg" className={styles.generalListImg} />
                                    <span>Organisation Wallet</span>
                                </Link>
                            </li>
                        }
                        <li
                            style={{
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                view === "card"
                                    ? setDefaultListView("list")
                                    : setDefaultListView("card");
                                toast.success(
                                    `Default listing view changed to  ${view === "card" ? "List" : "Card"}`
                                );
                            }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                            }}  >
                                <img src="/icons/eye.svg" className={styles.generalListImg} />

                                <span>
                                    Default Listing View -{" "}
                                    {view === "card" ? "Card" : "List"}
                                </span>
                            </div>
                        </li>

                        <li>
                            <Link to="request-feature">
                                <img src="/icons/sparkles.svg" className={styles.generalListImg} />
                                <span>Request a Feature</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="updates">
                                <img src="/icons/notifications.svg" className={styles.generalListImg} />
                                <span>Updates</span>
                            </Link>
                        </li>

                        <li>
                            <button
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",

                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    font: "inherit",
                                    color: "inherit",
                                }}
                                onClick={() => {
                                    localStorage.removeItem("app_features");
                                    window.location.reload();
                                }}
                            >
                                <img
                                    src="/icons/refresh.svg"
                                    alt="Refresh"
                                    className={styles.generalListImg}
                                />
                                <span>Refresh Features</span>
                            </button>
                        </li>
                        <li>
                            <Link to="roles-permissions">
                                <img src="/icons/settings.svg" className={styles.generalListImg} />
                                <span>Manage Roles & Permissions</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="meta-ads">
                                <img src="/icons/settings.svg" className={styles.generalListImg} />
                                <span>Meta Ads</span>
                            </Link>
                        </li>
                        {isAdmin && (
                            <li>
                                <Link to="subscription">
                                    <img src="/icons/person-add.svg" className={styles.generalListImg}  />
                                    <span>Subscription Details</span>
                                </Link>
                            </li>
                        )}

                        {/* <li>
                            <Link to="">
                                <img src="/icons/mail.svg" className={styles.generalListImg} />
                                <span>Contact Us</span>
                            </Link>
                        </li> */}

                        <li>
                            <Link to="">
                                <img src="/icons/feedback.svg" className={styles.generalListImg} />
                                <span>Feedback</span>
                            </Link>
                        </li>
                        {/* <li>
                            <Link to="raise-issue">
                                <img src="/icons/bug.svg" className={styles.generalListImg} />
                                <span>Raise Issue</span>
                            </Link>
                        </li> */}


                        {/* <li>
                            <Link to="support">
                                <img src="/icons/support.svg" className={styles.generalListImg} />
                                <span>Support</span>
                            </Link>
                        </li> */}
                        {(window.location.hostname === 'propfusion-portal.propfusion.ae' ||
                          (window.location.hostname === 'localhost' && window.location.port === '5173')) && (
                            <li>
                                <Link to="resolve-request">
                                    <img src="/icons/check-circle.svg" className={styles.generalListImg} />
                                    <span>Resolve Requests</span>
                                </Link>
                            </li>
                        )}
                    </ul>
{/* 
                    <ul className={styles.generalList}>
                        <li>Legal Policies</li>
                        <li>
                            <Link to="/propfusion-policies">
                                <img src="/icons/detail.svg" className={styles.generalListImg}  />
                                <span>Policies</span>
                            </Link>
                        </li>
                    </ul> */}
                </div>
            </section>
        </div>
    );
}

export default General;
