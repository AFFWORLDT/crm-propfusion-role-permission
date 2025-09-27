import { useState, useEffect } from "react";
import {
    BookOpen,
    Home,
    Users,
    Building2,
    Target,
    FileText,
    Calendar,
    Settings,
    BarChart3,
    Zap,
    HelpCircle,
    ChevronRight,
    Search,
    X,
    Menu,
    Bookmark,
    Star,
    Clock,
    Download,
    MessageCircle,
} from "lucide-react";
import UserManualStyles from "./UserManual.module.css";
import OverviewSection from "./sections/OverviewSection";
import GettingStartedSection from "./sections/GettingStartedSection";
import AuthenticationSection from "./sections/AuthenticationSection";
import CalendarSection from "./sections/CalendarSection";
import PropertyManagementSection from "./sections/PropertyManagementSection";
import LeadManagementSection from "./sections/LeadManagementSection";
import CustomerManagementSection from "./sections/CustomerManagementSection";
import ContractManagementSection from "./sections/ContractManagementSection";
import DashboardAnalyticsSection from "./sections/DashboardAnalyticsSection";
import AdminSection from "./sections/AdminSection";
import ReportsSection from "./sections/ReportsSection";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";
import { SUPPORT_TABS } from "../../utils/constants";

const UserManual = () => {
    const [activeSection, setActiveSection] = useState("overview");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [bookmarkedSections, setBookmarkedSections] = useState([]);
    const [recentSections, setRecentSections] = useState([]);

    const sections = [
        {
            id: "overview",
            title: "Project Overview",
            icon: <BookOpen size={24} />,
            description: "Understanding CRM Property Fusion system",
            color: "#3B82F6",
            category: "Foundation",
            difficulty: "Beginner",
            timeToRead: "5 min",
            tags: ["system", "overview", "features", "introduction"],
        },
        {
            id: "getting-started",
            title: "Getting Started",
            icon: <Home size={24} />,
            description: "First time setup and navigation basics",
            color: "#10B981",
            category: "Foundation",
            difficulty: "Beginner",
            timeToRead: "10 min",
            tags: ["setup", "navigation", "first-steps", "quick-start"],
        },
        {
            id: "authentication",
            title: "Authentication & Users",
            icon: <Users size={24} />,
            description: "Login, roles, and user management",
            color: "#F59E0B",
            category: "Foundation",
            difficulty: "Beginner",
            timeToRead: "8 min",
            tags: ["login", "roles", "security", "users", "permissions"],
        },
        {
            id: "dashboard",
            title: "Dashboard & Analytics",
            icon: <BarChart3 size={24} />,
            description: "Main dashboard and performance metrics",
            color: "#8B5CF6",
            category: "Core Features",
            difficulty: "Intermediate",
            timeToRead: "12 min",
            tags: [
                "dashboard",
                "analytics",
                "metrics",
                "performance",
                "widgets",
            ],
        },
        {
            id: "properties",
            title: "Property Management",
            icon: <Building2 size={24} />,
            description: "Complete property lifecycle management",
            color: "#EF4444",
            category: "Core Features",
            difficulty: "Intermediate",
            timeToRead: "20 min",
            tags: ["properties", "listings", "photos", "viewings", "sharing"],
        },
        {
            id: "leads",
            title: "Lead Management",
            icon: <Target size={24} />,
            description: "Lead capture, qualification, and conversion",
            color: "#06B6D4",
            category: "Core Features",
            difficulty: "Intermediate",
            timeToRead: "18 min",
            tags: [
                "leads",
                "capture",
                "qualification",
                "follow-up",
                "conversion",
            ],
        },
        {
            id: "customers",
            title: "Customer Management",
            icon: <Users size={24} />,
            description: "Customer database and communication",
            color: "#84CC16",
            category: "Core Features",
            difficulty: "Intermediate",
            timeToRead: "15 min",
            tags: [
                "customers",
                "database",
                "communication",
                "preferences",
                "history",
            ],
        },
        {
            id: "contracts",
            title: "Contract Management",
            icon: <FileText size={24} />,
            description: "Contract workflows and document management",
            color: "#F97316",
            category: "Advanced Features",
            difficulty: "Advanced",
            timeToRead: "16 min",
            tags: [
                "contracts",
                "workflows",
                "templates",
                "digital-signatures",
                "compliance",
            ],
        },
        {
            id: "calendar",
            title: "Calendar & Scheduling",
            icon: <Calendar size={24} />,
            description: "Appointments, viewings, and scheduling",
            color: "#EC4899",
            category: "Core Features",
            difficulty: "Intermediate",
            timeToRead: "12 min",
            tags: [
                "calendar",
                "scheduling",
                "appointments",
                "viewings",
                "integration",
            ],
        },
        {
            id: "admin",
            title: "Admin & Settings",
            icon: <Settings size={24} />,
            description: "System configuration and user management",
            color: "#6B7280",
            category: "Advanced Features",
            difficulty: "Advanced",
            timeToRead: "18 min",
            tags: [
                "admin",
                "settings",
                "users",
                "configuration",
                "permissions",
            ],
        },
        {
            id: "reports",
            title: "Reports & Analytics",
            icon: <BarChart3 size={24} />,
            description: "Business intelligence and custom reports",
            color: "#059669",
            category: "Advanced Features",
            difficulty: "Advanced",
            timeToRead: "15 min",
            tags: [
                "reports",
                "analytics",
                "business-intelligence",
                "custom-reports",
                "data",
            ],
        },
        {
            id: "integrations",
            title: "Integrations",
            icon: <Zap size={24} />,
            description: "External systems and portal connections",
            color: "#DC2626",
            category: "Advanced Features",
            difficulty: "Advanced",
            timeToRead: "14 min",
            tags: [
                "integrations",
                "portals",
                "apis",
                "external-systems",
                "connectivity",
            ],
        },
        {
            id: "gallery",
            title: "Property Gallery",
            icon: <Building2 size={24} />,
            description: "Interactive property showcase and reels",
            color: "#7C3AED",
            category: "Core Features",
            difficulty: "Intermediate",
            timeToRead: "12 min",
            tags: [
                "gallery",
                "showcase",
                "reels",
                "interactive",
                "presentation",
            ],
        },
        {
            id: "troubleshooting",
            title: "Troubleshooting",
            icon: <HelpCircle size={24} />,
            description: "Common issues and solutions",
            color: "#D97706",
            category: "Support",
            difficulty: "All Levels",
            timeToRead: "10 min",
            tags: ["troubleshooting", "issues", "solutions", "support", "help"],
        },
    ];

    // Load bookmarks and recent sections from localStorage
    useEffect(() => {
        const savedBookmarks = localStorage.getItem("userManualBookmarks");
        const savedRecent = localStorage.getItem("userManualRecent");

        if (savedBookmarks) {
            setBookmarkedSections(JSON.parse(savedBookmarks));
        }
        if (savedRecent) {
            setRecentSections(JSON.parse(savedRecent));
        }
    }, []);

    // Save bookmarks and recent sections to localStorage
    useEffect(() => {
        localStorage.setItem(
            "userManualBookmarks",
            JSON.stringify(bookmarkedSections)
        );
        localStorage.setItem(
            "userManualRecent",
            JSON.stringify(recentSections)
        );
    }, [bookmarkedSections, recentSections]);

    const handleSectionClick = (sectionId) => {
        setActiveSection(sectionId);

        // Add to recent sections
        const updatedRecent = [
            sectionId,
            ...recentSections.filter((id) => id !== sectionId),
        ].slice(0, 5);
        setRecentSections(updatedRecent);

        // Close mobile menu on section change
        setIsMobileMenuOpen(false);
    };

    const toggleBookmark = (sectionId) => {
        if (bookmarkedSections.includes(sectionId)) {
            setBookmarkedSections(
                bookmarkedSections.filter((id) => id !== sectionId)
            );
        } else {
            setBookmarkedSections([...bookmarkedSections, sectionId]);
        }
    };

    const filteredSections = sections.filter(
        (section) =>
            section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            section.tags.some((tag) =>
                tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
    );

    const getSectionComponent = (sectionId) => {
        switch (sectionId) {
            case "overview":
                return <OverviewSection />;
            case "getting-started":
                return <GettingStartedSection />;
            case "authentication":
                return <AuthenticationSection />;
            case "dashboard":
                return <DashboardAnalyticsSection />;
            case "properties":
                return <PropertyManagementSection />;
            case "leads":
                return <LeadManagementSection />;
            case "customers":
                return <CustomerManagementSection />;
            case "contracts":
                return <ContractManagementSection />;
            case "calendar":
                return <CalendarSection />;
            case "admin":
                return <AdminSection />;
            case "reports":
                return <ReportsSection />;
            case "integrations":
                return (
                    <div className={UserManualStyles.placeholderSection}>
                        <h3>Integrations</h3>
                        <p>
                            This section will cover external systems and portal
                            connections.
                        </p>
                        <p>Content coming soon...</p>
                    </div>
                );
            case "gallery":
                return (
                    <div className={UserManualStyles.placeholderSection}>
                        <h3>Property Gallery</h3>
                        <p>
                            This section will cover interactive property
                            showcase and reels.
                        </p>
                        <p>Content coming soon...</p>
                    </div>
                );
            case "troubleshooting":
                return (
                    <div className={UserManualStyles.placeholderSection}>
                        <h3>Troubleshooting</h3>
                        <p>
                            This section will cover common issues and solutions.
                        </p>
                        <p>Content coming soon...</p>
                    </div>
                );
            default:
                return <OverviewSection />;
        }
    };

    const currentSection = sections.find((s) => s.id === activeSection);

    return (
        <div className="sectionContainer">
            <SectionTop heading="Support">
                <TabBar
                    tabs={SUPPORT_TABS}
                    activeTab={"USERMANUAL"}
                    navigateTo={(id) =>
                        SUPPORT_TABS.find((tab) => tab.id === id)?.path ||
                        "/admin/general/support"
                    }
                />
            </SectionTop>
            <div className="sectionStyles">
                <div className={UserManualStyles.userManualContainer}>
                    {/* Header */}
                    <div className={UserManualStyles.header}>
                        <div className={UserManualStyles.headerContent}>
                            <div className={UserManualStyles.logoSection}>
                                <BookOpen
                                    size={32}
                                    className={UserManualStyles.logoIcon}
                                />
                                <div>
                                    <h1 className={UserManualStyles.mainTitle}>
                                        CRM Property Fusion
                                    </h1>
                                    <p className={UserManualStyles.subtitle}>
                                        Complete User Manual & Documentation
                                    </p>
                                </div>
                            </div>

                            <div className={UserManualStyles.headerActions}>
                                {/* Search Button */}
                                <button
                                    className={UserManualStyles.searchBtn}
                                    onClick={() =>
                                        setIsSearchOpen(!isSearchOpen)
                                    }
                                >
                                    <Search size={20} />
                                    Search Manual
                                </button>

                                {/* Mobile Menu Button */}
                                <button
                                    className={UserManualStyles.mobileMenuBtn}
                                    onClick={() =>
                                        setIsMobileMenuOpen(!isMobileMenuOpen)
                                    }
                                >
                                    <Menu size={20} />
                                </button>

                                <button className={UserManualStyles.printBtn}>
                                    <Download size={20} />
                                    Download PDF
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        {isSearchOpen && (
                            <div className={UserManualStyles.searchBar}>
                                <div
                                    className={
                                        UserManualStyles.searchInputWrapper
                                    }
                                >
                                    <Search
                                        size={20}
                                        className={UserManualStyles.searchIcon}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search the manual..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className={UserManualStyles.searchInput}
                                        autoFocus
                                    />
                                    {searchQuery && (
                                        <button
                                            className={
                                                UserManualStyles.clearSearchBtn
                                            }
                                            onClick={() => setSearchQuery("")}
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                {/* Search Results */}
                                {searchQuery && (
                                    <div
                                        className={
                                            UserManualStyles.searchResults
                                        }
                                    >
                                        {filteredSections.length > 0 ? (
                                            filteredSections.map((section) => (
                                                <button
                                                    key={section.id}
                                                    className={
                                                        UserManualStyles.searchResultItem
                                                    }
                                                    onClick={() =>
                                                        handleSectionClick(
                                                            section.id
                                                        )
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            UserManualStyles.searchResultIcon
                                                        }
                                                        style={{
                                                            "--accent-color":
                                                                section.color,
                                                        }}
                                                    >
                                                        {section.icon}
                                                    </div>
                                                    <div
                                                        className={
                                                            UserManualStyles.searchResultContent
                                                        }
                                                    >
                                                        <h4>{section.title}</h4>
                                                        <p>
                                                            {
                                                                section.description
                                                            }
                                                        </p>
                                                        <div
                                                            className={
                                                                UserManualStyles.searchResultTags
                                                            }
                                                        >
                                                            {section.tags
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        tag,
                                                                        index
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                index
                                                                            }
                                                                            className={
                                                                                UserManualStyles.searchResultTag
                                                                            }
                                                                        >
                                                                            {
                                                                                tag
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div
                                                className={
                                                    UserManualStyles.noSearchResults
                                                }
                                            >
                                                <Search size={24} />
                                                <p>
                                                    No results found for &quot;
                                                    {searchQuery}&quot;
                                                </p>
                                                <span>
                                                    Try different keywords or
                                                    browse the sections below
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className={UserManualStyles.mainContent}>
                        {/* Sidebar Navigation */}
                        <div
                            className={`${UserManualStyles.sidebar} ${isMobileMenuOpen ? UserManualStyles.mobileOpen : ""}`}
                        >
                            <div className={UserManualStyles.sidebarHeader}>
                                <h3>Manual Sections</h3>
                                <p>Navigate through different topics</p>
                            </div>

                            {/* Bookmarked Sections */}
                            {bookmarkedSections.length > 0 && (
                                <div
                                    className={
                                        UserManualStyles.bookmarkedSection
                                    }
                                >
                                    <h4>
                                        <Bookmark size={16} />
                                        Bookmarked
                                    </h4>
                                    {bookmarkedSections.map((sectionId) => {
                                        const section = sections.find(
                                            (s) => s.id === sectionId
                                        );
                                        if (!section) return null;
                                        return (
                                            <button
                                                key={sectionId}
                                                className={`${UserManualStyles.navItem} ${UserManualStyles.bookmarkedItem}`}
                                                onClick={() =>
                                                    handleSectionClick(
                                                        sectionId
                                                    )
                                                }
                                                style={{
                                                    "--accent-color":
                                                        section.color,
                                                }}
                                            >
                                                <div
                                                    className={
                                                        UserManualStyles.navIcon
                                                    }
                                                >
                                                    {section.icon}
                                                </div>
                                                <div
                                                    className={
                                                        UserManualStyles.navContent
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            UserManualStyles.navTitle
                                                        }
                                                    >
                                                        {section.title}
                                                    </span>
                                                </div>
                                                <button
                                                    className={
                                                        UserManualStyles.unbookmarkBtn
                                                    }
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleBookmark(
                                                            sectionId
                                                        );
                                                    }}
                                                >
                                                    <Bookmark size={14} />
                                                </button>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Recent Sections */}
                            {recentSections.length > 0 && (
                                <div className={UserManualStyles.recentSection}>
                                    <h4>
                                        <Clock size={16} />
                                        Recently Viewed
                                    </h4>
                                    {recentSections.map((sectionId) => {
                                        const section = sections.find(
                                            (s) => s.id === sectionId
                                        );
                                        if (!section) return null;
                                        return (
                                            <button
                                                key={sectionId}
                                                className={`${UserManualStyles.navItem} ${UserManualStyles.recentItem}`}
                                                onClick={() =>
                                                    handleSectionClick(
                                                        sectionId
                                                    )
                                                }
                                                style={{
                                                    "--accent-color":
                                                        section.color,
                                                }}
                                            >
                                                <div
                                                    className={
                                                        UserManualStyles.navIcon
                                                    }
                                                >
                                                    {section.icon}
                                                </div>
                                                <div
                                                    className={
                                                        UserManualStyles.navContent
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            UserManualStyles.navTitle
                                                        }
                                                    >
                                                        {section.title}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            <nav className={UserManualStyles.navigation}>
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        className={`${UserManualStyles.navItem} ${activeSection === section.id ? UserManualStyles.active : ""}`}
                                        onClick={() =>
                                            handleSectionClick(section.id)
                                        }
                                        style={{
                                            "--accent-color": section.color,
                                        }}
                                    >
                                        <div
                                            className={UserManualStyles.navIcon}
                                        >
                                            {section.icon}
                                        </div>
                                        <div
                                            className={
                                                UserManualStyles.navContent
                                            }
                                        >
                                            <span
                                                className={
                                                    UserManualStyles.navTitle
                                                }
                                            >
                                                {section.title}
                                            </span>
                                            <span
                                                className={
                                                    UserManualStyles.navDescription
                                                }
                                            >
                                                {section.description}
                                            </span>
                                            <div
                                                className={
                                                    UserManualStyles.navMeta
                                                }
                                            >
                                                <span
                                                    className={
                                                        UserManualStyles.navCategory
                                                    }
                                                >
                                                    {section.category}
                                                </span>
                                                <span
                                                    className={
                                                        UserManualStyles.navDifficulty
                                                    }
                                                >
                                                    {section.difficulty}
                                                </span>
                                                <span
                                                    className={
                                                        UserManualStyles.navTime
                                                    }
                                                >
                                                    {section.timeToRead}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={
                                                UserManualStyles.navActions
                                            }
                                        >
                                            <button
                                                className={`${UserManualStyles.bookmarkBtn} ${bookmarkedSections.includes(section.id) ? UserManualStyles.bookmarked : ""}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleBookmark(section.id);
                                                }}
                                            >
                                                <Bookmark size={16} />
                                            </button>
                                            <ChevronRight
                                                size={16}
                                                className={
                                                    UserManualStyles.navArrow
                                                }
                                            />
                                        </div>
                                    </button>
                                ))}
                            </nav>

                            <div className={UserManualStyles.sidebarFooter}>
                                <div className={UserManualStyles.quickLinks}>
                                    <h4>Quick Links</h4>
                                    <ul>
                                        <li>
                                            <a href="#video-tutorials">
                                                Video Tutorials
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#faq">
                                                Frequently Asked Questions
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#support">
                                                Contact Support
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#updates">
                                                System Updates
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className={UserManualStyles.helpSection}>
                                    <h4>Need Help?</h4>
                                    <button
                                        className={UserManualStyles.helpBtn}
                                    >
                                        <MessageCircle size={16} />
                                        Live Chat
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className={UserManualStyles.contentArea}>
                            <div className={UserManualStyles.contentHeader}>
                                <div
                                    className={
                                        UserManualStyles.contentHeaderMain
                                    }
                                >
                                    <h2>{currentSection?.title}</h2>
                                    <p>{currentSection?.description}</p>
                                    <div
                                        className={UserManualStyles.contentMeta}
                                    >
                                        <span
                                            className={
                                                UserManualStyles.metaCategory
                                            }
                                        >
                                            {currentSection?.category}
                                        </span>
                                        <span
                                            className={
                                                UserManualStyles.metaDifficulty
                                            }
                                        >
                                            {currentSection?.difficulty}
                                        </span>
                                        <span
                                            className={
                                                UserManualStyles.metaTime
                                            }
                                        >
                                            <Clock size={16} />
                                            {currentSection?.timeToRead}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className={UserManualStyles.contentActions}
                                >
                                    <button
                                        className={UserManualStyles.actionBtn}
                                    >
                                        <Star size={16} />
                                        Rate This Section
                                    </button>
                                    <button
                                        className={UserManualStyles.actionBtn}
                                    >
                                        <MessageCircle size={16} />
                                        Report Issue
                                    </button>
                                    <button
                                        className={UserManualStyles.actionBtn}
                                    >
                                        <Download size={16} />
                                        Export Section
                                    </button>
                                </div>
                            </div>

                            <div className={UserManualStyles.contentBody}>
                                {getSectionComponent(activeSection)}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={UserManualStyles.footer}>
                        <div className={UserManualStyles.footerContent}>
                            <div className={UserManualStyles.footerSection}>
                                <h4>Need Help?</h4>
                                <p>Contact our support team for assistance</p>
                                <button className={UserManualStyles.supportBtn}>
                                    <HelpCircle size={16} />
                                    Get Support
                                </button>
                            </div>

                            <div className={UserManualStyles.footerSection}>
                                <h4>Training Resources</h4>
                                <ul>
                                    <li>
                                        <a href="#video-tutorials">
                                            Video Tutorials
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#webinars">Live Webinars</a>
                                    </li>
                                    <li>
                                        <a href="#certification">
                                            User Certification
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className={UserManualStyles.footerSection}>
                                <h4>System Information</h4>
                                <p>
                                    <strong>Version:</strong> 2.0
                                </p>
                                <p>
                                    <strong>Last Updated:</strong> January 2024
                                </p>
                                <p>
                                    <strong>Support Hours:</strong> Sun-Thu
                                    9AM-6PM GST
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManual;
