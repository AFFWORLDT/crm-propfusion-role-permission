import { Link } from "react-router-dom";
import SectionTop from "../../ui/SectionTop";
import styles from "./MobileApps.module.css";
import { Smartphone, Globe, Download, ExternalLink, Apple, Play } from "lucide-react";

function MobileApps() {
    const appleStoreUrl = "https://apps.apple.com/us/app/propfusion/id6744414324";
    const playStoreUrl = "https://play.google.com/store/apps/details?id=com.saurabhjaykar1603.PROPFUSIONAPP&hl=en";
    
    return (
        <div className="sectionContainer">
            <SectionTop heading="Mobile Apps">
                <Link to="/admin/general" className="backButton">
                    ← Back to General
                </Link>
            </SectionTop>
            
            <section className="sectionStyles">
                <div className={styles.mobileAppsContainer}>
                    {/* Header Section */}
                    <div className={styles.headerSection}>
                        <div className={styles.headerContent}>
                            <div className={styles.headerIcon}>
                                <Smartphone size={48} />
                            </div>
                            <div className={styles.headerText}>
                                <h1>PropFusion Mobile App</h1>
                                <p>Access your CRM on the go with our powerful mobile applications</p>
                            </div>
                        </div>
                    </div>

                    {/* App Store Links */}
                    <div className={styles.appStoresSection}>
                        <h2>Download Our Apps</h2>
                        <div className={styles.storeButtons}>
                            <a 
                                href={appleStoreUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.storeButton}
                            >
                                <Apple size={24} />
                                <div className={styles.storeButtonText}>
                                    <span className={styles.storeName}>App Store</span>
                                    <span className={styles.storeSubtitle}>Download for iOS</span>
                                </div>
                                <ExternalLink size={20} />
                            </a>
                            
                            <a 
                                href={playStoreUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.storeButton}
                            >
                                <Play size={24} />
                                <div className={styles.storeButtonText}>
                                    <span className={styles.storeName}>Google Play</span>
                                    <span className={styles.storeSubtitle}>Download for Android</span>
                                </div>
                                <ExternalLink size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Login Instructions */}
                    <div className={styles.loginSection}>
                        <h2>How to Login</h2>
                        <div className={styles.loginInfo}>
                            <div className={styles.loginCard}>
                                <h3>Organization-Based Login</h3>
                                <p>Each company has their own unique organization name for secure access to their PropFusion CRM data.</p>
                                
                                <div className={styles.loginSteps}>
                                    <h4>Login Steps:</h4>
                                    <ol>
                                        <li><strong>Download the app</strong> from App Store or Google Play</li>
                                        <li><strong>Open the app</strong> and tap &quot;Login&quot;</li>
                                        <li><strong>Enter your organization name</strong> (provided by your admin)</li>
                                        <li><strong>Enter your username/email</strong> and password</li>
                                        <li><strong>Tap &quot;Sign In&quot;</strong> to access your CRM</li>
                                    </ol>
                                </div>
                                
                                <div className={styles.organizationNote}>
                                    <h4>Important:</h4>
                                    <ul>
                                        <li>Your organization name is unique to your company</li>
                                        <li>This ensures you only access your company&apos;s data</li>
                                        <li>Contact your system administrator if you don&apos;t know your organization name</li>
                                        <li>The app will automatically connect to your company&apos;s secure API endpoints</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}

export default MobileApps;
