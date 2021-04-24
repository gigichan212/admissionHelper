import React, { useEffect, useState } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApplication,
  putApplication,
} from "../../redux/application/thunkActions";
import { IRootState } from "../../store";
// react hook form
import { useFieldArray, useForm } from "react-hook-form";
// css
import { Form, Input } from "reactstrap";
// Tab
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
// Component / Mapping
import InputComponent from "../formElement/InputComponent";
import { IRegisterForm } from "../formPage/FormStep1";
import Banner from "../Banner";
import { sectionHeader } from "../../util/sectionHeader";
import moment from "moment";
import { push } from "connected-react-router";
import LoadingComponent from "../general/Loading";
import {
  addRecentPhotoPreview,
  putApplicationSuccessFinished,
} from "../../redux/application/actions";
import ReminderComponent from "../general/Reminder";
import ImageModal from "../general/Modal";

export default function EditForm() {
  const dispatch = useDispatch();

  /*****************Get state from the store*****************/
  // get input file value from App.tsx
  const { selectedImage: selectedImageFromStore } = useSelector(
    (state: IRootState) => {
      return state.application.payload.application.recentPhoto;
    }
  );
  // get modal image status from store
  const { isShow: isShowModal, modalImage } = useSelector(
    (state: IRootState) => {
      return state.application.payload.application.showModalImage;
    }
  );

  // get application id (without prefix) from the store
  const { applicationId, token, isAuth } = useSelector((state: IRootState) => {
    return state.auth;
  });
  // get loading status from store
  const { isLoading, isUpdated, data: previewData } = useSelector(
    (state: IRootState) => {
      return state.application.payload.application;
    }
  );
  // Get error from store
  const { isError, ErrorType, ErrorMessage } = useSelector(
    (state: IRootState) => {
      return state.application.payload.application.error;
    }
  );
  // fetch application record
  useEffect(() => {
    dispatch(fetchApplication());
  }, [dispatch]);

  //check parent edit deadline
  useEffect(() => {
    if (moment(previewData.end_deadline) < moment()) {
      dispatch(push("/"));
    }
  }, [previewData]);

  /*****************Tab*****************/
  const [educationActiveTab, setEducationActiveTab] = useState("education1");
  const educationToggle = (tab: any) => {
    if (educationActiveTab !== tab) setEducationActiveTab(tab);
  };

  const [parentActiveTab, setParentActiveTab] = useState("parent1");
  const parentToggle = (tab: any) => {
    if (parentActiveTab !== tab) setParentActiveTab(tab);
  };

  const [siblingActiveTab, setSiblingActiveTab] = useState("sibling1");
  const siblingToggle = (tab: any) => {
    if (siblingActiveTab !== tab) setSiblingActiveTab(tab);
  };

  /*****************Form Setting*****************/
  // Set form registration
  const {
    register,
    handleSubmit,
    errors,
    trigger,
    setValue,
    reset,
    control,
    formState,
  } = useForm<IRegisterForm>({
    defaultValues: previewData,
    mode: "onBlur",
  });
  // detect if the form have been edited
  const isFormEdited = formState.isDirty;
  //Reset form once data from db ready
  useEffect(() => {
    reset(previewData, {
      errors: true, // errors will not be reset
      dirtyFields: true, // dirtyFields will not be reset
      isDirty: true, // dirty will not be reset
    });
  }, [previewData]);

  // Form filed array
  const { fields: educationFields } = useFieldArray({
    control,
    name: "education",
    keyName: "education",
  });

  const { fields: parentFields } = useFieldArray({
    control,
    name: "parent",
    keyName: "parent",
  });

  const { fields: siblingFields } = useFieldArray({
    control,
    name: "sibling",
    keyName: "sibling",
  });

  // Handle HasSibling change
  const [hasSibling, setHasSibling] = useState<boolean | null>(null);
  const [siblingArr, setSiblingArr] = useState<string[] | []>([]); // save sibling id from db in the array
  const handleHasSibling = (value: string) => {
    if (value === "true") {
      setHasSibling(true);
    } else {
      setHasSibling(false);
      // if user set have_sibling to false, and there is sibling record from db, reset form sibling record
      if (siblingArr.length > 0) {
        setValue("sibling", [
          {
            id: siblingArr[0],
            name: "",
            sex: "",
            school_name: "",
            grade: "",
          },
          {
            id: siblingArr[1],
            name: "",
            sex: "",
            school_name: "",
            grade: "",
          },
        ]);
      }
    }
  };
  useEffect(() => {
    // set hasSibling state when previewDate state from the store
    if (previewData.have_sibling) {
      // if there is sibling record, set to siblingArr state
      const idArr: string[] = [];
      for (let item of previewData.sibling) {
        idArr.push(item["id"] as string);
      }
      handleHasSibling(String(previewData.have_sibling));
      setSiblingArr((item) => (item = idArr));
    }
    handleHasSibling(String(previewData.have_sibling));
  }, [previewData.have_sibling, previewData.sibling]);

  /*****************Fetch image record*****************/
  // fetch recent photo image (form db/ aws s3)
  const [imageFormDbSource, setImageFormDbSource] = useState<string | null>();
  const [displayImageFormDb, setDisplayImageFormDb] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<FileList | null>(null);
  useEffect(() => {
    if (!isAuth || !previewData.recent_photo_preview_only) {
      return;
    }
    fetch(
      `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/application/id/${applicationId}/imageKey/${previewData.recent_photo_preview_only}`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
      .then((r) => r.blob())
      .then((d) => {
        // clear selected image
        setSelectedImage(null);
        // display image from db if exists
        setDisplayImageFormDb(true);
        setImageFormDbSource(
          (source: string | null | undefined) =>
            (source = window.URL.createObjectURL(d))
        );
      })
      .catch((err) => console.log(err));
  }, [isAuth, previewData.recent_photo_preview_only]);

  // Handle image upload preview

  useEffect(() => {
    setSelectedImage((image) => (image = selectedImageFromStore));
  }, [selectedImageFromStore]);
  useEffect(() => {
    console.log("selectedImage: ", selectedImage);
  }, [selectedImage]);
  const [previewImage, setPreviewImage] = useState<
    string | ArrayBuffer | null
  >();

  const handleDeleteImage = () => {
    // delete file image at App.tsx
    dispatch(addRecentPhotoPreview(null));
    // delete state selectedImage
    setSelectedImage((selectedImage) => (selectedImage = null));
    setValue("recent_photo", "", {
      shouldValidate: true,
      shouldDirty: true,
    });

    // display image from db if exists
    setDisplayImageFormDb(true);
  };
  useEffect(() => {
    if (selectedImage == null) {
      setPreviewImage((previewImage) => (previewImage = null));
      return;
    }

    let reader = new FileReader();
    reader.onload = function () {
      // set selected image to display
      setPreviewImage((previewImage) => (previewImage = reader.result));
      // Hide image form fb
      setDisplayImageFormDb(false);
    };
    //@ts-ignore
    reader.readAsDataURL(selectedImage[0] as any);
  }, [selectedImage]);

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

    if (name === "chinese_name") {
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

  /*****************Submit Handling*****************/
  // Onsubmit handling
  const onSubmit = (formData: IRegisterForm) => {
    formData["recent_photo"] = selectedImage;
    dispatch(putApplication(formData, applicationId as number));
  };
  // successfully updated
  useEffect(() => {
    if (!isLoading && isUpdated) {
      alert(`成功更改資料 \nSuccessfully updated record.`);
      dispatch(putApplicationSuccessFinished());
    }
  }, [isLoading, isUpdated]);
  // Error alert
  useEffect(() => {
    if (!isLoading && isError) {
      if (ErrorType === "PUT_APPLICATION_FAILED_MISSING_CONTENT") {
        alert(
          `請填寫以下內容 \nPlease fill in below information: \n${ErrorMessage}`
        );
      } else if (ErrorType === "PUT_APPLICATION_FAILED_EXPIRED_PERIOD") {
        alert(
          `修改申請時段已過，如有疑問請聯絡管理員。 \nEdit period is expired. Please contact administrator for questions.`
        );
      } else if (ErrorType === "PUT_APPLICATION_FAILED") {
        alert(
          `發生錯誤，請重試。 \nError occurs. Please contact administrator for questions.`
        );
      }
    }
  }, [isLoading, ErrorType, isError, isUpdated]);

  /*****************Loading Handling*****************/
  // Loading handing
  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Banner type="editForm" />
      {/* show modal image*/}
      {isShowModal && <ImageModal src={modalImage as string} />}
      {
        <section className="container">
          <ReminderComponent
            title="修改資料截止時間 Edit Information Deadline:"
            info={moment(previewData.end_deadline).format(
              "YYYY/MM/DD hh:mm:ss"
            )}
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
                        label="申請編號 Application Id"
                        name="idWithPrefix"
                        register={register}
                        type="number"
                        rules={{ required: true }}
                        errors={errors}
                        trigger={trigger}
                        readOnly={true}
                      />
                      {header.content.map((item: any) => (
                        <InputComponent
                          label={item.label}
                          name={item.name}
                          register={register}
                          type="text"
                          rules={{ required: true }}
                          errors={errors}
                          trigger={trigger}
                          readOnly={true}
                        />
                      ))}
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
                          rules={{ required: item.required, max: item.max }}
                          errors={errors}
                          trigger={trigger}
                        />
                      ))}
                    </>
                  ) : header.id === 4 ? (
                    <>
                      {header.content.map((item: any) =>
                        item.name === "email2" ? (
                          ""
                        ) : (
                          <InputComponent
                            label={item.label}
                            name={item.name}
                            register={register}
                            type={item.type}
                            placeholder={item.placeholder}
                            rules={{
                              required: item.required,
                              pattern: item.pattern ? item.pattern : "",
                              minLength: item.minLength ? item.minLength : "",
                            }}
                            errors={errors}
                            trigger={trigger}
                            replaceText={
                              item.type === "tel" ? replaceText : () => {}
                            }
                          />
                        )
                      )}
                    </>
                  ) : header.id === 5 ? (
                    <>
                      <div className="pastEducation">
                        <Nav tabs>
                          {["1", "2", "3"].map((ele) => (
                            <NavItem>
                              <NavLink
                                key={"education" + ele}
                                onClick={() => {
                                  educationToggle("education" + ele);
                                }}
                                className={classnames({
                                  active:
                                    educationActiveTab === "education" + ele,
                                })}
                              >
                                {"以往就讀資料" + ele}
                              </NavLink>
                            </NavItem>
                          ))}
                        </Nav>
                        <TabContent activeTab={educationActiveTab}>
                          {educationFields.map((ele, index) => (
                            <TabPane
                              key={"education" + index}
                              tabId={"education" + (index + 1)}
                            >
                              <b>以往就讀資料 {index + 1}</b>
                              {header.content.map((item: any) => (
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
                                  readOnly={item.readOnly}
                                  isFieldArray={{
                                    status: true,
                                    type: "education",
                                    index: index,
                                  }}
                                />
                              ))}
                            </TabPane>
                          ))}
                        </TabContent>
                      </div>
                    </>
                  ) : header.id === 6 ? (
                    <>
                      <div className="parent">
                        <Nav tabs>
                          {["1", "2", "3"].map((ele, index) => (
                            <NavItem>
                              <NavLink
                                key={"parent" + ele}
                                onClick={() => {
                                  parentToggle("parent" + ele);
                                }}
                                className={classnames({
                                  active: parentActiveTab === "parent" + ele,
                                })}
                              >
                                {"家長或監護人" + (index + 1)}
                              </NavLink>
                            </NavItem>
                          ))}
                        </Nav>
                        <TabContent activeTab={parentActiveTab}>
                          {parentFields.map((ele, index) => (
                            <TabPane
                              key={"parent" + index}
                              tabId={"parent" + (index + 1)}
                            >
                              <b>家長或監護人 {index + 1}</b>
                              {header.content.map((item: any) => (
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
                                    minLength: item.minLength
                                      ? item.minLength
                                      : "",
                                    maxLength: item.maxLength
                                      ? item.maxLength
                                      : "",
                                  }}
                                  errors={errors}
                                  trigger={trigger}
                                  readOnly={item.readOnly}
                                  replaceText={
                                    item.type === "tel" ||
                                    item.name ===
                                      ("chinese_name" || "english_name")
                                      ? replaceText
                                      : () => {}
                                  }
                                  isFieldArray={{
                                    status: true,
                                    type: "parent",
                                    index: index,
                                  }}
                                />
                              ))}
                            </TabPane>
                          ))}
                        </TabContent>
                      </div>
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
                      {hasSibling && (
                        <div className="sibling">
                          <Nav tabs>
                            {["1", "2"].map((ele, index) => (
                              <NavItem>
                                <NavLink
                                  className={classnames({
                                    active:
                                      siblingActiveTab === "sibling" + ele,
                                  })}
                                  onClick={() => {
                                    siblingToggle("sibling" + ele);
                                  }}
                                >
                                  {"兄弟姊妹" + (index + 1)}
                                </NavLink>
                              </NavItem>
                            ))}
                          </Nav>
                          <TabContent activeTab={siblingActiveTab}>
                            {siblingFields.map((ele, index) => (
                              <TabPane
                                key={"sibling" + index}
                                tabId={"sibling" + (index + 1)}
                              >
                                <b>兄弟姊妹 {index + 1}</b>
                                {header.content.map((item: any) => (
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
                                    readOnly={item.readOnly}
                                    isFieldArray={{
                                      status: true,
                                      type: "sibling",
                                      index: index,
                                    }}
                                  />
                                ))}
                              </TabPane>
                            ))}
                          </TabContent>
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
                          <>
                            <InputComponent
                              label={item.label}
                              name={item.name}
                              type="file"
                              register={register}
                              rules={{
                                required: displayImageFormDb
                                  ? false
                                  : item.required,
                              }}
                              errors={errors}
                              trigger={trigger}
                              loadImageFromDb={true}
                              displayImageFormDb={displayImageFormDb}
                              imageFormDbSource={imageFormDbSource}
                              previewImage={previewImage}
                              onChangeFunction={setSelectedImage}
                              onClickFunction={handleDeleteImage}
                            />
                          </>
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
              {isFormEdited ? (
                <Input type="submit" className="submit" value="儲存" />
              ) : (
                <Input type="submit" className="submit" value="儲存" disabled />
              )}
            </div>
          </Form>
        </section>
      }
    </>
  );
}
