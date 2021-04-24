import React from "react";
import Banner from "./Banner";
// Redux/ Connect router
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { IRootState } from "../store";
import LoadingComponent from "./general/Loading";
import NoticeComponent from "./general/Notice";

function SelectType() {
  // get active period from the store
  const { data, isLoading } = useSelector(
    (state: IRootState) => state.period.payload.period
  );

  if (isLoading) {
    return <LoadingComponent />;
  }
  if (data.length < 1) {
    return (
      <>
        <Banner type="selecting" />
        <NoticeComponent
          cht="暫時沒有開放中的申請時段。"
          eng="Application period is coming."
        />
      </>
    );
  }
  return (
    <>
      <Banner type="selecting" />
      <section className="container typeLanding">
        <div className="largeSelectbtns">
          {data.map((period: any) =>
            period.type === "normal" ? (
              <NavLink to="/form/normal-landing">
                <button>
                  {period.application_year}年度小一入學申請
                  <br />
                  Primary One Admission for year {period.application_year}
                </button>
              </NavLink>
            ) : (
              <NavLink to="/form/interim-landing">
                <button>
                  {period.application_year}年度插班生入學申請
                  <br />
                  Interim Admission for year {period.application_year}
                </button>
              </NavLink>
            )
          )}
        </div>
      </section>
    </>
  );
}

export default SelectType;
