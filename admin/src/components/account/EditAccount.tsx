import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../assets/scss/account.module.scss";
import { Form, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../formElement/InputComponent";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { User } from "../redux/user/state";
// import { getSingleUser } from "../redux/user/action";
import { userRoleMap } from "../../util/Mapping";
import {
    deleteFailed,
    deleteUser,
    editUser,
    fetchSingleUser,
    isEditShow as setIsEditShow,
    updateFailed,
} from "../redux/user/action";
import moment from "moment";

export interface editFormType {
    id: number | null;
    username: string;
    user_role: string;
    old_password: string;
    new_password: string;
    confirm_password: string;
    created_at: string;
    updated_at: string;
}

export default function EditAccount() {
    const dispatch = useDispatch();

    // Tab control
    const [mainActiveTab, setMainActiveTab] = useState("main1");
    const mainToggle = (tab: any) => {
        if (mainActiveTab !== tab) setMainActiveTab(tab);
    };

    // Get user Role form store to determine if the component should be shown
    // Get logged in user ID
    const { role, userId: loggedInUserId } = useSelector((state: RootState) => state.auth.payload.login);

    //Get Current user if role is teacher
    useEffect(() => {
        if (role === "teacher" && loggedInUserId) {
            dispatch(fetchSingleUser(loggedInUserId));
        }
    }, [dispatch, loggedInUserId, role]);

    //Get current user (*only exist when role is teacher*)
    const { currentUser: user } = useSelector((state: RootState) => state.user.payload);

    /////////////////////////////For Admin//////////////////////////
    // Get users data from store
    const { users } = useSelector((state: RootState) => state.user.payload.record);

    //Get clicked userId
    //And Get update error
    let { userId, error } = useSelector((state: RootState) => state.user.payload.edit);

    //Get delete error
    const { error: deleteError } = useSelector((state: RootState) => state.user.payload.delete);

    //delete btn is clicked
    function handleDelete(userId: number) {
        //Check if the logged in user is admin
        if (role !== "admin") {
            alert("?????????????????????????????????");
            EditReset(currentUser, {
                errors: true, // errors will not be reset
                dirtyFields: true, // dirtyFields will not be reset
                isDirty: true, // dirty will not be reset
            });
            return;
        }

        //Check if we are deleting the admin
        if (currentUser.role === "admin") {
            alert("????????????????????????");
            EditReset(currentUser, {
                errors: true, // errors will not be reset
                dirtyFields: true, // dirtyFields will not be reset
                isDirty: true, // dirty will not be reset
            });
            return;
        }

        //Ask user if they confirm the action
        const confirm = window.confirm(`???????????? ${currentUser.username}??? ????????? ????????????????????????????????????????????????`);

        if (confirm) {
            dispatch(deleteUser(userId));
        }
    }

    let currentUser: User = users.filter((user) => user.id === userId)[0];

    //////////////////////////////////////////

    //If role is teacher, use value from current user store
    if (role === "teacher" && user) {
        currentUser = user;
        userId = loggedInUserId;
    }

    // Form
    const {
        register: EditRegister,
        handleSubmit: EditHandleSubmit,
        trigger: EditTrigger,
        errors: EditErrors,
        reset: EditReset,
        formState: EditFormState,
    } = useForm({
        defaultValues: currentUser,
        mode: "onBlur",
    });
    const editFormIsDirty = EditFormState.isDirty;
    console.log("editFormIsDirty: ", editFormIsDirty);

    //Reset form when another user was clicked
    //Or when teacher info has been fetched
    useEffect(() => {
        EditReset(currentUser, {
            errors: true, // errors will not be reset
            dirtyFields: true, // dirtyFields will not be reset
            isDirty: true, // dirty will not be reset
        });
    }, [currentUser, EditReset]);

    //Check if user is updated
    const { isUpdated } = useSelector((state: RootState) => {
        return state.user.payload.edit;
    });

    //Clear form when update success
    useEffect(() => {
        //For clearing password fields
        if (isUpdated && role === "teacher") {
            EditReset(currentUser, {
                errors: true, // errors will not be reset
                dirtyFields: true, // dirtyFields will not be reset
                isDirty: true, // dirty will not be reset
            });
        }
    }, [isUpdated, EditReset, currentUser, role]);

    //Show error when update/delete failed
    useEffect(() => {
        if (error) {
            alert(error);
            EditReset(currentUser, {
                errors: true, // errors will not be reset
                dirtyFields: true, // dirtyFields will not be reset
                isDirty: true, // dirty will not be reset
            });
            //Reset error
            dispatch(updateFailed());
        } else if (deleteError) {
            alert(deleteError);
            dispatch(deleteFailed());
        }
    }, [error, deleteError, EditReset, dispatch, currentUser, role]);

    //When edit is submitted
    const onSubmit = (data: editFormType) => {
        //Check if all the passwords has filled in
        if (data.old_password !== "" || data.new_password !== "" || data.confirm_password !== "") {
            if (data.new_password === "" || data.confirm_password === "" || data.old_password === "") {
                alert("???????????????");
                //Reset form
                EditReset(currentUser);
                return;
            }
        }

        //Check if password matched
        if (data.new_password !== data.confirm_password) {
            alert("??????????????????????????????????????????");
            //Reset form
            EditReset(currentUser);
            return;
        }

        //If password has been changed, update password
        //Check if username is changed, if so, update username
        if (data.confirm_password !== "") {
            if (data.username === currentUser.username) {
                dispatch(
                    editUser(userId!, {
                        password: data.confirm_password,
                        old_password: data.old_password,
                        updated_user_id: loggedInUserId!,
                    })
                );
            } else {
                dispatch(
                    editUser(userId!, {
                        username: data.username,
                        password: data.confirm_password,
                        old_password: data.old_password,
                        updated_user_id: loggedInUserId!,
                    })
                );
            }
        } else {
            //Check if the username has changed
            if (data.username === currentUser.username) {
                alert("?????????????????????");
                return;
            } else {
                dispatch(editUser(userId!, { username: data.username, updated_user_id: loggedInUserId! }));
            }
        }
    };

    return (
        <section className={styles.bottom_container}>
            <div>
                <h6>
                    <span className={styles.editIcon}>
                        <FontAwesomeIcon icon={faPen} />
                    </span>
                    ????????????
                </h6>
                {role === "admin" && (
                    <button
                        className={styles.cancel_btn}
                        onClick={() => {
                            dispatch(setIsEditShow(null, false));
                        }}
                    >
                        <i className="fa fa-times"></i>
                    </button>
                )}
            </div>
            <Nav tabs>
                {["????????????", "????????????"].map((header, index) => (
                    <NavItem>
                        <NavLink
                            key={`main${index + 1}`}
                            className={classnames({
                                active: mainActiveTab === `main${index + 1}`,
                            })}
                            onClick={() => {
                                mainToggle(`main${index + 1}`);
                            }}
                        >
                            {header}
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>

            <TabContent activeTab={mainActiveTab}>
                <TabPane tabId="main1">
                    <div className={styles.container}>
                        <div>
                            <Form onSubmit={EditHandleSubmit(onSubmit)}>
                                <div className={styles.formContent}>
                                    <InputComponent
                                        name="id"
                                        label="????????????"
                                        register={EditRegister}
                                        type="number"
                                        rules={{
                                            required: true,
                                        }}
                                        readOnly={true}
                                        errors={EditErrors}
                                        trigger={EditTrigger}
                                    />
                                    <InputComponent
                                        name="role"
                                        label="??????????????????"
                                        register={EditRegister}
                                        type="select"
                                        options={Array.from(userRoleMap)}
                                        rules={{
                                            required: true,
                                        }}
                                        readOnly={true}
                                        errors={EditErrors}
                                        trigger={EditTrigger}
                                    />

                                    <InputComponent
                                        name="username"
                                        label="????????????"
                                        register={EditRegister}
                                        type="text"
                                        rules={{
                                            required: true,
                                        }}
                                        errors={EditErrors}
                                        trigger={EditTrigger}
                                    />
                                </div>
                                <div className={styles.formContent}>
                                    <InputComponent
                                        name="old_password"
                                        label="?????????"
                                        register={EditRegister}
                                        type="password"
                                        rules={{
                                            required: false,
                                        }}
                                        errors={EditErrors}
                                        trigger={EditTrigger}
                                    />
                                    <InputComponent
                                        name="new_password"
                                        label="?????????"
                                        register={EditRegister}
                                        type="password"
                                        rules={{
                                            required: false,
                                        }}
                                        errors={EditErrors}
                                        trigger={EditTrigger}
                                    />
                                    <InputComponent
                                        name="confirm_password"
                                        label="???????????????"
                                        register={EditRegister}
                                        type="password"
                                        rules={{
                                            required: false,
                                        }}
                                        errors={EditErrors}
                                        trigger={EditTrigger}
                                    />
                                </div>
                                <div className={styles.controlBtns}>
                                    {editFormIsDirty ? (
                                        <button className={styles.submitButton} type="submit">
                                            ??????
                                        </button>
                                    ) : (
                                        <button className={styles.submitButton} type="submit" disabled>
                                            ??????
                                        </button>
                                    )}

                                    {role === "admin" && (
                                        <button
                                            type="button"
                                            className={styles.deleteButton}
                                            onClick={() => {
                                                handleDelete(userId!);
                                            }}
                                        >
                                            ????????????
                                        </button>
                                    )}
                                </div>
                            </Form>
                        </div>
                    </div>
                </TabPane>
                <TabPane tabId="main2">
                    <div className={`${styles.systemInfoContainer}`}>
                        <p>
                            <strong>??????????????? </strong>
                            {currentUser && moment(currentUser.created_at).format("YYYY/MM/DD hh:mm:ss")}
                        </p>
                        <p>
                            <strong>??????????????????: </strong>
                            {currentUser && moment(currentUser.updated_at).format("YYYY/MM/DD hh:mm:ss")}
                        </p>

                        <p>
                            <strong>????????????????????? </strong>
                            {currentUser && currentUser.updated_user}
                        </p>
                    </div>
                </TabPane>
            </TabContent>
        </section>
    );
}
