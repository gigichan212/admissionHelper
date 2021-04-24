import React from "react";
import styles from "../../assets/scss/AlertMsg.module.scss";
import { CSSTransition } from "react-transition-group";

export default function AlertComponent(props: { type: string }) {
  return (
    <CSSTransition in={true} timeout={350} className={`${styles.alertMsg}`}>
      <div>
        {props.type === "login"
          ? "已成功登入 Successfully login"
          : props.type === "logout"
          ? "已成功登出 Successfully logout"
          : ""}
      </div>
    </CSSTransition>
  );
}
