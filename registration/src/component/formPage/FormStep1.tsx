import React, { useEffect, useState } from "react";
// react router
import { push } from "connected-react-router";
import { Link, Prompt } from "react-router-dom";
import useRouter from "use-react-router";
// react-hook-form
import { useFieldArray, useForm } from "react-hook-form";
// redux
import { useDispatch, useSelector } from "react-redux";
import {
  addPreviewApplication,
  addRecentPhotoPreview,
  getApplicationInitialState,
} from "../../redux/application/actions";
import { IRootState } from "../../store";
import { IEducationState, IParentState } from "../../redux/application/state";
// Css
import { Form, Input } from "reactstrap";
// Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faPlusSquare,
} from "@fortawesome/free-regular-svg-icons";
// Component / Mapping
import { levelMap } from "../../util/Mapping";
import { sectionHeader } from "../../util/sectionHeader";
import ProgressBar from "./ProgressBar";
import InputComponent from "../formElement/InputComponent";
import LoadingComponent from "../general/Loading";
import NoticeComponent from "../general/Notice";
// moment
import moment from "moment";
import ReminderComponent from "../general/Reminder";

export interface IRegisterForm {
  level: string;
  chinese_name: string;
  english_name: string;
  sex: string;
  religion: string;
  nationality: string;
  birth_cert_num: string;
  date_of_birth: string;
  place_of_birth: string;
  email: string;
  email2: string;
  phone: number | null;
  address: string;
  have_sibling: string;
  remarks: string;
  recent_photo: any;
  education: IEducationState[];
  parent: IParentState[];
}

export default function FormStep1() {
  // get window location params
  const router = useRouter<{ type: string }>();
  const formType = router.match.params.type;

  const dispatch = useDispatch();

  // fromStep2: check if the action is from step2
  // resetForm: Handling the case of user back to step1 after submitting the form
  // data: get application info from the store
  const { resetForm, fromStep2, data: previewData } = useSelector(
    (state: IRootState) => {
      return state.application.payload.application;
    }
  );
  // useEffect(() => {
  //   if (resetForm && !fromStep2) {
  //     dispatch(getApplicationInitialState());
  //   }
  // }, [resetForm, fromStep2, dispatch]);

  useEffect(() => {
    if (!fromStep2) {
      dispatch(getApplicationInitialState());
    }
  }, [fromStep2, dispatch]);

  // get period/ period loading status from the store
  const { isLoading, data: periodData } = useSelector((state: IRootState) => {
    return state.period.payload.period;
  });
  // get current period
  const currentPeriod = periodData.filter(
    (period) => period.type === formType
  )[0];

  /*****************Form Setting*****************/
  // get input file value from App.tsx
  const selectedImageFromStore = useSelector((state: IRootState) => {
    return state.application.payload.application.recentPhoto.selectedImage;
  });
  // Handle image upload preview
  const [selectedImage, setSelectedImage] = useState<FileList | null>(null);
  useEffect(() => {
    setSelectedImage((image) => (image = selectedImageFromStore));
  }, [selectedImageFromStore, selectedImage]);

  // const [selectedImage, setSelectedImage] = useState<Blob | null>(null);
  const [previewImage, setPreviewImage] = useState<
    string | ArrayBuffer | null
  >();

  // Set form registration
  const {
    register,
    handleSubmit,
    errors,
    trigger,
    setValue,
    reset,
    watch,
    control,
  } = useForm<IRegisterForm>({
    defaultValues: previewData,
    mode: "onBlur",
  });

  //Reset form once data from db ready
  const [recentPhotoError, setRecentPhotoError] = useState<boolean>(false); // true when user didn't fill recent_photo
  useEffect(() => {
    // don't reset form if user didn't fill recent_photo
    if (recentPhotoError) {
      return;
    }
    reset(
      { ...previewData },
      {
        errors: true, // errors will not be reset
        dirtyFields: true, // dirtyFields will not be reset
        isDirty: true, // dirty will not be reset
      }
    );
  }, [previewData, reset, recentPhotoError]);

  // Form filed array
  const {
    fields: educationFields,
    append: educationAppend,
    remove: educationRemove,
  } = useFieldArray({
    control,
    name: "education",
    keyName: "education",
  });

  const {
    fields: parentFields,
    append: parentAppend,
    remove: parentRemove,
  } = useFieldArray({
    control,
    name: "parent",
    keyName: "parent",
  });

  const {
    fields: siblingFields,
    append: siblingAppend,
    remove: siblingRemove,
  } = useFieldArray({
    control,
    name: "sibling",
    keyName: "sibling",
  });

  // Handle Form submit
  const [formSubmitAction, setFormSubmitAction] = useState<boolean>(false); // onsubmit trigger this as "true", execute dispatch action only when this is true
  const [result, setResult] = useState<any>(previewData);
  useEffect(() => {
    if (formSubmitAction) {
      dispatch(addPreviewApplication(result));
    }
  }, [result, dispatch, formSubmitAction]);

  const onSubmit = (formData: IRegisterForm) => {
    const applicationMap: any = {};
    for (const item in formData) {
      applicationMap[item] = (formData as any)[item];
      applicationMap["recent_photo"] = selectedImage;
    }
    setResult((result: any) => {
      return {
        ...result,
        ...applicationMap,
      };
    });

    // manually check if recent_photo is filled
    if (selectedImage == null) {
      setRecentPhotoError(true);
      return;
    }

    setFormSubmitAction(true);
    dispatch(push(`/form/${formType}/step2`));
  };

  // Handle HasSibling change
  const [hasSibling, setHasSibling] = useState<boolean | null>(null);
  const handleHasSibling = (value: string) => {
    if (value === "true") {
      setHasSibling(true);
    } else {
      setHasSibling(false);
      setValue("sibling", [
        {
          name: "",
          sex: "",
          school_name: "",
          grade: "",
        },
      ]);
    }
  };
  useEffect(() => {
    handleHasSibling(previewData.have_sibling);
  }, [previewData.have_sibling]);

  // // Handle image upload preview
  useEffect(() => {
    if (previewData.recent_photo === "") {
      setSelectedImage((selectedImage) => (selectedImage = null));
      return;
    }
    setSelectedImage(
      (selectedImage) => (selectedImage = previewData.recent_photo as any)
    );
  }, [previewData]);
  const handleDeleteImage = () => {
    // delete file image at App.tsx
    dispatch(addRecentPhotoPreview(null));
    // delete state selectedImage
    setSelectedImage((selectedImage) => (selectedImage = null));
    setValue("recent_photo", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  useEffect(() => {
    console.log("selectedImage: ", selectedImage);
  }, [selectedImage]);
  useEffect(() => {
    if (selectedImage == null) {
      setPreviewImage((previewImage) => (previewImage = null));
      return;
    }

    let reader = new FileReader();
    reader.onload = function () {
      setPreviewImage((previewImage) => (previewImage = reader.result));
    };
    //@ts-ignore
    reader.readAsDataURL(selectedImage[0] as any);
  }, [selectedImage]);

  // check matching between email and confirmation email
  const isMatchEmail = () => {
    const email = watch("email");
    const email2 = watch("email2");

    if (email2 === "" || email === email2) {
      return true;
    }
    return "電郵與確認電郵不相符 Email address and Confirm email address does not match.";
  };

  // replace input for meeting pattern
  // value: event target value
  // name: input name
  const replaceText = (value: any, name: any, type: string) => {
    // rename filed array fields
    let isFieldArray: boolean = false;
    let fileArrayName: string = "";
    if (name.includes(".")) {
      isFieldArray = true;
      // save original name
      fileArrayName = name;

      // find the name after "."
      const nameIndex = name.indexOf(".");
      name = name.slice(nameIndex + 1);
    }

    let newValue: string = "";
    if (type === "tel") {
      if (/\D/g.test(value)) {
        // only number is allowed for tel
        newValue = value.replace(/\D/g, "");

        //set original filed array name
        if (isFieldArray) {
          setValue(fileArrayName, newValue);
          return;
        }
        setValue(name, newValue);
        return;
      }
      return;
    }

    if (name === "english_name") {
      if (/[^0-9A-Za-z\s+-]/gi.test(value)) {
        // only english and number are allowed for english name
        newValue = value.replace(/[^0-9A-Za-z\s+-]/gi, "");

        //set original filed array name
        if (isFieldArray) {
          setValue(fileArrayName, newValue);
          return;
        }
        setValue(name, newValue);
        return;
      }
      return;
    }

    if (name === "chinese_name" || "address") {
      if (/[^\u4E00-\u9FFF\s]+/u.test(value)) {
        // only Chinese allowed for Chinese name/ address
        newValue = value.replace(/[^\u4E00-\u9FFF\s]+/u, "");

        //set original filed array name
        if (isFieldArray) {
          setValue(fileArrayName, newValue);
          return;
        }
        setValue(name, newValue);
        return;
      }
      return;
    }
    return;
  };
  /*****************Page reload handling*****************/
  //Detecting Page Reload and Browser Tab Close
  useEffect(() => {
    window.onbeforeunload = (event: any) => {
      const e = event || window.event;
      e.preventDefault();
      if (e) {
        e.returnValue = "";
      }
      return "";
    };
  }, []);

  /*****************Loading / Notice Handling*****************/
  // period loading handling
  if (isLoading) {
    return <LoadingComponent />;
  }
  // handle the case of users directly visit this page when the target period is not active
  if (!currentPeriod) {
    return (
      <NoticeComponent
        cht="此申請類別尚未接受申請。"
        eng="Application period is coming."
      />
    );
  }

  return (
    <>
      {/*Detecting Page Route change*/}
      <Prompt
        message={(location, action) => {
          return location.pathname.endsWith("step2")
            ? true
            : location.pathname.startsWith("/app")
            ? true
            : `是否要離開？你的表格內容將不會被保存。 \nAre you sure you want to leave? Changes that you made may not be saved.`;
        }}
      />
      <ProgressBar current="step1" />

      <section className="container">
        <ReminderComponent
          title="報名截止時間 Registration Deadline:"
          info={moment(currentPeriod.end_date).format("YYYY/MM/DD hh:mm:ss")}
        />

        <Form onSubmit={handleSubmit(onSubmit)}>
          {sectionHeader.map((header) => (
            <div key={header.id} className="form-section">
              <div className="form-section-header">
                <b>{header.header}</b>
              </div>

              <div className="form-section-bottom">
                {header.id === 1 ? (
                  <>
                    <InputComponent
                      label={header.content[0].label}
                      name={header.content[0].name}
                      register={register}
                      type={(header.content[0] as any).type}
                      options={
                        formType === "normal"
                          ? [[1, "小一"]]
                          : Array.from(levelMap)
                      }
                      rules={{ required: (header.content[0] as any).required }}
                      errors={errors}
                      trigger={trigger}
                    />
                  </>
                ) : header.id === 2 ? (
                  <>
                    {header.content.map((item: any) => (
                      <InputComponent
                        label={item.label}
                        name={item.name}
                        register={register}
                        type={item.type}
                        options={item.options ? item.options : ""}
                        rules={{
                          required: item.required,
                          pattern: item.pattern ? item.pattern : "",
                        }}
                        placeholder={item.placeholder}
                        errors={errors}
                        trigger={trigger}
                        replaceText={
                          item.name === "chinese_name"
                            ? replaceText
                            : item.name === "english_name"
                            ? replaceText
                            : () => {}
                        }
                      />
                    ))}
                  </>
                ) : header.id === 3 ? (
                  <>
                    {header.content.map((item: any) => (
                      <InputComponent
                        label={item.label}
                        name={item.name}
                        register={register}
                        type={item.type}
                        rules={{
                          required: item.required,
                          max: item.max,
                          min: item.min,
                        }}
                        errors={errors}
                        trigger={trigger}
                      />
                    ))}
                  </>
                ) : header.id === 4 ? (
                  <>
                    {header.content.map((item: any) => (
                      <InputComponent
                        className={item.name === "email" ? "labelReminder" : ""}
                        label={item.label}
                        name={item.name}
                        register={register}
                        type={item.type}
                        placeholder={item.placeholder}
                        rules={{
                          required: item.required,
                          validate:
                            item.name === "email2"
                              ? isMatchEmail
                              : item.name === "email"
                              ? isMatchEmail
                              : () => {},
                          pattern: item.pattern ? item.pattern : "",
                          minLength: item.minLength ? item.minLength : "",
                          maxLength: item.maxLength ? item.maxLength : "",
                        }}
                        errors={errors}
                        trigger={trigger}
                        replaceText={
                          item.type === "tel" ? replaceText : () => {}
                        }
                      />
                    ))}
                  </>
                ) : header.id === 5 ? (
                  <>
                    {educationFields.map((ele, index) => (
                      <div key={ele.id} className="pastEducation">
                        <b>以往就讀資料 {index + 1}</b>
                        {index + 1 > 1 && (
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            className="deleteFormItem"
                            onClick={() => educationRemove(index)}
                          />
                        )}
                        {header.content.map((item: any) =>
                          item.name === "id" ? (
                            ""
                          ) : (
                            <>
                              <InputComponent
                                label={item.label}
                                name={`education[${index}].${item.name}`}
                                defaultValue={ele[item.name] || ""}
                                register={register}
                                type={item.type}
                                rules={{
                                  required: index + 1 === 1 ? true : false,
                                }}
                                errors={errors}
                                trigger={trigger}
                                isFieldArray={{
                                  status: true,
                                  type: "education",
                                  index: index,
                                }}
                              />
                            </>
                          )
                        )}
                      </div>
                    ))}

                    {educationFields.length < 3 && (
                      <div
                        className="fillMore"
                        onClick={() => educationAppend({})}
                      >
                        <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
                        <span>填寫更多 Fill More</span>
                      </div>
                    )}
                  </>
                ) : header.id === 6 ? (
                  <>
                    {parentFields.map((ele, index) => (
                      <div key={"parent" + (index + 1)} className="parent">
                        <b>家長或監護人 {index + 1}</b>
                        {index + 1 > 1 && (
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            className="deleteFormItem"
                            onClick={() => parentRemove(index)}
                          />
                        )}

                        {header.content.map((item: any) =>
                          item.name === "id" ? (
                            ""
                          ) : (
                            <InputComponent
                              label={item.label}
                              name={`parent[${index}].${item.name}`}
                              defaultValue={ele[item.name] || ""}
                              register={register}
                              type={item.type}
                              options={item.options ? item.options : ""}
                              rules={{
                                required: index + 1 === 1 ? true : false,
                                pattern: item.pattern ? item.pattern : "",
                                minLength: item.minLength ? item.minLength : "",
                                maxLength: item.maxLength ? item.maxLength : "",
                              }}
                              errors={errors}
                              trigger={trigger}
                              replaceText={
                                item.type === "tel" ||
                                item.name === ("chinese_name" || "english_name")
                                  ? replaceText
                                  : () => {}
                              }
                              isFieldArray={{
                                status: true,
                                type: "parent",
                                index: index,
                              }}
                            />
                          )
                        )}
                      </div>
                    ))}

                    {parentFields.length < 3 && (
                      <div
                        className="fillMore"
                        onClick={() => parentAppend({})}
                      >
                        <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
                        填寫更多 Fill More
                      </div>
                    )}
                  </>
                ) : header.id === 7 ? (
                  <>
                    <InputComponent
                      label={header.preContent!.label}
                      name={header.preContent!.name}
                      type={header.preContent!.type}
                      options={header.preContent!.options}
                      register={register}
                      rules={{ required: header.preContent!.required }}
                      errors={errors}
                      trigger={trigger}
                      onChangeFunction={handleHasSibling}
                    />
                    {hasSibling &&
                      siblingFields.map((ele, index) => (
                        <div className="sibling">
                          <b>兄弟姊妹 {index + 1}</b>
                          {index + 1 > 1 && (
                            <FontAwesomeIcon
                              icon={faTimesCircle}
                              className="deleteFormItem"
                              onClick={() => siblingRemove(index)}
                            />
                          )}
                          {header.content.map((item: any) =>
                            item.name === "id" ? (
                              ""
                            ) : (
                              <InputComponent
                                label={item.label}
                                name={`sibling[${index}].${item.name}`}
                                defaultValue={ele[item.name] || ""}
                                register={register}
                                type={item.type}
                                options={item.options}
                                rules={{
                                  required: hasSibling
                                    ? index + 1 === 1
                                      ? true
                                      : false
                                    : false,
                                }}
                                errors={errors}
                                trigger={trigger}
                                isFieldArray={{
                                  status: true,
                                  type: "sibling",
                                  index: index,
                                }}
                              />
                            )
                          )}
                        </div>
                      ))}
                    {hasSibling && siblingFields.length < 2 && (
                      <div
                        className="fillMore"
                        onClick={() => siblingAppend({})}
                      >
                        <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
                        填寫更多 Fill More
                      </div>
                    )}
                  </>
                ) : header.id === 8 ? (
                  <>
                    {header.content.map((item: any) =>
                      item.type === "textarea" ? (
                        <InputComponent
                          label={item.label}
                          name={item.name}
                          type={item.type}
                          register={register}
                          rules={{
                            required: item.required,
                            maxLength: item.maxLength ? item.maxLength : "",
                          }}
                          errors={errors}
                          trigger={trigger}
                        />
                      ) : (
                        <InputComponent
                          label={item.label}
                          name={item.name}
                          type="file"
                          register={register} // not in use
                          rules={{ required: item.required }} // not in use
                          errors={errors} // not in use
                          trigger={trigger} // not in use
                          previewImage={previewImage}
                          onChangeFunction={setSelectedImage}
                          onClickFunction={handleDeleteImage}
                          recentPhotoError={recentPhotoError} // check if recent_photo is filled
                        />
                      )
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}

          <hr />
          <div className="back-or-submit">
            <Link to={`/form/${formType}-landing`}>
              <button className="back">取消 Cancel</button>
            </Link>
            <Input type="submit" className="submit" value="下一步 Next Step" />
          </div>
        </Form>
      </section>
    </>
  );
}
