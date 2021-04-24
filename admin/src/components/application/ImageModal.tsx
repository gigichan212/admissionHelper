import React from "react";
// css
import styles from "../../assets/scss/application/ImageModal.module.scss";
import { useDispatch } from "react-redux";
import { showModalImage } from "../redux/application/action";

export function ImageModal(props: { src: string }) {
    const dispatch = useDispatch();

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={() => dispatch(showModalImage(false, null))}>
                    <i className="fa fa-times"></i>
                </span>
                <img className={`${styles.modalContent} ${styles.img}`} src={props.src} />
            </div>
        </div>
    );
}
