import { useState } from "react";
import styles from "./SideNav.module.css";
import { NavLink } from "react-router-dom";
import ToggleNav from "./ToggleNav";
import { useAuth } from "../context/AuthContext";

function SideNav() {
    const [activeToggle, setActiveToggle] = useState(null);
    const [isHamburgerActive, setIsHamburgerActive] = useState(false);
    const { currentUser } = useAuth();

    function handleToggleHamburger() {
        if (isHamburgerActive) {
            setIsHamburgerActive(false);
            document.documentElement.style.setProperty(
                "--side-nav-width",
                "10rem"
            );
        } else {
            setIsHamburgerActive(true);
            document.documentElement.style.setProperty(
                "--side-nav-width",
                "30rem"
            );
        }
    }

    function closeHamburger() {
        if (isHamburgerActive && window.innerWidth <= 1200)
            setIsHamburgerActive(false);
    }

    function handleToggleNav(item) {
        item.name === activeToggle
            ? setActiveToggle(null)
            : setActiveToggle(item.name);

        if (!isHamburgerActive) {
            setIsHamburgerActive(true);
            document.documentElement.style.setProperty(
                "--side-nav-width",
                "30rem"
            );
        }
    }

    return (
        <aside
            className={`${styles.sideNav} ${isHamburgerActive ? styles.hamburgerActive : ""}`}
        >
            <div
                onClick={handleToggleHamburger}
                className={styles.menuHamburger}
            >
                <span></span>
            </div>

            <img className={styles.logo} src="/logo.png" />

            <nav>
                <div className={styles.menuItems}>
                    <ul>
                        <li>
                            <NavLink to="/dashboard" onClick={closeHamburger}>
                                <img src="/icons/dashboard.svg" />
                                <span>Dashboard</span>
                            </NavLink>
                        </li>

                        {getToggleNavItems(currentUser?.role).map((item) => (
                            <ToggleNav
                                onToggle={() => handleToggleNav(item)}
                                isActive={item.name === activeToggle}
                                data={item}
                                closeHamburger={closeHamburger}
                                key={item.name}
                            />
                        ))}
                    </ul>
                </div>
            </nav>
        </aside>
    );
}

export default SideNav;

function getToggleNavItems(role) {
    const toggleNavItems = [
        {
            name: "Areas",
            imgUrl: "/icons/areas.svg",
            subItems: [{ name: "Areas List", navigateTo: "/areas/list" }],
        },
        {
            name: "Developers",
            imgUrl: "/icons/developers.svg",
            subItems: [
                { name: "Developers List", navigateTo: "/developers/list" },
            ],
        },
        {
            name: "New Projects",
            imgUrl: "/icons/new-projects.svg",
            subItems: [
                { name: "New Projects List", navigateTo: "/new-projects/list" },
                { name: "Add New Project", navigateTo: "/new-projects/add" },
            ],
        },
        {
            name: "Sell",
            imgUrl: "/icons/for-sell.svg",
            subItems: [
                { name: "Sell List", navigateTo: "/for-sell/list" },
                { name: "New Sell List", navigateTo: "/for-sell/new-list" },
                { name: "Add Sell", navigateTo: "/for-sell/add" },
            ],
        },
        {
            name: "Rent",
            imgUrl: "/icons/for-rent.svg",
            subItems: [
                { name: "Rent List", navigateTo: "/for-rent/list" },
                { name: "New Rent List", navigateTo: "/for-rent/new-list" },
                { name: "Add rent", navigateTo: "/for-rent/add" },
            ],
        },
        {
            name: "Leads",
            imgUrl: "/icons/leads.svg",
            subItems: [
                { name: "SELL Leads", navigateTo: "/leads/buy" },
                { name: "Rent Leads", navigateTo: "/leads/rent" },
                { name: "Portal Calls", navigateTo: "/leads/portal-calls" },
                { name: "Whatsapp Leads", navigateTo: "/leads/whatsapp-leads" },
                { name: "Add Lead", navigateTo: "/leads/add" },
            ],
        },
        {
            name: "Bayut Leads",
            imgUrl: "/icons/leads.svg",
            subItems: [
                {
                    name: "Portal Calls",
                    navigateTo: "/bayut-leads/portal-calls",
                },
                {
                    name: "Leads",
                    navigateTo: "/bayut-leads/leads",
                },
                {
                    name: "Whatsapp Leads",
                    navigateTo: "/bayut-leads/whatsapp-leads",
                },
            ],
        },
        // {
        //     name: "Database",
        //     imgUrl: "/icons/database.svg",
        //     subItems: [{ name: "Database List", navigateTo: "/database/list" }],
        // },
        // {
        //     name: "Transactions",
        //     imgUrl: "/icons/transactions.svg",
        //     subItems: [
        //         { name: "Transactions List", navigateTo: "/transactions/list" },
        //         { name: "Add Transaction", navigateTo: "/transactions/add" },
        //     ],
        // },
        // {
        //     name: "Approval",
        //     imgUrl: "/icons/approval.svg",
        //     subItems: [],
        // },
        // {
        //     name: "Work Flow",
        //     imgUrl: "/icons/work-flow.svg",
        //     subItems: [],
        // },
    ];

        toggleNavItems.push({
            name: "Admin",
            imgUrl: "/icons/admin.svg",
            subItems: [
                { name: "Staff", navigateTo: "/admin/staff" },
                // { name: "Permission", navigateTo: "/admin/permission" },
                { name: "Teams", navigateTo: "/admin/teams" },
                // { name: "Roles", navigateTo: "/admin/roles" },
                { name: "Watermark", navigateTo: "/admin/watermark" },
                { name: "Integrations", navigateTo: "/admin/integrations" },
                { name: "Data Import", navigateTo: "/admin/data-import" },
            ],
        });

    return toggleNavItems;
}
