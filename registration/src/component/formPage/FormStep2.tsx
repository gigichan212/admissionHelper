import React, { useEffect, useState } from "react";
import { Link, Prompt } from "react-router-dom";
import { push } from "connected-react-router";
import useRouter from "use-react-router";
// redux
import { useDispatch, useSelector } from "react-redux";
import { addApplication } from "../../redux/application/thunkActions";
import { IRootState } from "../../store";
// Css
import { Label } from "reactstrap";
// Component / Mapping
import {
  educationLabelMapping,
  parentLabelMapping,
  siblingLabelMapping,
} from "../../util/Mapping";
import LoadingComponent from "../general/Loading";
import FormElement from "./formElement";
import ProgressBar from "./ProgressBar";
import { sectionHeader } from "../../util/sectionHeader";
import { backToStep1Success } from "../../redux/application/actions";
// moment
import moment from "moment";
import ReminderComponent from "../general/Reminder";

export default function FormStep2() {
  const dispatch = useDispatch();
  // Get error from store
  const { isError, ErrorType, ErrorMessage } = useSelector(
    (state: IRootState) => {
      return state.application.payload.application.error;
    }
  );

  // get window location params
  const router = useRouter<{ type: string }>();
  const formType = router.match.params.type;
  // Get application data from store
  const { data: previewData, fromStep1, isLoading } = useSelector(
    (state: IRootState) => {
      return state.application.payload.application;
    }
  );
  // handle the case of users directly visit this page when the target period is not active
  useEffect(() => {
    if (!fromStep1) {
      dispatch(push("/form"));
    }
  }, [fromStep1]);

  // get period/ period loading status from the store
  const { data: periodData } = useSelector((state: IRootState) => {
    return state.period.payload.period;
  });
  // get current period
  const currentPeriod = periodData.filter(
    (period) => period.type === formType
  )[0];

  // Handle image upload preview
  const [previewImage, setPreviewImage] = useState<
    string | ArrayBuffer | null
  >();

  useEffect(() => {
    if (previewData.recent_photo[0] == null) {
      setPreviewImage((previewImage) => (previewImage = null));
      return;
    }

    let reader = new FileReader();
    reader.onload = function () {
      setPreviewImage((previewImage) => (previewImage = reader.result));
    };
    //@ts-ignore
    reader.readAsDataURL(previewData.recent_photo[0] as Blob);
  }, [previewData]);

  // Handle Form submit
  function handleSubmit() {
    dispatch(addApplication(previewData, formType));
  }
  // Error alert
  useEffect(() => {
    if (!isLoading) {
      if (ErrorType === "ADD_APPLICATION_FAILED_MISSING_CONTENT") {
        alert(
          `請填寫以下內容 \nPlease fill in below information: \n${ErrorMessage}`
        );
      } else if (ErrorType === "ADD_APPLICATION_FAILED_EXPIRED_PERIOD") {
        alert(
          `申請時段已過，如有疑問請聯絡管理員。 \nApplication period is expired. Please contact administrator for questions.`
        );
      } else if (ErrorType === "ADD_APPLICATION_FAILED") {
        alert(`發生錯誤，請重試。 \nError occurs, please try again.`);
      }
    }
  }, [isLoading, ErrorType]);

  // Detecting Page Reload and Browser Tab Close
  useEffect(() => {
    if (!fromStep1) {
      return;
    }
    window.onbeforeunload = (event: any) => {
      const e = event || window.event;
      // Cancel the event
      e.preventDefault();
      if (e) {
        e.returnValue = "";
      }
      return "";
    };
  }, [fromStep1]);

  // Loading Handling
  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      {/*Detecting Page Route change*/}
      <Prompt
        message={(location, action) => {
          return location.pathname.endsWith("step1")
            ? true
            : location.pathname.startsWith("/app")
            ? true
            : `是否要離開？你的表格內容將不會被保存。 \nAre you sure you want to leave? Changes that you made may not be saved.`;
        }}
      />

      <ProgressBar current="step2" />
      <section className="container previewForm">
        <ReminderComponent
          title="報名截止時間 Registration Deadline:"
          info={moment(currentPeriod.end_date).format("YYYY/MM/DD hh:mm:ss")}
        />

        {sectionHeader.map((header) => (
          <div key={header.id} className="form-section">
            <div className="form-section-header">
              <b>{header.header}</b>
            </div>

            <div className="form-section-bottom">
              {header.id === 5 ? (
                previewData.education.map((item, index) => (
                  <>
                    <div key={"education" + index} className="pastEducation">
                      <b>以往就讀資料 {index + 1}</b>
                      {Array.from(educationLabelMapping).map(
                        (map, keyIndex) => (
                          <div
                            key={"educationEle" + keyIndex}
                            className="form-ele"
                          >
                            <div className="formLeft">
                              <Label>{map[0]}</Label>
                            </div>
                            <div className="formRight">
                              <p>{(item as any)[map[1]]}</p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </>
                ))
              ) : header.id === 6 ? (
                previewData.parent.map((item, index) => (
                  <>
                    <div key={"parent" + index} className="parent">
                      <b>家長或監護人 {index + 1}</b>
                      {Array.from(parentLabelMapping).map((map, keyIndex) => (
                        <div key={"parentEle" + keyIndex} className="form-ele">
                          <div className="formLeft">
                            <Label>{map[0]}</Label>
                          </div>
                          <div className="formRight">
                            <p>{(item as any)[map[1]]}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ))
              ) : header.id === 7 ? (
                <>
                  <FormElement
                    label={header.preContent!.label}
                    name={header.preContent!.name}
                  />
                  {previewData.have_sibling === "true"
                    ? previewData.sibling.map((item, index) => (
                        <>
                          <div key={"sibling" + index} className="sibling">
                            <b>兄弟姊妹 {index + 1}</b>
                            {Array.from(siblingLabelMapping).map(
                              (map, keyIndex) => (
                                <div
                                  key={"siblingEle" + keyIndex}
                                  className="form-ele"
                                >
                                  <div className="formLeft">
                                    <Label>{map[0]}</Label>
                                  </div>
                                  <div className="formRight">
                                    <p>{(item as any)[map[1]]}</p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </>
                      ))
                    : ""}
                </>
              ) : header.id === 8 ? (
                <>
                  <FormElement
                    label={header.content[0].label}
                    name={header.content[0].name}
                  />
                  <div className="form-ele singleImg">
                    <div className="formLeft">
                      <Label>{header.content[1].label}</Label>
                    </div>
                    <div className="formRight">
                      {previewImage === null ? (
                        <div>
                          <p>沒有上傳相片 No Image Uploaded</p>
                        </div>
                      ) : (
                        <div className="singleImgPreview">
                          <div className="previewImgRight">
                            <img
                              src={previewImage as string}
                              alt={previewImage as string}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                header.content.map((item: any) => (
                  <FormElement
                    key={item.name}
                    label={item.label}
                    name={item.name}
                  />
                ))
              )}
            </div>
          </div>
        ))}
        <hr />
        <div className="back-or-submit">
          <button
            onClick={() => {
              dispatch(backToStep1Success());
              dispatch(push(`/form/${formType}/step1`));
            }}
          >
            返回 Back
          </button>

          <button
            onClick={() => {
              const confirm = window.confirm(
                "確定要提交表格？ \nAre you sure to submit the form?"
              );
              if (confirm) {
                handleSubmit();
              }
            }}
          >
            提交 Submit
          </button>
        </div>
      </section>
    </>
  );
}
