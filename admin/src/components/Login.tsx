import React, { useEffect } from "react";
import styles from "../assets/scss/login.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login, loginFailed } from "./redux/auth/action";
import { RootState } from "../store";
import logo from "../assets/img/logo.png";

export interface formType {
    username: string;
    password: string;
}

export function Login() {
    const dispatch = useDispatch();

    const { error } = useSelector((state: RootState) => state.auth.payload.login);

    // Form
    const { register, handleSubmit, reset } = useForm();

    //Send username and password on submit
    const onSubmit = (data: formType, e: any) => {
        dispatch(login(data.username, data.password));
    };

    //Check for failed login
    useEffect(() => {
        if (error) {
            //Show error to user
            alert(error);
            //Reset form
            reset(
                { username: "", password: "" },
                {
                    errors: true, // errors will not be reset
                    dirtyFields: true, // dirtyFields will not be reset
                    isDirty: true, // dirty will not be reset
                }
            );
            //Reset error
            dispatch(loginFailed());
        }
    }, [error, dispatch, reset]);

    return (
        <div className={styles.my_body}>
            <section className={styles.login_container}>
                <div className={styles.logo}>
                    <img src={logo} alt={logo}></img>
                </div>
                <h4 className={styles.login_title}>歡迎回來</h4>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" placeholder="帳戶名稱" className={styles.input} name="username" ref={register} />
                    <input
                        type="password"
                        placeholder="帳戶密碼"
                        className={styles.input}
                        name="password"
                        ref={register}
                    />
                    <button className={styles.button} type="submit">
                        登入
                    </button>
                </form>
            </section>

            <div className={styles.square}></div>
            <div className={styles.square_top}></div>
        </div>
    );
}
