import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../assets/scss/account.module.scss";
import InputComponent from "../formElement/InputComponent";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import EditAccount from "./EditAccount";
import { addFailed, addUser, isEditShow as setIsEditShow } from "../redux/user/action";
import { AccountTable } from "./AccountTable";

export interface addUserForm {
    user_role: string;
    username: string;
    password: string;
}

export default function AccountAdmin() {
    const dispatch = useDispatch();

    //Get is edit container show
    const { isEditShow, isUpdated } = useSelector((state: RootState) => {
        return state.user.payload.edit;
    });

    //Get if the user is deleted
    const { isDeleted } = useSelector((state: RootState) => {
        return state.user.payload.delete;
    });

    //Get logged in user ID
    const { userId: loggedInUserId, role } = useSelector((state: RootState) => {
        return state.auth.payload.login;
    });

    //Get add error and check add status
    const { error, isAdded } = useSelector((state: RootState) => {
        return state.user.payload.add;
    });

    //Get pagination related item
    const { limit, currentPage, recordCount } = useSelector((state: RootState) => {
        return state.user.payload.record;
    });

    //Expand add container
    const [isExpanded, setIsExpanded] = useState(false);

    function handleExpand() {
        //Scroll page to top when add btn is clicked
        document.querySelector(".outer_container")?.scrollTo({ top: 0, left: 0, behavior: "smooth" });

        setIsExpanded((prev) => {
            return !prev;
        });
    }

    //Close edit/add container when fetch success
    useEffect(() => {
        if (isUpdated) {
            dispatch(setIsEditShow(null, false));
        } else if (isDeleted) {
            dispatch(setIsEditShow(null, false));
        } else if (isAdded) {
            setIsExpanded(false);
        }
    }, [isUpdated, isDeleted, isAdded, dispatch]);

    const formDefaultValue = {
        user_role: "teacher",
        username: "",
        password: "",
    };

    // Form
    const { register, handleSubmit, trigger, errors, reset } = useForm({
        defaultValues: formDefaultValue,
    });

    //Handle adding user
    const onSubmit = (data: addUserForm) => {
        console.log(data);

        //Check if the logged in user is admin
        if (role !== "admin") {
            alert("只有管理員可以新增用戶");
            return;
        }

        if (data.user_role === "admin") {
            alert("無法新增管理員");
            return;
        }

        if (data.username === "" || data.password === "") {
            alert("請輸入賬戶名稱/密碼");
            return;
        }

        dispatch(addUser(data, loggedInUserId!));
    };

    //Show error when add failed
    useEffect(() => {
        if (error) {
            alert(error);
            reset(
                {},
                {
                    errors: true, // errors will not be reset
                    dirtyFields: true, // dirtyFields will not be reset
                    isDirty: true, // dirty will not be reset
                }
            );
            //Reset error
            dispatch(addFailed());
        }
    }, [error, dispatch, reset]);

    return (
        <>
            {isExpanded && (
                <section className={styles.top_container}>
                    <div>
                        <h6>
                            <i className="fa fa-plus"></i>新增賬戶
                        </h6>
                        <button
                            className={styles.cancel_btn}
                            onClick={() => {
                                setIsExpanded(false);
                            }}
                        >
                            <i className="fa fa-times"></i>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.option_container}>
                            <InputComponent
                                name="user_role"
                                label="用戶權限類別"
                                register={register}
                                type="select"
                                options={[["teacher", "老師"]]}
                                rules={{ required: true }}
                                errors={errors}
                                trigger={trigger}
                                readOnly={true}
                            />
                            <InputComponent
                                name="username"
                                label="賬戶名稱"
                                register={register}
                                type="text"
                                rules={{ required: true }}
                                errors={errors}
                                trigger={trigger}
                            />
                            <InputComponent
                                name="password"
                                label="密碼"
                                register={register}
                                type="password"
                                rules={{ required: true }}
                                errors={errors}
                                trigger={trigger}
                            />
                            <div className={styles.controlBtns}>
                                <button className={styles.submitButton} type="submit">
                                    新增
                                </button>
                            </div>
                        </div>
                    </form>
                </section>
            )}

            {isEditShow && <EditAccount />}

            <section className={styles.bottom_container}>
                <div className={styles.header_container}>
                    <h5>帳戶列表</h5>

                    <button onClick={() => handleExpand()}>
                        <i className="fa fa-plus"></i>

                        <span>新增賬戶</span>
                    </button>
                </div>
                <div className="pageAmount">
                    共有記錄: {recordCount}
                    {recordCount! > 0
                        ? ` (現正顯示${limit * (currentPage - 1) + 1}-
                                ${limit * currentPage > recordCount! ? recordCount : limit * currentPage}個)`
                        : ""}
                </div>
                <AccountTable />
            </section>
        </>
    );
}
