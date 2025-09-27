/**
 * About Us Page Component
 * 
 * This component displays comprehensive information about PropFusion CRM,
 * including company mission, services, and contact information.
 * 
 * Features:
 * - Hero section with company branding and call-to-action buttons
 * - Dynamic content sections for company information
 * - SEO optimization with Helmet meta tags
 * - Responsive design with modern styling
 * - Integration with support tab navigation
 * 
 * @component
 * @returns {JSX.Element} The About Us page component
 */
import { Link } from "react-router-dom";
import SectionTop from "../../../ui/SectionTop";
import TabBar from "../../../ui/TabBar";
import { SUPPORT_TABS } from "../../../utils/constants";
import styles from "./PAboutUs.module.css";
import { Helmet } from "react-helmet";

const About = () => {
    /**
     * Company information data structure
     * Contains all the content sections displayed on the About Us page
     * Each object includes heading, content, and optional anchor links
     */
    const aboutList = [
        {
            heading: "Our Mission",
            content:
                "At PropFusion CRM, our mission is to empower real estate professionals with cutting-edge technology to enhance their operations, streamline workflows, and maximize sales potential. We provide a powerful, user-friendly CRM platform that helps real estate businesses manage leads, track opportunities, and boost team efficiency.",
            anchor: "",
        },
        {
            heading: "Who We Are",
            content:
                "PropFusion CRM is a leading customer relationship management platform designed specifically for the real estate industry. Founded in [Year], we’ve grown to become a trusted partner for real estate agencies, brokers, and property managers worldwide. Our platform is built to facilitate smooth communication, automate time-consuming tasks, and provide real-time insights that drive business growth.",
            anchor: "",
        },
        {
            heading: "What We Do",
            content:
                " Digital Advertising Solutions: We offer a comprehensive platform for businesses to purchase ad space globally, ensuring their messages  reach the right audience at the right time.",
            anchor: "",
        },
        {
            heading: "Real Estate CRM Solutions:",
            content:
                " PropFusion CRM offers a comprehensive platform to manage leads, properties, clients, and agents—all in one place. Our user-friendly interface ensures seamless management of every aspect of a real estate business, empowering teams to focus on closing deals.",
            anchor: "",
        },
        // {
        //   heading : "Influencer Marketing:",
        //   content : " Our platform connects brands with influencers who can authentically promote their products and services, driving engagement and conversions.",
        //   anchor : ""
        // },
        {
            heading: "Lead Management:",
            content:
                " With PropFusion CRM, real estate professionals can track leads from various sources, categorize them, and nurture them through the sales funnel. Our system ensures no lead is ever missed, and every opportunity is maximized.",
            anchor: "",
        },
        // {
        //   heading : "Influencer Agents:",
        //   content :" We provide influencer agents to manage and negotiate influencer partnerships, ensuring that both brands and influencers achieve their goals.",
        //   anchor : ""
        // },
        {
            heading: "Property Listing Management:",
            content:
                "Our platform simplifies the process of listing properties, providing tools to upload, organize, and share property details easily. Whether you're managing a single property or an entire portfolio, PropFusion CRM makes it simple.",
            anchor: "",
        },
        // {
        //   heading : "Ad Space Buying:",
        //   content : "  With our global reach, businesses can buy ad space in various formats and locations, maximizing their visibility and impact. Our Values",
        //   anchor : ""
        // },
        {
            heading: "Team Collaboration:",
            content:
                "Real estate teams can easily collaborate and stay on top of their tasks with our CRM, which includes features like task management, agent tracking, and automated follow-up reminders. This enhances overall team productivity and coordination.",
            anchor: "",
        },
        {
            heading: "Our Values",
            content: "",
            anchor: "",
        },

        {
            heading: "Innovation:",
            content:
                "We are dedicated to providing the latest technologies and innovations to our clients. We continuously evolve our platform to keep up with the changing demands of the real estate market.",
            anchor: "",
        },
        {
            heading: "Efficiency:",
            content:
                "Our platform is designed to help real estate professionals work smarter, not harder. We streamline operations, automate repetitive tasks, and provide insights to enhance decision-making and drive growth.",
            anchor: "",
        },
        {
            heading: "Customer Success:",
            content:
                " At PropFusion CRM, our top priority is helping our clients succeed. We are committed to providing exceptional customer support and building long-term partnerships with every user.",
            anchor: "",
        },
        {
            heading: "Meet Our Team",
            content:
                "Our team consists of real estate professionals, technologists, and customer support experts who are passionate about transforming the way real estate businesses operate. We combine industry knowledge with advanced technology to build a CRM platform that truly meets the needs of today’s real estate professionals.",
            anchor: "",
        },
        {
            heading: "Our Vision",
            content:
                "  Our vision is to be the leading CRM provider in the real estate industry. We strive to help businesses of all sizes grow and succeed by providing innovative, efficient, and scalable CRM solutions tailored specifically to the real estate market.",
            anchor: "",
        },
        {
            heading: "Join Us on Our Journey",
            content:
                "Whether you're a real estate agent, broker, or property manager, PropFusion CRM is here to help you streamline your operations, manage your clients and properties more effectively, and drive sales growth. Join us today and experience how our CRM can transform your real estate business.",
            // anchor : [
            //   {
            //     path : "https://Propfusion.io/login",
            //     pathName : "www.Propfusion.com"
            //   }
            // ]
        },
        {
            heading: "",
            content:
                "For more information about our services and how we can help you achieve your goals, visit our website:",
            anchor: [
                {
                    path: "https://www.propfusion.com/",
                    pathName: "www.Propfusion.com",
                },
            ],
        },
        {
            heading: "",
            content: "Contact Us",
            anchor: [
                {
                    path: "mailto:support@Propfusion.io",
                    pathName: "support@Propfusion.io",
                },
            ],
        },
        {
            heading: "Dubai Office:",
            content: " AffWorld Fz LLC 512 ONYX TOWER 2 , Dubai, UAE",
            anchor: "",
        },
    ];

    return (
        <div className="sectionContainer">
            {/* 
                Section Top Component with Tab Navigation
                Provides the page header and navigation tabs for support sections
            */}
            <SectionTop heading="Support">
                <TabBar
                    tabs={SUPPORT_TABS}
                    activeTab={"ABOUT"}
                    navigateTo={(id) =>
                        SUPPORT_TABS.find((tab) => tab.id === id)?.path ||
                        "/admin/general/support"
                    }
                />
            </SectionTop>
            
            <div className="sectionStyles">
                {/* 
                    SEO Meta Tags for better search engine optimization
                    Includes title, description, and keywords for the About Us page
                */}
                <Helmet>
                    <title>About Us | Propfusion Policies</title>
                    <meta
                        name="description"
                        content="Learn about Propfusion.io, an innovative IT company delivering cutting-edge solutions. Meet our expert team and explore our mission to empower businesses globally."
                    />
                    <meta
                        name="keywords"
                        content="Propfusion.io, technology experts, digital transformation, About us, Propfusion, Propfusion About Us"
                    />
                </Helmet>

                {/* Main Website Content Container */}
                <div className={styles.websiteContainer}>
                    {/* 
                        Hero Section - Main banner with company branding
                        Features gradient background, company title, tagline, and action buttons
                    */}
                    <section className={styles.heroSection}>
                        <div className={styles.heroContent}>
                            <h1 className={styles.heroTitle}>PROPFUSION CRM</h1>
                            <p className={styles.heroSubtitle}>
                                Empowering Real Estate Professionals with Cutting-Edge Technology
                            </p>
                            {/* Action buttons for external links and contact */}
                            <div className={styles.heroButtons}>
                                <a 
                                    href="https://www.propfusion.com/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={styles.primaryButton}
                                >
                                    Visit Website
                                </a>
                                <a 
                                    href="mailto:support@Propfusion.io" 
                                    className={styles.secondaryButton}
                                >
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Main Content Sections Container */}
                    <div className={styles.mainContent}>
                        {/* 
                            About Section - Company information cards
                            Displays mission, services, and company details in a responsive grid
                        */}
                        <section className={styles.aboutSection}>
                            <div className={styles.sectionHeader}>
                                <h2>About PropFusion</h2>
                                <div className={styles.divider}></div>
                            </div>
                            {/* 
                                Dynamic grid of company information cards
                                Maps through aboutList array to render each section
                            */}
                            <div className={styles.aboutGrid}>
                                {aboutList.slice(0, 4).map((item, index) => (
                                    <div key={index} className={styles.aboutCard}>
                                        {/* Render heading if available */}
                                        {item.heading && <h3>{item.heading}</h3>}
                                        {/* Render content if available */}
                                        {item.content && <p>{item.content}</p>}
                                        {/* Render anchor links if available */}
                                        {item.anchor && item.anchor.length > 0 && (
                                            <div className={styles.cardLinks}>
                                                {item.anchor.map((AnItem, AnIndex) => (
                                                    <a 
                                                        key={AnIndex}
                                                        href={AnItem.path} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className={styles.cardLink}
                                                    >
                                                        {AnItem.pathName}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Services Section */}
                        <section className={styles.servicesSection}>
                            <div className={styles.sectionHeader}>
                                <h2>Our Services</h2>
                                <div className={styles.divider}></div>
                            </div>
                            <div className={styles.servicesGrid}>
                                {aboutList.slice(4, 7).map((item, index) => (
                                    <div key={index + 4} className={styles.serviceCard}>
                                        {item.heading && <h3>{item.heading}</h3>}
                                        {item.content && <p>{item.content}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Values Section */}
                        <section className={styles.valuesSection}>
                            <div className={styles.sectionHeader}>
                                <h2>Our Values</h2>
                                <div className={styles.divider}></div>
                            </div>
                            <div className={styles.valuesGrid}>
                                {aboutList.slice(7, 12).map((item, index) => (
                                    <div key={index + 7} className={styles.valueCard}>
                                        {item.heading && <h3>{item.heading}</h3>}
                                        {item.content && <p>{item.content}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Section */}
                <footer className={styles.footer}>
                    <div className={styles.footerContainer}>
                        {/* Company Info */}
                        <div className={styles.footerSection}>
                            <h3>PropFusion Technologies</h3>
                            <p>Empowering real estate professionals with cutting-edge CRM solutions.</p>
                            <div className={styles.socialLinks}>
                                <a href="https://facebook.com/people/Propfusion-Technologies/61556653426093/" target="_blank" rel="noopener noreferrer">
                                    📘 Facebook
                                </a>
                                <a href="https://linkedin.com/company/Propfusion-technologies" target="_blank" rel="noopener noreferrer">
                                    💼 LinkedIn
                                </a>
                                <a href="https://instagram.com/Propfusion.IO" target="_blank" rel="noopener noreferrer">
                                    📸 Instagram
                                </a>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className={styles.footerSection}>
                            <h3>Contact Us</h3>
                            <div className={styles.contactInfo}>
                                <p>📧 <a href="mailto:support@Propfusion.io">support@Propfusion.io</a></p>
                                <p>📞 <a href="tel:+971542997582">+971 54 299 7582</a></p>
                                <p>💬 <a href="https://Propfusion.io/login" target="_blank" rel="noopener noreferrer">Live Chat</a></p>
                            </div>
                            <div className={styles.businessContact}>
                                <p><strong>Business Inquiries:</strong></p>
                                <p>📧 <a href="mailto:business@Propfusion.io">business@Propfusion.io</a></p>
                            </div>
                            <div className={styles.techSupport}>
                                <p><strong>Technical Support:</strong></p>
                                <p>📧 <a href="mailto:Supportcrm@Propfusion.io">Supportcrm@Propfusion.io</a></p>
                            </div>
                        </div>

                        {/* Office Locations */}
                        <div className={styles.footerSection}>
                            <h3>Our Offices</h3>
                            <div className={styles.officeInfo}>
                                <div className={styles.office}>
                                    <h4>Dubai Office</h4>
                                    <p>AffWorld Fz LLC<br />512 ONYX TOWER 2<br />Dubai, UAE</p>
                                </div>
                                <div className={styles.office}>
                                    <h4>India Office</h4>
                                    <p>Technology Bhamashah Technhub<br />5th Floor, RAJASTHAN INTERNATIONAL CENTRE<br />Jaipur, Rajasthan 302020, India</p>
                                    <a href="https://maps.app.goo.gl/rwTYWuaD8C9StUMZA" target="_blank" rel="noopener noreferrer">
                                        📍 View on Google Maps
                                    </a>
                                </div>
                            </div>
                            <div className={styles.officeHours}>
                                <h4>Office Hours</h4>
                                <p>Monday - Friday: 8:00 AM - 10:00 PM</p>
                                <p>Saturday: 10:00 AM - 4:00 PM</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>

                        {/* Legal Links */}
                        <div className={styles.footerSection}>
                            <h3>Legal</h3>
                            <div className={styles.legalLinks}>
                                <Link to="/privacy-policy"  rel="noopener noreferrer">
                                    📋 Privacy Policy
                                </Link>
                                <Link to="/terms-and-conditions"  rel="noopener noreferrer">
                                    📝 Terms & Conditions
                                </Link>
                                <a href="https://www.propfusion.com/" target="_blank" rel="noopener noreferrer">
                                    🌐 Official Website
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className={styles.footerBottom}>
                        <p>&copy; 2024 PropFusion Technologies. All rights reserved.</p>
                        <p>Your satisfaction is our top priority, and we are here to ensure you receive the support you deserve.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default About;
