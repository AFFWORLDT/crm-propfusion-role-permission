import { createContext, useContext, useState, useEffect } from "react";
import styles from "./Menus.module.css";
import { createPortal } from "react-dom";
import useOutsideClick from "../hooks/useOutsideClick";

const MenusContext = createContext();

function Menus({ children }) {
    const [openId, setOpenId] = useState(null);
    const [position, setPosition] = useState(null);

    function close() {
        setOpenId(null);
    }
    const open = setOpenId;

    useEffect(() => {
        const handleScroll = () => {
            if (openId) close();
        };

        window.addEventListener('scroll', handleScroll, true);
        
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [openId]);

    return (
        <MenusContext.Provider
            value={{ openId, open, close, position, setPosition }}
        >
            {children}
        </MenusContext.Provider>
    );
}

function Toggle({ id, isDisabled = false, children }) {
    const { openId, open, close, setPosition } = useContext(MenusContext);

    function handleClick(e) {
        e.stopPropagation();

        const rect = e.target.closest("button").getBoundingClientRect();
        setPosition({
            x: rect.x + rect.width,
            y: rect.y + rect.height + 8,
        });

        !openId || openId !== id ? open(id) : close();
    }

    return (
        <button
            style={{ padding: children ? 0 : "1rem" }}
            className={styles.btnMenuToggle}
            onClick={handleClick}
            disabled={isDisabled}
        >
            {children || <img src="/icons/ellipsis.svg" />}
        </button>
    );
}

function List({ id, children }) {
    const { openId, position, close } = useContext(MenusContext);
    const ref = useOutsideClick(close, false);

    if (!openId || id !== openId) return null;

    return createPortal(
        <div
            style={{ left: position.x, top: position.y }}
            className={styles.menuList}
            ref={ref}
        >
            {children}
        </div>,
        document.body
    );
}

function Button({ customStyle, onClick, icon, children }) {
    const { close } = useContext(MenusContext);

    function handleClick() {
        onClick?.();
        close();
    }

    return (
        <button
            style={customStyle}
            className={styles.btnMenuList}
            onClick={handleClick}
        >
            <img style={customStyle ? { filter: "none" } : {}} src={icon} />
            <span>{children}</span>
        </button>
    );
}

Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
