import React, { useEffect } from "react";
import { push } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";
import useRouter from "use-react-router";
import { IRootState } from "../../store";
import ProgressBar from "./ProgressBar";
import LoadingComponent from "../general/Loading";
import { addApplicationSuccessFinished } from "../../redux/application/actions";
import { Prompt } from "react-router";
// moment
import moment from "moment";
import "moment/locale/zh-tw";

export default function FormStep3() {
  const dispatch = useDispatch();
  // router handling
  const router = useRouter<{ type?: string }>();
  const applicationTypeFromRouter = router.match.params.type;
  // get period data from the store
  const periodData = useSelector(
    (state: IRootState) => state.period.payload.period.data
  );

  // get application data from the store
  const { idWithPrefix, created_at, chinese_name, english_name } = useSelector(
    (state: IRootState) => state.application.payload.application.data
  );
  const isApplicationLoading = useSelector(
    (state: IRootState) => state.application.payload.application.isLoading
  );
  // handle the case of users directly visit this page when the target period is not active
  if (!idWithPrefix) {
    dispatch(push("/"));
  }

  // set "fromStep1" false
  useEffect(() => {
    dispatch(addApplicationSuccessFinished());
  }, [dispatch]);

  // showing html
  const createMarkup = (html: any) => {
    return {
      __html: html,
    };
  };

  if (isApplicationLoading) {
    return <LoadingComponent />;
  }
  return (
    <>
      <Prompt
        message={`提示: 請保留申請編號及電郵以登入系統。\nReminder: Keep the Application Id and Email in order to login the system.`}
      />
      <ProgressBar current="step3" />
      {periodData.map((period: any, index: number) =>
        period.type === applicationTypeFromRouter ? (
          <section key={index} className="container">
            <div id="letter">
              <div style={{ textAlign: "center" }}>
                <p>
                  香城學校 <br />
                  {period.application_year}{" "}
                  {period.type === "normal" ? "小一" : "插班生"}入學申請 <br />
                  網上申請確認書
                  <br />
                  申請編號：{idWithPrefix}
                </p>
              </div>
              <div>
                致{chinese_name} {english_name},
                <br />
                <br />
                閣下於 {moment(created_at).locale("zh-tw").format("LLL")}
                遞交的網上申請已收妥，我們亦已發送確認電郵。
                <div
                  dangerouslySetInnerHTML={createMarkup(
                    period.confirmation_letter
                  )}
                ></div>
              </div>
            </div>

            {/* <button>截圖 Capture Image</button> */}
            {/* <ExportPdfComponent /> */}
          </section>
        ) : (
          ""
        )
      )}
    </>
  );
}
