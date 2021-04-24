import React, { LegacyRef } from "react";
import { Controller, DeepMap, FieldError } from "react-hook-form";
import { Label } from "reactstrap";
import { IApplicationForm } from "../application/ApplicationDetails";
import { recordType as IPeriodForm } from "../redux/applicationPeriod/reducer";
import { User } from "../redux/user/state";
// FontAwesome
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// react select
import AsyncSelect from "react-select/async";
import { showModalImage } from "../redux/application/action";
import { useDispatch } from "react-redux";

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
        pattern?: { value: RegExp; message: string };
        validate?: () => boolean | string;
    };
    errors: DeepMap<IApplicationForm, FieldError> | DeepMap<User, FieldError> | DeepMap<IPeriodForm, FieldError>;
    trigger: (
        name?: keyof (IApplicationForm | User) | (keyof (IApplicationForm | User))[] | undefined
    ) => Promise<boolean>;
    // For select option
    options?: [boolean, string][] | [string, string][] | [number, string][];
    // For select and preview image
    onChangeFunction?: (value: any) => void;
    // For react select
    control?: any;
    reactSelectValue?: any;
    loadOptions?: any;
    onInputChange?: any;
    onChange?: any;
    // Preview recent_photo/ deposit_slip image
    onClickFunction?: () => void;
    loadImageFromDb?: boolean;
    // For preview image
    previewImage?: any;
    displayImageFormDb?: boolean;
    imageFormDbSource?: string;
    // For preview slip images
    selectedSlips?: any;
    previewSlips?: any;
    displayDepositImageFormDb?: boolean;
    depositImageFormDbSource?: any[];
    // for text replacing
    replaceText?: (value: any, name: string, type: string) => void | "";
    // for field array error
    isFieldArray?: { status: boolean; type: string; index: number };
}) {
    const dispatch = useDispatch();

    // generate className
    function genClassName(myClassName: string, error: DeepMap<IApplicationForm, FieldError>, fieldType: string) {
        const className = ["myInput"];
        if (myClassName) {
            className.push(myClassName);
        }
        if (fieldType === "textarea" || "files" || "file") {
            className.push(fieldType);
        }
        if (typeof error !== "undefined") {
            console.log("error: ", error);
            className.push("formError");
        }
        return className.join(" ");
    }
    return (
        <>
            <div
                key={props.name}
                className={genClassName(
                    props.readOnly ? "no_border" : (props.className as string),
                    (props.errors as any)[props.name],
                    props.type
                )}
            >
                <Label htmlFor={props.name}>
                    {props.label}
                    {props.rules.required && <span style={{ color: "red" }}>*</span>}
                </Label>
                <div>
                    {props.type === "textarea" ? (
                        <textarea
                            className={(props.errors as any)[props.name] ? "inputError" : ""}
                            name={props.name}
                            defaultValue={props.defaultValue}
                            placeholder={props.placeholder ? props.placeholder : ""}
                            ref={props.register(props.rules) as LegacyRef<HTMLTextAreaElement>}
                            onChange={(e) => {
                                props.trigger([props.name as keyof (IApplicationForm | User)]);
                                // replace character not meeting pattern
                                if (props.replaceText) {
                                    props.replaceText(e.target.value, props.name, props.type);
                                }
                            }}
                            readOnly={props.readOnly}
                        ></textarea>
                    ) : props.type === "date" ? (
                        <input
                            className={(props.errors as any)[props.name] ? "inputError" : ""}
                            type={props.type}
                            max={props.rules.max}
                            name={props.name}
                            defaultValue={props.defaultValue}
                            ref={props.register(props.rules) as LegacyRef<HTMLInputElement>}
                            onChange={() => {
                                props.trigger([props.name as keyof (IApplicationForm | User)]);
                            }}
                            readOnly={props.readOnly}
                        />
                    ) : props.type === "select" ? (
                        <select
                            disabled={props.readOnly}
                            className={(props.errors as any)[props.name] ? "inputError form-select" : "form-select"}
                            name={props.name}
                            defaultValue={props.defaultValue}
                            ref={props.register(props.rules) as LegacyRef<HTMLSelectElement>}
                            onChange={(e) => (props.onChangeFunction ? props.onChangeFunction(e.target.value) : "")}
                        >
                            {props.options?.map((opt: [boolean, string] | [number, string] | [string, string]) => {
                                return <option value={opt[0] + ""}>{opt[1] + ""}</option>;
                            })}
                        </select>
                    ) : props.type === "AsyncSelect" ? (
                        <Controller
                            ref={props.register(props.rules) as LegacyRef<HTMLTextAreaElement>}
                            control={props.control}
                            defaultValue={props.reactSelectValue || ""}
                            name={props.name}
                            as={
                                <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    defaultValue
                                    isDisabled={props.readOnly}
                                    placeholder="請選擇收生時段"
                                    value={props.reactSelectValue}
                                    loadOptions={props.loadOptions}
                                    //@ts-ignore
                                    onInputChange={props.handleInputChange as any}
                                    //@ts-ignore
                                    onChange={props.handleSelectChange}
                                    getOptionValue={(option) => option.value as any}
                                    getOptionLabel={(option) => option.label}
                                />
                            }
                        />
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
                                    props.trigger([props.name as keyof (IApplicationForm | User)]);
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
                                            onClick={() => (props.onClickFunction ? props.onClickFunction() : "")}
                                        />
                                    </div>
                                    <div className="previewImgRight">
                                        <Label className="reUploadImg" htmlFor={props.name}>
                                            更改圖片
                                        </Label>

                                        {props.loadImageFromDb && props.selectedSlips === ""
                                            ? props.depositImageFormDbSource!.map(
                                                  (ImgSource: string, index: number) => {
                                                      return (
                                                          <img
                                                              key={`deposit img [${index}]`}
                                                              src={ImgSource}
                                                              alt={ImgSource}
                                                              onClick={() => dispatch(showModalImage(true, ImgSource))}
                                                          />
                                                      );
                                                  }
                                              )
                                            : props.previewSlips.map((previewSlip: string, index: number) => {
                                                  return (
                                                      <img
                                                          key={`deposit img [${index}]`}
                                                          src={previewSlip}
                                                          alt={`deposit img [${index}]`}
                                                          onClick={() => dispatch(showModalImage(true, previewSlip))}
                                                      />
                                                  );
                                              })}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : props.type === "file" ? (
                        <>
                            <input
                                style={{ display: "none" }}
                                className="form-control form-control-lg"
                                type={props.type}
                                id={props.name}
                                name={props.name}
                                ref={props.register(props.rules) as LegacyRef<HTMLInputElement>}
                                accept=".png, .jpg, .jpeg"
                                onChange={(e) =>
                                    props.onChangeFunction
                                        ? e.target.files
                                            ? props.onChangeFunction(e.target.files[0])
                                            : ""
                                        : ""
                                }
                            />
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
                                                onClick={() => (props.onClickFunction ? props.onClickFunction() : "")}
                                            />
                                        </div>
                                    )}

                                    <div className="previewImgRight">
                                        <Label className="reUploadImg" htmlFor={props.name}>
                                            更改圖片
                                        </Label>
                                        {props.loadImageFromDb && props.displayImageFormDb ? (
                                            typeof props.imageFormDbSource === "undefined" ? (
                                                ""
                                            ) : (
                                                <img
                                                    src={props.imageFormDbSource}
                                                    alt={props.imageFormDbSource}
                                                    onClick={() =>
                                                        dispatch(
                                                            showModalImage(true, props.imageFormDbSource as string)
                                                        )
                                                    }
                                                />
                                            )
                                        ) : (
                                            <img
                                                src={props.previewImage as string}
                                                alt={props.previewImage as string}
                                                onClick={() => dispatch(showModalImage(true, props.previewImage))}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <input
                            className={(props.errors as any)[props.name] ? "inputError" : ""}
                            type={props.type}
                            name={props.name}
                            defaultValue={props.defaultValue}
                            placeholder={props.placeholder ? props.placeholder : ""}
                            ref={props.register(props.rules) as LegacyRef<HTMLInputElement>}
                            onChange={(e) => {
                                props.trigger([props.name as keyof (IApplicationForm | User)]);

                                // replace character not meeting pattern
                                if (props.replaceText) {
                                    props.replaceText(e.target.value, props.name, props.type);
                                }
                            }}
                            readOnly={props.readOnly}
                        />
                    )}

                    {/* for required error */}
                    {(props.errors as any)[props.name] && (props.errors as any)[props.name].type === "required" && (
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
                        ? (props.errors as any)[props.isFieldArray?.type].map((item: any, index: number) => {
                              // get the filed name from props.name
                              const nameIndex = props.name.indexOf(".");
                              const filedName = props.name.slice(nameIndex + 1);

                              // return if the current error is not belong with the props.name
                              if (index !== props.isFieldArray?.index || typeof item[filedName] === "undefined") {
                                  return;
                              }

                              return (
                                  <div role="alert" className="formErrorAlert">
                                      {item[filedName].type === "required"
                                          ? "請填寫這欄位 This field is required."
                                          : item[filedName].message}
                                  </div>
                              );
                          })
                        : ""}
                </div>
            </div>
        </>
    );
}
