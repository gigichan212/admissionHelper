import logo from "../../assets/img/sorry.svg";
import styles from "../../assets/scss/Notice.module.scss";

export default function NoticeComponent(props: { cht: string; eng: string }) {
  return (
    <section>
      <div className={styles.notice}>
        <b>{props.cht}</b>
        <b>{props.eng}</b>
        <img src={logo}></img>
      </div>
    </section>
  );
}
