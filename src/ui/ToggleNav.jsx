import { NavLink } from "react-router-dom";
import styles from "./ToggleNav.module.css";
import { useState } from "react";

function ToggleNav({ onToggle, isActive, data, closeHamburger }) {
    return (
        
        <li className={styles.toggleItem}> 
            <p onClick={onToggle}> 
                <img src={data.imgUrl} />
                <span>{data.name}</span>
                <img
                    className={`${styles.arrowDown} ${isActive ? styles.arrowActive : ""}`}
                    src="/icons/arrow-down.svg"
                />
            </p>
            {isActive &&   
                data.subItems.map((subItem) => (
                    <NavLink
                        onClick={closeHamburger}
                        key={subItem.name}
                        to={subItem.navigateTo}
                    >
                        <img src="/icons/dot.svg" />
                        <span>{subItem.name}</span>
                    </NavLink>
                ))}
        </li>
      
        
    );
}

export default ToggleNav;



 