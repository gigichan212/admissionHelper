import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Banner from "./Banner";
import { Link, NavLink } from "react-router-dom";
import { IRootState } from "../store";
import { push } from "connected-react-router";
import useRouter from "use-react-router";
import NoticeComponent from "./general/Notice";
import LoadingComponent from "./general/Loading";

export default function TypeLandingPage(props: { type: string }) {
  // get active period from the store
  const { data, isLoading } = useSelector(
    (state: IRootState) => state.period.payload.period
  );
  // handle the case of users directly visit this page when the target period is not active
  const currentPeriod = data.filter((period) => period.type === props.type)[0];
  if (!currentPeriod) {
    return (
      <NoticeComponent
        cht="此申請類別尚未接受申請。"
        eng="Application period is coming."
      />
    );
  }

  // showing html
  const createMarkup = (html: any) => {
    return {
      __html: html,
    };
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      {data.map((period) =>
        period.type === props.type ? (
          <>
            <Banner type={period.type} year={period.application_year} />
            <section className="container">
              <h3 style={{ textAlign: "center" }}>申請需知</h3>
              <div
                dangerouslySetInnerHTML={createMarkup(
                  period.application_procedure
                )}
              ></div>
            </section>
            <section className="container action-btns">
              <div>
                <Link to={`/form/${period.type}/step1`}>
                  <button>按此報名</button>
                </Link>
              </div>
              <div>
                <p
                  dangerouslySetInnerHTML={createMarkup(
                    period.application_note
                  )}
                ></p>
                <Link to="/edit">
                  <button>修改/ 檢視資料</button>
                </Link>
                <Link to="/result">
                  <button>查詢結果</button>
                </Link>
              </div>
            </section>
          </>
        ) : (
          ""
        )
      )}
    </>
  );
}
