import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../../assets/scss/navbar.module.scss";

export interface propsType {
    link: string;
    name: string;
    icon: string;
}

//Inline style for font-awesome icon
export const iconStyle = {
    marginRight: "15px",
    width: "1rem",
};

export function NavComponents(props: propsType) {
    return (
        <NavLink to={props.link} activeClassName={styles.activeLink}>
            <li className={styles.li}>
                <i className={props.icon} style={iconStyle}></i>
                {props.name}
            </li>
        </NavLink>
    );
}
