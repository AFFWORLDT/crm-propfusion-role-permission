import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./CustomToggleNav.module.css";
// import { useAuth } from "../context/AuthContext";
import useImagesStore from "../store/imagesStore";

export default function CustomToggleNav({
    data,
    isActive,
    onToggle,
    closeToggleNav,
    closeHamburger,
}) {
    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0,
        left: 0,
    });
    const toggleRef = useRef(null);
    // const { currentUser } = useAuth();

    const navigate = useNavigate()
    const {clearAllImages}=useImagesStore()

    useEffect(() => {
        function handleOutsideClick(e) {
            if (!toggleRef.current) return;
            if (!toggleRef.current.contains(e.target)) {
                closeToggleNav();
            }
        }

        document
            .getElementById("root")
            .addEventListener("click", handleOutsideClick, true);

        return () =>
            document
                .getElementById("root")
                .removeEventListener("click", handleOutsideClick, true);
    }, [closeToggleNav]);

    const handleClick = () => {
        onToggle();
        if (toggleRef.current) {
            const rect = toggleRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom,
                left: rect.right + 10, // Adjust space between sidebar and dropdown
            });
        }
    };

    const handleNavigateMainRoute = () => {
        navigate(data.subItems[0].navigateTo);
        closeHamburger();
        closeToggleNav();
        clearAllImages()
    };

    return (
        <li className={styles.toggleItem}>
            <div
                ref={toggleRef}
                onClick={onToggle}
                onMouseEnter={handleClick}
                style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}
            >
                <img src={data.imgUrl} alt={data.name} onClick={handleNavigateMainRoute} />
                <span>{data.name}</span>
                <img
                    className={`${styles.arrowDown} ${isActive ? styles.arrowActive : ""}`}
                    src="/icons/arrow-down.svg"
                    alt="Arrow Down"
                />
            </div>

            {isActive &&
                createPortal(
                    <div
                        className={`${styles.dropdown} ${isActive ? styles.active : ""}`}
                        style={{
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`,
                        }}
                    >
                        { data.subItems.map((subItem) => (
                            <NavLink
                                key={subItem.name}
                                to={subItem.navigateTo}
                                onClick={() => (
                                    closeHamburger(), handleClick(),clearAllImages()

                                )}
                                className={styles.dropdownItem}
                            >
                                <img src="/icons/dot.svg" alt="Dot Icon" />
                                <span>{subItem.name}</span>
                            </NavLink>
                        ))}
                    </div>,
                    document.body // Render outside the sidebar
                )}
        </li>
    );
}
