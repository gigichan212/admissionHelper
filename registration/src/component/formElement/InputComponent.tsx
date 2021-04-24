import React, { LegacyRef } from "react";
import { DeepMap, FieldError } from "react-hook-form";
import { Label } from "reactstrap";
import { IRegisterForm } from "../formPage/FormStep1";
import { ILoginForm } from "../Login/Login";
// FontAwesome
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { showModalImage } from "../../redux/application/actions";

export default function InputComponent(props: {
  readOnly?: boolean;
  className?: string;
  label: string;
  name: string;
  defaultValue?: any;
  placeholder?: string;
  register: (rules: any) => {};
  type: string;
  rules: {
    required: boolean;
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    max?: string;
    min?: string;
    pattern?: { value: RegExp; message: string };
    validate?: () => boolean | string | void;
  };
  errors: DeepMap<IRegisterForm, FieldError> | DeepMap<ILoginForm, FieldError>;
  trigger:
    | ((
        name?: keyof IRegisterForm | (keyof IRegisterForm)[] | undefined
      ) => Promise<boolean>)
    | ((
        name?: keyof ILoginForm | (keyof ILoginForm)[] | undefined
      ) => Promise<boolean>);
  // For select option
  options?: [boolean, string][] | [string, string][] | [number, string][];
  //  For select and preview image
  onChangeFunction?: (value: any) => void;
  // Preview recent_photo/ deposit_slip image
  onClickFunction?: () => void;
  loadImageFromDb?: boolean;
  recentPhotoError?: boolean;
  // For preview image
  previewImage?: any;
  displayImageFormDb?: boolean;
  imageFormDbSource?: string | null;
  // For preview slip images
  selectedSlips?: any;
  previewSlips?: any;
  depositImageFormDbSource?: string[];
  // for text replacing
  replaceText?: (value: any, name: string, type: string) => void | "";
  // for field array error
  isFieldArray?: { status: boolean; type: string; index: number };
}) {
  const dispatch = useDispatch();

  // generate input class name
  function genClassName(
    myClassName: string,
    error: DeepMap<IRegisterForm, FieldError>
  ) {
    const className = ["form-ele"];
    if (typeof error !== "undefined") {
      className.push("formError");
    }
    if (myClassName) {
      className.push(myClassName);
    }

    return className.join(" ");
  }

  return (
    <>
      <div
        key={"input " + props.name}
        className={genClassName(
          props.readOnly ? "no_border" : (props.className as string),
          (props.errors as any)[props.name]
        )}
      >
        <div className="formLeft">
          <Label
            htmlFor={props.name}
            className={
              props.className === "labelReminder" ? "labelReminder" : ""
            }
          >
            {props.label}
            {props.rules.required && <span style={{ color: "red" }}>*</span>}
          </Label>
          {props.className === "labelReminder" && (
            <>
              <span style={{ fontSize: "13px", display: "block" }}>
                此電郵地址將接收報名確認通知
                <br />
                （提示: 如未收到郵件, 請檢查垃圾郵件匣）
              </span>
            </>
          )}
        </div>

        <div className="formRight">
          {props.type === "textarea" ? (
            <textarea
              readOnly={props.readOnly}
              className={(props.errors as any)[props.name] ? "inputError" : ""}
              name={props.name}
              defaultValue={props.defaultValue}
              placeholder={props.placeholder ? props.placeholder : ""}
              ref={
                props.register(props.rules) as LegacyRef<HTMLTextAreaElement>
              }
              onChange={(e) => {
                props.trigger([props.name as any]);
                // replace character not meeting pattern
                if (props.replaceText) {
                  props.replaceText(e.target.value, props.name, props.type);
                }
              }}
            ></textarea>
          ) : props.type === "date" ? (
            <input
              readOnly={props.readOnly}
              className={(props.errors as any)[props.name] ? "inputError" : ""}
              type={props.type}
              max={props.rules.max}
              min={props.rules.min}
              name={props.name}
              defaultValue={props.defaultValue}
              ref={props.register(props.rules) as LegacyRef<HTMLInputElement>}
              onChange={() => {
                props.trigger([props.name as any]);
              }}
            />
          ) : props.type === "select" ? (
            <select
              disabled={props.readOnly}
              className={
                (props.errors as any)[props.name]
                  ? "inputError form-select"
                  : "form-select"
              }
              name={props.name}
              defaultValue={props.defaultValue}
              ref={props.register(props.rules) as LegacyRef<HTMLSelectElement>}
              onChange={(e) =>
                props.onChangeFunction
                  ? props.onChangeFunction(e.target.value)
                  : ""
              }
            >
              <option value="">請選擇 Please Select</option>

              {props.options?.map(
                (
                  opt: [boolean, string] | [number, string] | [string, string]
                ) => {
                  return (
                    <option key={opt[0] + ""} value={opt[0] + ""}>
                      {opt[1] + ""}
                    </option>
                  );
                }
              )}
            </select>
          ) : props.type === "files" ? (
            <>
              <input
                style={{ display: "none" }}
                className="form-control form-control-lg"
                type="file"
                id={props.name}
                name={props.name}
                ref={props.register(props.rules) as LegacyRef<HTMLInputElement>}
                accept=".png, .jpg, .jpeg"
                multiple
                onChange={(e) => {
                  if (props.onChangeFunction && e.target.files) {
                    props.onChangeFunction(e.target.files);
                  }
                  props.trigger([props.name as any]);
                }}
              />
              {!props.previewSlips[0] && !props.loadImageFromDb ? (
                <div>
                  <Label className="uploadFileBtn" htmlFor={props.name}>
                    上傳圖片 Upload File
                  </Label>
                </div>
              ) : (
                <div className="singleImgPreview">
                  <div className="deleteFormImg">
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      onClick={() =>
                        props.onClickFunction ? props.onClickFunction() : ""
                      }
                    />
                  </div>
                  <div className="previewImgRight">
                    <Label className="reUploadImg" htmlFor={props.name}>
                      更改圖片
                    </Label>

                    {props.loadImageFromDb && props.selectedSlips === ""
                      ? props.depositImageFormDbSource!.map(
                          //show images from db
                          (ImgSource: string, index: number) => {
                            return (
                              <img
                                key={`deposit img [${index}]`}
                                src={ImgSource}
                                alt={ImgSource}
                                onClick={() =>
                                  dispatch(showModalImage(true, ImgSource))
                                }
                              />
                            );
                          }
                        )
                      : props.previewSlips.map(
                          //show user selected images
                          (previewSlip: string, index: number) => {
                            return (
                              <img
                                key={`deposit img [${index}]`}
                                src={previewSlip}
                                alt={`deposit img [${index}]`}
                                onClick={() =>
                                  dispatch(showModalImage(true, previewSlip))
                                }
                              />
                            );
                          }
                        )}
                  </div>
                </div>
              )}
            </>
          ) : props.type === "file" ? (
            <>
              {!props.previewImage && !props.loadImageFromDb && (
                <div>
                  <Label className="uploadFileBtn" htmlFor={props.name}>
                    上傳圖片 Upload File
                  </Label>
                </div>
              )}
              {(props.previewImage != null || props.loadImageFromDb) && (
                <div className="singleImgPreview">
                  {!props.displayImageFormDb && (
                    <div className="deleteFormImg">
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        onClick={() =>
                          props.onClickFunction ? props.onClickFunction() : ""
                        }
                      />
                    </div>
                  )}

                  <div className="previewImgRight">
                    <Label className="reUploadImg" htmlFor={props.name}>
                      更改圖片
                    </Label>
                    {props.loadImageFromDb && props.displayImageFormDb ? (
                      <img
                        src={props.imageFormDbSource as string}
                        alt={props.imageFormDbSource as string}
                        onClick={() =>
                          dispatch(
                            showModalImage(true, props.imageFormDbSource!)
                          )
                        }
                      />
                    ) : (
                      <img
                        src={props.previewImage as string}
                        alt={props.previewImage as string}
                        onClick={() =>
                          dispatch(showModalImage(true, props.previewImage))
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <input
              readOnly={props.readOnly}
              className={(props.errors as any)[props.name] ? "inputError" : ""}
              type={props.type}
              name={props.name}
              defaultValue={props.defaultValue}
              placeholder={props.placeholder ? props.placeholder : ""}
              ref={props.register(props.rules) as LegacyRef<HTMLInputElement>}
              onChange={(e) => {
                props.trigger([props.name as any]);

                // replace character not meeting pattern
                if (props.replaceText) {
                  props.replaceText(e.target.value, props.name, props.type);
                }
              }}
            />
          )}
          {/* for required error */}
          {(props.errors as any)[props.name] &&
            (props.errors as any)[props.name].type === "required" && (
              <div role="alert" className="formErrorAlert">
                請填寫這欄位 This field is required.
              </div>
            )}
          {/* for recent_photo error, since this field isn't registered using react hook form */}
          {props.type === "file" && props.recentPhotoError && (
            <div role="alert" className="formErrorAlert">
              請填寫這欄位 This field is required.
            </div>
          )}

          {/* for all other error */}
          {(props.errors as any)[props.name] && (
            <span role="alert" className="formErrorAlert">
              {(props.errors as any)[props.name].message}
            </span>
          )}
          {/* for field array error */}
          {props.isFieldArray && (props.errors as any)[props.isFieldArray?.type]
            ? (props.errors as any)[props.isFieldArray?.type].map(
                (item: any, index: number) => {
                  // get the filed name from props.name
                  const nameIndex = props.name.indexOf(".");
                  const filedName = props.name.slice(nameIndex + 1);

                  // return if the current error is not belong with the props.name
                  if (
                    index !== props.isFieldArray?.index ||
                    typeof item[filedName] === "undefined"
                  ) {
                    return;
                  }

                  return (
                    <div role="alert" className="formErrorAlert">
                      {item[filedName].type === "required"
                        ? "請填寫這欄位 This field is required."
                        : item[filedName].message}
                    </div>
                  );
                }
              )
            : ""}
        </div>
      </div>
    </>
  );
}
