// Redux/ Connect router
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { fetchApplication } from "../../redux/application/thunkActions";
import { IRootState } from "../../store";
// Component
import Banner from "../Banner";
import LoadingComponent from "../general/Loading";
import NoticeComponent from "../general/Notice";

export function EditChoicePage() {
  const dispatch = useDispatch();

  // fetch application and get data from store
  const { isLoading, data } = useSelector((state: IRootState) => {
    return state.application.payload.application;
  });
  useEffect(() => {
    dispatch(fetchApplication());
  }, [dispatch]);

  //check parent edit deadline
  if (moment(data.end_deadline) < moment()) {
    return (
      <>
        <Banner type="selecting" />
        <NoticeComponent cht="家長修改時段已過。" eng="Edit period is over." />
      </>
    );
  }

  // loading handling
  if (isLoading) {
    return <LoadingComponent />;
  }
  return (
    <>
      <Banner type="editSelecting" />
      <section className="container">
        <div className="largeSelectbtns">
          <NavLink to="/edit/edit-form">
            <button>
              更改申請資料
              <br />
              Modify Application
            </button>
          </NavLink>
          <NavLink to="/edit/upload-deposit-slip">
            <button>
              上傳入數紙
              <br />
              Upload Deposit Slip
            </button>
          </NavLink>
        </div>
      </section>
    </>
  );
}
