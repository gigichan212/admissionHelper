import { useDispatch, useSelector } from "react-redux";
import styles from "../assets/scss/header.module.scss";
import { RootState } from "../store";
import { userRoleMap } from "../util/Mapping";

import { updateNavBarStatus } from "./redux/navigation/action";

export default function Header(props: { title: string }) {
    const dispatch = useDispatch();

    const { role } = useSelector((state: RootState) => {
        return state.auth.payload.login;
    });

    return (
        <header className={styles.header}>
            <div>
                <span onClick={() => dispatch(updateNavBarStatus())}>
                    <i className="fa fa-bars"></i>
                </span>
                <h6 className={styles.title}>{props.title}</h6>
            </div>
            <p>{userRoleMap.get(role)}</p>
        </header>
    );
}
