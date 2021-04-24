// spinner
import { css } from "@emotion/core";
import PacmanLoader from "react-spinners/PacmanLoader";
import styles from "../../assets/scss/Loading.module.scss";

const spinnerOverride = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default function LoadingComponent() {
  return (
    <section className={`${styles.loadingContainer} `}>
      <div>
        <PacmanLoader
          color="#5361A8"
          loading={true}
          css={spinnerOverride}
          size={25}
        />
      </div>
    </section>
  );
}
