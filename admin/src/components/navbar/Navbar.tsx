import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import styles from "../../assets/scss/navbar.module.scss";
import { logout } from "../redux/auth/action";
import { iconStyle, NavComponents } from "./NavComponents";
import { navbarArray, screenSizeMap } from "../../util/Mapping";
import logo from "../../assets/img/logo.png";
import { setNavBar, updateNavBarStatus } from "../redux/navigation/action";
import useRouter from "use-react-router";

export function Navbar() {
    const dispatch = useDispatch();
    const [size, setSize] = useState([0, 0]);
    const router = useRouter();
    const pathname = router.location.pathname;

    //Toggle navbar
    const isOpen = useSelector((state: RootState) => state.navBar.isOpen);

    //Hide navbar when user click to another page
    //Only when in mobile size
    useEffect(() => {
        if (size[0] <= screenSizeMap.get("iPadPro")!) {
            dispatch(setNavBar(false));
        }
    }, [pathname]);

    //Get current screen size
    useEffect(() => {
        //Update size state when window resized
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }

        //Detect when window resize
        window.addEventListener("resize", updateSize);

        updateSize();

        return () => window.removeEventListener("resize", updateSize);
    }, []);

    //Hide navbar when the screen size is smaller than large
    //Show when it is bigger
    useEffect(() => {
        if (size[0] < 1) return;

        if (size[0] <= screenSizeMap.get("iPadPro")!) {
            dispatch(setNavBar(false));
        } else if (size[0] >= screenSizeMap.get("iPadPro")!) {
            dispatch(setNavBar(true));
        }
    }, [size[0]]);

    //Show logout if is Authenticated and show navbar accordingly
    const { isAuth, role } = useSelector((state: RootState) => state.auth.payload.login);
    return (
        <div className={isOpen ? `${styles.bg_container}` : `${styles.bg_container} ${styles.inactiveNavBar}`}>
            <div className={styles.logo}>
                {size[0] <= screenSizeMap.get("large")! && (
                    <span onClick={() => dispatch(updateNavBarStatus())}>
                        <i className="fa fa-bars"></i>
                    </span>
                )}
                <img src={logo} alt={logo}></img>
            </div>
            <div>
                <ul className={styles.ul}>
                    {role === "teacher" ? (
                        <>
                            {navbarArray
                                .filter(
                                    (component) =>
                                        component.name === "總覽" ||
                                        component.name === "申請記錄" ||
                                        component.name === "賬戶設定"
                                )
                                .map((comp) => (
                                    <NavComponents link={comp.link} name={comp.name} icon={comp.icon} />
                                ))}
                        </>
                    ) : (
                        <>
                            {navbarArray.map((component) => (
                                <NavComponents link={component.link} name={component.name} icon={component.icon} />
                            ))}
                        </>
                    )}
                    {isAuth && (
                        <button onClick={() => dispatch(logout())}>
                            <li className={styles.li}>
                                <i className="fa fa-sign-out" style={iconStyle}></i>
                                登出
                            </li>
                        </button>
                    )}
                </ul>
            </div>
        </div>
    );
}
