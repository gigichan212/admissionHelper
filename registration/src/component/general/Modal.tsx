import { useDispatch } from "react-redux";
import { showModalImage } from "../../redux/application/actions";
import styles from "../../assets/scss/Modal.module.scss";

export default function ImageModal(props: { src: string }) {
  const dispatch = useDispatch();
  return (
    <>
      <div className={styles.modal}>
        <span
          className={styles.close}
          onClick={() => dispatch(showModalImage(false, null))}
        >
          &times;
        </span>

        <img
          className={`${styles.modalContent} ${styles.img}`}
          src={props.src}
        />
      </div>
    </>
  );
}
