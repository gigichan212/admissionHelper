import React, { useEffect, useState } from "react";
import Banner from "../Banner";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../store";
import InputComponent from "../formElement/InputComponent";
import { Form, Input } from "reactstrap";
import {
  fetchApplication,
  putApplication,
} from "../../redux/application/thunkActions";
import moment from "moment";
import { push } from "connected-react-router";
import LoadingComponent from "../general/Loading";
import { putApplicationSuccessFinished } from "../../redux/application/actions";
import ReminderComponent from "../general/Reminder";
import ImageModal from "../general/Modal";

export function UploadDepositSlip() {
  const dispatch = useDispatch();
  // get application id (without prefix) from the store
  const { applicationId, token } = useSelector((state: IRootState) => {
    return state.auth;
  });
  // get loading status from store
  const { isLoading, isUpdated } = useSelector((state: IRootState) => {
    return state.application.payload.application;
  });
  // get modal image status from store
  const { isShow: isShowModal, modalImage } = useSelector(
    (state: IRootState) => {
      return state.application.payload.application.showModalImage;
    }
  );
  // Get error from store
  const { isError, ErrorType } = useSelector((state: IRootState) => {
    return state.application.payload.application.error;
  });
  // fetch application record
  const previewData = useSelector((state: IRootState) => {
    return state.application.payload.application.data;
  });
  useEffect(() => {
    dispatch(fetchApplication());
  }, [dispatch]);
  //check parent edit deadline
  useEffect(() => {
    if (moment(previewData.end_deadline) < moment()) {
      dispatch(push("/"));
    }
  }, [previewData]);

  /*************************Form Setting*******************************************/
  // Form
  // Set form registration
  const {
    register,
    handleSubmit,
    errors,
    trigger,
    reset,
    formState,
    watch,
  } = useForm<any>({
    defaultValues: {
      previewData,
    },
    mode: "onBlur",
  });
  // detect if the form have been edited
  const isFormEdited = formState.isDirty;

  //Reset form once data from db ready
  useEffect(() => {
    reset(previewData, {
      errors: true,
      dirtyFields: true,
      isDirty: true,
    });
  }, [previewData]);

  // fetch recent photo / deposit image (form db/ aws s3)
  const [depositImageFormDbSource, setDepositImageFormDbSource] = useState<any>(
    []
  );
  // determine if there is image from db
  const [
    displayDepositImageFormDb,
    setDisplayDepositImageFormDb,
  ] = useState<boolean>(false);
  // determine if user delete the image from db
  const [slipFromDbIsDeleted, setSlipFromDbIsDeleted] = useState<boolean>(
    false
  );

  useEffect(() => {
    if (
      typeof previewData.depositSlips === "undefined" ||
      previewData.depositSlips.length === 0
    ) {
      return;
    }

    const result = previewData.depositSlips.map((slip) => {
      return fetch(
        `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/application/id/${applicationId}/imageKey/${slip["deposit_slip"]}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      ).then((r) => {
        return r.blob();
      });
    });

    Promise.all(result)
      .then((res) => {
        setDepositImageFormDbSource(
          res.map((blobUrl) => window.URL.createObjectURL(blobUrl))
        );
        setDisplayDepositImageFormDb(true);
      })
      .catch((err) => {
        console.log(err);
        setDepositImageFormDbSource([]);
        setDisplayDepositImageFormDb(false);
        setSlipFromDbIsDeleted(true);
      });
  }, [previewData.depositSlips]);

  // Preview Slips Handling
  const [selectedSlips, setSelectedSlips] = useState<any>(""); // local selected files
  const [previewSlips, setPreviewSlips] = useState<any[]>([]); // preview blob

  const handleDeleteSlips = () => {
    setSelectedSlips((selectedSlips: any) => (selectedSlips = ""));

    // clear preview image form db
    if (displayDepositImageFormDb) {
      setDepositImageFormDbSource([]);
      setDisplayDepositImageFormDb(false);
      setSlipFromDbIsDeleted(true);
    }
  };

  useEffect(() => {
    if (selectedSlips === "") {
      setPreviewSlips((previewSlips: any) => (previewSlips = []));
      return;
    }
    setPreviewSlips([]);

    for (let selectedFile of selectedSlips) {
      let reader = new FileReader();
      reader.onload = function () {
        setPreviewSlips((previewSlips: any) =>
          previewSlips.concat(reader.result)
        );
      };
      reader.readAsDataURL(selectedFile);
    }
  }, [selectedSlips]);

  // check if the uploaded slip amount exceed max
  const isWithinUploadAmount = () => {
    const slips = watch("slips");
    if (slips) {
      if (slips.length <= 3) {
        return true;
      }
      return "最多可上傳3張照片 Upload 3 files";
    }
    return true;
  };

  /*****************Submit handling*****************/
  // Onsubmit handling
  const onSubmit = (formData: any) => {
    console.log(formData);
    dispatch(
      putApplication(formData, applicationId as number, slipFromDbIsDeleted)
    );
  };
  // successfully updated
  useEffect(() => {
    if (!isLoading && isUpdated) {
      alert(`成功更改資料 \nSuccessfully updated record. `);
      dispatch(putApplicationSuccessFinished());
    }
  }, [isLoading, isUpdated]);
  // error alert
  useEffect(() => {
    if (!isLoading && isError) {
      if (ErrorType === "PUT_APPLICATION_FAILED_EXPIRED_PERIOD") {
        alert(
          `修改申請時段已過，如有疑問請聯絡管理員。 \nEdit period is expired. Please contact administrator for questions.`
        );
        dispatch(fetchApplication());
      } else if (ErrorType === "PUT_APPLICATION_FAILED") {
        alert(
          `發生錯誤，請重試。 \nError occurs. Please contact administrator for questions.`
        );
        dispatch(fetchApplication());
      }
    }
  }, [isLoading, ErrorType, isError]);

  /*****************Loading handling*****************/
  // Loading handing
  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Banner type="uploadDepositSlip" />
      {/* show modal image*/}
      {isShowModal && <ImageModal src={modalImage as string} />}

      {/* default showing*/}
      {!isShowModal && (
        <section className="container">
          <ReminderComponent
            title="修改資料截止時間 Edit Information Deadline:"
            info={moment(previewData.end_deadline).format(
              "YYYY/MM/DD hh:mm:ss"
            )}
          />
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-section">
              <div className="form-section-header">
                <b>上傳入數紙 Upload Deposit Slip</b>
              </div>
              <div className="form-section-bottom">
                <InputComponent
                  label="入數紙 Upload Deposit Slip"
                  name="slips"
                  type="files"
                  register={register}
                  rules={{
                    required: false,
                    validate: isWithinUploadAmount,
                  }}
                  errors={errors}
                  trigger={trigger}
                  loadImageFromDb={!displayDepositImageFormDb ? false : true} // see if display image from db
                  depositImageFormDbSource={depositImageFormDbSource} // db image source
                  previewSlips={previewSlips} // local image preview
                  selectedSlips={selectedSlips} // local image select
                  onChangeFunction={setSelectedSlips}
                  onClickFunction={handleDeleteSlips}
                />
              </div>
            </div>

            <div className="back-or-submit">
              {isFormEdited ? (
                <Input type="submit" className="submit" value="儲存" />
              ) : (
                <Input type="submit" className="submit" value="儲存" disabled />
              )}
            </div>
          </Form>
        </section>
      )}
    </>
  );
}
