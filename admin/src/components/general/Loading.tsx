// spinner
import { css } from "@emotion/core";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
// css
import styles from "../../assets/scss/Loading.module.scss";

const spinnerOverride = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

export default function LoadingComponent(props: { height?: string }) {
    return (
        <section className={`${styles.loadingContainer} ${props.height === "full" ? styles.full : ""}`}>
            <h3>載入中...</h3>
            <ClimbingBoxLoader color="#0e123c" loading={true} css={spinnerOverride} size={25} />
        </section>
    );
}
