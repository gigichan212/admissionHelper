import React, { useEffect } from "react";
import Banner from "../Banner";
import Table from "react-bootstrap/Table";
import style from "../../assets/scss/ResultPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../store";
import { applicationStatusMap } from "../../util/Mapping";
import { fetchApplication } from "../../redux/application/thunkActions";
import moment from "moment";

export default function ResultPage() {
  const dispatch = useDispatch();

  // fetch application record
  useEffect(() => {
    dispatch(fetchApplication());
  }, [dispatch]);
  const previewData = useSelector((state: IRootState) => {
    return state.application.payload.application.data;
  });
  return (
    <>
      <Banner type="checkResult" />
      <section className="container">
        <div className="form-section">
          <div className="form-section-header">
            <b>查詢結果/申請狀態 Application Status</b>
          </div>
          <div className="form-section-bottom">
            <div className="form-ele">
              <Table striped bordered hover className={style.resultTable}>
                <thead>
                  <tr>
                    <th>
                      英文名字 <br /> Name in English
                    </th>
                    <th>
                      中文名字 <br /> Name in Chinese
                    </th>
                    <th>
                      申請狀態 <br /> Application Status
                    </th>
                    {previewData.application_status ===
                      "first_round_interview" ||
                    previewData.application_status === "second_round_interview"
                      ? previewData.interview_date_time && (
                          <th>
                            面試日期及時間 <br /> Interview time and date
                          </th>
                        )
                      : ""}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label={`英文名字 Name in English`}>
                      {previewData.english_name}
                    </td>
                    <td data-label="中文名字 Name in Chinese">
                      {previewData.chinese_name}
                    </td>
                    <td data-label="申請狀態 Application Status">
                      <button
                        disabled
                        className={`${
                          previewData.application_status === "rejected"
                            ? "status_box_rejected"
                            : previewData.application_status === "invalid"
                            ? "status_box_invalid"
                            : previewData.application_status === "pending"
                            ? "status_box_processing"
                            : previewData.application_status ===
                                "first_round_interview" ||
                              previewData.application_status ===
                                "second_round_interview"
                            ? "status_box_interview"
                            : "status_box_positive"
                        }`}
                      >
                        {applicationStatusMap.get(
                          previewData.application_status!
                        )}
                      </button>
                    </td>
                    {previewData.application_status ===
                      "first_round_interview" ||
                    previewData.application_status === "second_round_interview"
                      ? previewData.interview_date_time && (
                          <td data-label="面試日期及時間 Interview time and date">
                            {moment(previewData.interview_date_time).format(
                              "YYYY/MM/DD hh:mm:ss"
                            )}
                          </td>
                        )
                      : ""}
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
