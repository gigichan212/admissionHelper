import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Component
import AccountAdmin from "./AccountAdmin";
import Header from "../Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import EditAccount from "./EditAccount";
import { updateIsSuccess, userIsDeleted, userIsAdded } from "../redux/user/action";

export function Account() {
    const dispatch = useDispatch();

    const { role } = useSelector((state: RootState) => {
        return state.auth.payload.login;
    });

    //Get if the user is deleted
    const { isDeleted } = useSelector((state: RootState) => {
        return state.user.payload.delete;
    });

    //Get if user is updated
    const { isUpdated } = useSelector((state: RootState) => {
        return state.user.payload.edit;
    });

    //Get add error and check add status
    const { isAdded } = useSelector((state: RootState) => {
        return state.user.payload.add;
    });

    //Show updated/deleted/added alert
    useEffect(() => {
        if (isUpdated) {
            alert("成功更新用戶");
            dispatch(updateIsSuccess());
        } else if (isDeleted) {
            alert("用戶已被刪除");
            dispatch(userIsDeleted());
        } else if (isAdded) {
            alert("成功新增用戶");
            dispatch(userIsAdded());
        }
    }, [isUpdated, isDeleted, isAdded, dispatch]);

    return (
        <>
            <div className="outer_container">
                <Header title="賬戶設定" />
                <main>
                    <section>
                        <div>
                            {role === "admin" && <AccountAdmin />}
                            {role === "teacher" && <EditAccount />}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
