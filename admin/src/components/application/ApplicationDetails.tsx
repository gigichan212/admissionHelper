import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useRouter from "use-react-router";
import { RootState } from "../../store";
import { formInternalRemark, sectionHeader } from "../../util/sectionHeader";
import {
    addApplicationSuccessFinished,
    getSingleRecordInitialState,
    markImageIsLoading,
    putApplicationSuccessFinished,
} from "../redux/application/action";
// Css
import styles from "../../assets/scss/application/applicationDetails.module.scss";
// Form
import { useFieldArray, useForm } from "react-hook-form";
import InputComponent from "../formElement/InputComponent";
//Tab
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import { EducationState, ParentState, SiblingState } from "../redux/application/state";
import { push } from "connected-react-router";
import { addApplication, fetchSingleRecord, putApplication } from "../redux/application/thunkAction";
import moment from "moment";
import LoadingComponent from "../general/Loading";
import { ImageModal } from "./ImageModal";

export interface IApplicationForm {
    application_period: { value: number; label: string };
    application_status: string;
    depositSlips: [];
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
    phone: number | null;
    address: string;
    have_sibling: boolean;
    remarks: string;
    recent_photo: string;
    slips: string;
    education: EducationState[];
    sibling: SiblingState[];
    parent: ParentState[];
    interviewer: { value: number; label: string };
    interview_date_time: string;
    interview_date: string;
    interview_time: string;
    first_round_score: number | null;
    first_round_remarks: string;
    second_round_score: number | null;
    second_round_remarks: string;
    school_remarks: string;
}

export function ApplicationDetails(props: { myToken: string }) {
    const dispatch = useDispatch();

    //Get application record (and related info )from store
    let { record, isLoading, imageIsLoading, isUpdated, isAddApplicationLoading, isAdded } = useSelector(
        (state: RootState) => {
            return state.application.payload.singleRecord;
        }
    );
    let { role, userId } = useSelector((state: RootState) => {
        return state.auth.payload.login;
    });
    // get modal image status from store
    const { isShow: isShowModal, modalImage } = useSelector((state: RootState) => {
        return state.application.payload.singleRecord.showModalImage;
    });

    // for teacher only
    // redirect teacher back to application list if interviewer_id !== userId
    useEffect(() => {
        if (record.interviewer_id) {
            if (role === "teacher" && record.interviewer_id !== userId) {
                dispatch(push("/application"));
            }
        }
    }, [record, userId, dispatch, role]);

    //Get error status from store
    const { isError, ErrorMessage, ErrorType } = useSelector((state: RootState) => {
        return state.application.payload.singleRecord.error;
    });
    // router handling
    const router = useRouter<{ id?: string }>();
    const applicationId = parseInt(router.match.params.id as string);
    useEffect(() => {
        // push to application list for strange params
        if (!router.location.pathname.endsWith("add") && isNaN(applicationId)) {
            dispatch(push("/application"));
        }

        // clear redux singleRecord state if this is add new application page
        if (router.location.pathname.endsWith("add")) {
            dispatch(getSingleRecordInitialState());
        }
    }, [router.location.pathname, dispatch, applicationId]);

    //Get current application id from params
    // fetch recent photo / deposit image (form db/ aws s3)
    useEffect(() => {
        // If this is add application page, return
        // otherwise fetch application record
        if (!router.location.pathname.endsWith("add")) {
            dispatch(fetchSingleRecord(applicationId));
            clearAllImages();
        }
    }, [applicationId, dispatch, router.location.pathname]);

    /********************************************************************/
    // Tab control
    const [mainActiveTab, setMainActiveTab] = useState("main1");
    const mainToggle = (tab: any) => {
        if (mainActiveTab !== tab) setMainActiveTab(tab);
    };
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
    // Not showing "系統資料" if this is add new application page
    function getTabNav() {
        if (isNaN(applicationId)) {
            return ["申請記錄", "校方填寫"];
        } else {
            return ["申請記錄", "校方填寫", "系統資料"];
        }
    }

    /********************************************************************/
    // Form
    // Set form registration
    const {
        register,
        handleSubmit,
        errors,
        trigger,
        setValue,
        control,
        reset,
        formState,
        watch,
    } = useForm<IApplicationForm>({
        defaultValues: record,
        mode: "onBlur",
    });
    // detect if the form have been edited
    const isFormEdited = formState.isDirty;

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
        if (record.have_sibling) {
            // if there is sibling record, set to siblingArr state
            const idArr: string[] = [];
            for (let item of record.sibling) {
                idArr.push(item["id"] as string);
            }
            handleHasSibling(String(record.have_sibling));
            setSiblingArr((item) => (item = idArr));
        }
        handleHasSibling(String(record.have_sibling));
    }, [record.have_sibling, record.sibling]);

    // fetch recent photo / deposit image (form db/ aws s3)
    const [imageFormDbSource, setImageFormDbSource] = useState<any>(null);
    const [displayImageFormDb, setDisplayImageFormDb] = useState<boolean>(false);
    const [depositImageFormDbSource, setDepositImageFormDbSource] = useState<any>([]);
    const [displayDepositImageFormDb, setDisplayDepositImageFormDb] = useState<boolean>(false);
    const [slipFromDbIsDeleted, setSlipFromDbIsDeleted] = useState<boolean>(false);

    // define fetching image function
    const fetchImage = useCallback(fetchImage2, []);
    function clearAllImages() {
        setImageFormDbSource(null);
        setDisplayImageFormDb(false);
        setDepositImageFormDbSource([]);
        setDisplayDepositImageFormDb(false);
        setSlipFromDbIsDeleted(true);
    }
    function fetchImage2(imageKeys: any[], type: string) {
        try {
            dispatch(markImageIsLoading(true));
            const result = imageKeys.map((slip) => {
                return fetch(
                    `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/application/id/${applicationId}/imageKey/${slip["deposit_slip"]}`,
                    {
                        headers: { Authorization: "Bearer " + props.myToken },
                    }
                ).then((r) => {
                    return r.blob();
                });
            });

            Promise.all(result)
                .then((res) => {
                    if (type === "recent_photo") {
                        setDisplayImageFormDb(true);
                        setImageFormDbSource(res.map((blobUrl) => window.URL.createObjectURL(blobUrl)));
                    } else if (type === "deposit_slip") {
                        setDisplayDepositImageFormDb(true);
                        setDepositImageFormDbSource(res.map((blobUrl) => window.URL.createObjectURL(blobUrl)));
                    }
                })
                .catch((err) => {
                    console.log(err);
                    clearAllImages();
                });
        } catch (err) {
            console.log(err);
            clearAllImages();
        } finally {
            dispatch(markImageIsLoading(false));
        }
    }

    useEffect(() => {
        // return if there is no image from db or this is a add new application page
        // return if application id doesn't match
        if (
            typeof record.recent_photo_preview_only === "undefined" ||
            isNaN(applicationId) ||
            applicationId !== record.id
        ) {
            return;
        }

        fetchImage([{ deposit_slip: record.recent_photo_preview_only }], "recent_photo");
    }, [record.recent_photo_preview_only, dispatch, fetchImage, record.id]);
    useEffect(() => {
        // return if there is no image from db
        // return if this is a add new application page
        // return if application id doesn't match
        if (
            typeof record.depositSlips === "undefined" ||
            isNaN(applicationId) ||
            record.depositSlips.length === 0 ||
            applicationId !== record.id
        ) {
            return;
        }

        fetchImage(record.depositSlips, "deposit_slip");
    }, [record.depositSlips, dispatch, fetchImage]);

    // Handle image upload preview
    const [selectedImage, setSelectedImage] = useState<Blob | null>(null);
    const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>();

    const handleDeleteImage = () => {
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
            setPreviewImage((previewImage) => (previewImage = reader.result));
            // Hide image form fb
            setDisplayImageFormDb(false);
        };
        reader.readAsDataURL(selectedImage);
    }, [selectedImage, dispatch]);

    // Preview Slips Handling
    const [selectedSlips, setSelectedSlips] = useState<any>("");
    const [previewSlips, setPreviewSlips] = useState<any[]>([]);
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
                setPreviewSlips((previewSlips: any) => previewSlips.concat(reader.result));
            };
            reader.readAsDataURL(selectedFile);
        }
    }, [selectedSlips, dispatch]);
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

    /********************************************************************/
    // on submit control
    const onSubmit = (data: any) => {
        console.log(data);
        // add new application
        if (router.location.pathname.endsWith("add")) {
            localStorage.setItem("submitting", "true");
            dispatch(addApplication(data, data.application_type));
        } else {
            dispatch(putApplication(data, record.id, slipFromDbIsDeleted));
        }
    };

    // Error alert
    useEffect(() => {
        if (!isLoading && isError) {
            if (ErrorType === "ADD_APPLICATION_FAILED_MISSING_CONTENT") {
                alert(`請填寫以下資料: \n${ErrorMessage}`);
            } else if (ErrorType === "PUT_APPLICATION_FAILED_MISSING_CONTENT") {
                alert(`請填寫以下資料: \n${ErrorMessage}`);
            } else if (ErrorType === "ADD_APPLICATION_FAILED_EXPIRED_PERIOD") {
                alert(`所選擇的申請時段已過期。`);
            } else if (ErrorType === "PUT_APPLICATION_FAILED" || "ADD_APPLICATION_FAILED") {
                alert(`發生錯誤，請重試。`);
            }
        }
    }, [isLoading, ErrorType, isError, dispatch, ErrorMessage]);

    /********************************************************************/
    // fetch application period options
    //  const [inputPeriodValue, setInputPeriodValue] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState<{ value: number; label: string }>();
    // handle input change event
    // handle selection
    const handleSelectPeriodChange = (value: any) => {
        setSelectedValue(value);
    };
    //set default value based on redux record
    const [periodOptions, setPeriodOptions] = useState<any>();
    useEffect(() => {
        if (typeof periodOptions === "undefined") {
            return;
        }
        setSelectedValue(
            (selected: any) =>
                (selected = periodOptions.filter((option: any) => option.value === record.application_period_id)[0])
        );
    }, [periodOptions, selectedValue, dispatch, record.application_period_id]);

    // load options from db
    const loadPeriodOptions = (inputValue: any) => {
        return fetch(
            `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/teacher/application-period`,
            {
                headers: { Authorization: "Bearer " + props.myToken },
            }
        )
            .then((res) => res.json())
            .then((result) => {
                const options: any[] = [];
                result.data.forEach((item: any) => {
                    if (item["type"] === "normal") {
                        options.push({
                            value: item["id"],
                            label: `收生類別: 新生      收生年份: ${item["application_year"]}        收生階段: ${item["round"]}`,
                        });
                    } else {
                        options.push({
                            value: item["id"],
                            label: `收生類別: 插班生     收生年份: ${item["application_year"]}        收生階段: ${item["round"]}`,
                        });
                    }
                });

                // set period options for default value setting
                setPeriodOptions(
                    (option: any) => (option = options.filter((option) => option.label.includes(inputValue)))
                );
                return options.filter((option) => option.label.includes(inputValue));
            });
    };

    /********************************************************************/
    // fetch teacher options
    // const [inputTeacherValue, setInputTeacherValue] = useState<string>("");
    const [selectedTeacherValue, setSelectedTeacherValue] = useState<{ value: number; label: string }>();

    // handle selection
    const handleSelectTeacherChange = (value: any) => {
        setSelectedTeacherValue(value);
    };
    //set default value based on redux record
    const [teacherOptions, setTeacherOptions] = useState<any>();
    useEffect(() => {
        if (typeof teacherOptions === "undefined") {
            return;
        }
        setSelectedTeacherValue(
            (selected: any) =>
                (selected = teacherOptions.filter((option: any) => option.value === record.interviewer_id)[0])
        );
    }, [periodOptions, selectedTeacherValue, dispatch, record.interviewer_id, teacherOptions]);

    // load options from db
    const loadTeacherOptions = (inputValue: any) => {
        return fetch(
            `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/user/teachers`,
            {
                headers: { Authorization: "Bearer " + props.myToken },
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.isSuccess) {
                    const options: { value: number; label: string }[] = [];
                    for (let item of result.teachers) {
                        options.push({
                            value: item["id"],
                            label: item["username"],
                        });
                    }
                    // set teacher options for default value setting
                    setTeacherOptions(
                        (option: any) => (option = options.filter((option) => option.label.includes(inputValue)))
                    );
                    return options.filter((option) => option.label.includes(inputValue));
                }
            })
            .catch((err) => {
                return "Oh! Error occurs!";
            });
    };

    /********************************************************************/
    //Reset form once data from db ready
    useEffect(() => {
        reset(
            {
                ...record,
                application_period: selectedValue,
                interviewer: selectedTeacherValue,
            },
            {
                errors: true,
                dirtyFields: true,
                isDirty: true,
            }
        );
    }, [record, selectedValue, selectedTeacherValue, dispatch, reset]);
    // successfully updated
    useEffect(() => {
        if (!isLoading && isUpdated) {
            alert(`成功更改資料`);
            dispatch(putApplicationSuccessFinished());
        } else if (!isLoading && isAdded) {
            alert(`成功新增資料`);
            dispatch(addApplicationSuccessFinished());
        }
    }, [isLoading, isUpdated, dispatch, isAdded]);
    /********************************************************************/
    // loading handling
    if (isLoading || imageIsLoading) {
        return <LoadingComponent />;
    }
    // Not found handling
    if (ErrorType === "FETCH_SINGLE_APPLICATION_NOT_FOUND") {
        return <p>Not found</p>;
    }

    return (
        <main>
            <section className={styles.top_container}>
                {/* show modal image*/}
                {isShowModal && <ImageModal src={modalImage as string} />}
                <Nav tabs>
                    {getTabNav().map((header, index) => (
                        <NavItem>
                            <NavLink
                                key={`main${index + 1}`}
                                className={classnames({
                                    active: mainActiveTab === `main${index + 1}`,
                                })}
                                onClick={() => {
                                    mainToggle(`main${index + 1}`);
                                }}
                            >
                                {header}
                            </NavLink>
                        </NavItem>
                    ))}
                </Nav>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TabContent activeTab={mainActiveTab}>
                        <TabPane tabId="main1">
                            {sectionHeader.map((header) => (
                                <div className={`${styles.container} ${styles.formDetail}`}>
                                    <div className={styles.formContentTop}>
                                        <b>{header.header}</b>
                                        <hr />
                                    </div>
                                    {header.id === 0 ? (
                                        <div className={`${styles.formContent}`}>
                                            {header.content.map((item: any) => (
                                                <InputComponent
                                                    className="individualField"
                                                    label={item.label}
                                                    name={item.name}
                                                    register={register}
                                                    type={item.type}
                                                    rules={{
                                                        required: item.required,
                                                    }}
                                                    readOnly={item.readOnly}
                                                    errors={errors}
                                                    trigger={trigger}
                                                    control={control}
                                                    reactSelectValue={selectedValue}
                                                    loadOptions={loadPeriodOptions}
                                                    // onInputChange={handlePeriodInputChange}
                                                    onChange={handleSelectPeriodChange}
                                                />
                                            ))}
                                        </div>
                                    ) : header.id === 1 ? (
                                        <div className={`${styles.formContent}`}>
                                            {header.content.map((item: any) => (
                                                <InputComponent
                                                    className="individualField"
                                                    label={item.label}
                                                    name={item.name}
                                                    register={register}
                                                    type={item.type}
                                                    options={item.options}
                                                    rules={{
                                                        required: item.required,
                                                    }}
                                                    readOnly={item.readOnly}
                                                    errors={errors}
                                                    trigger={trigger}
                                                />
                                            ))}
                                        </div>
                                    ) : header.id === 2 ? (
                                        <div className={`${styles.formContent}`}>
                                            {header.content.map((item: any) => (
                                                <InputComponent
                                                    className="individualField"
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
                                        </div>
                                    ) : header.id === 3 ? (
                                        <div className={`${styles.formContent}`}>
                                            {header.content.map((item: any) => (
                                                <InputComponent
                                                    className="individualField"
                                                    label={item.label}
                                                    name={item.name}
                                                    register={register}
                                                    type={item.type}
                                                    rules={{
                                                        required: item.required,
                                                        max: item.max,
                                                    }}
                                                    errors={errors}
                                                    trigger={trigger}
                                                />
                                            ))}
                                        </div>
                                    ) : header.id === 4 ? (
                                        <div className={`${styles.formContent}`}>
                                            {header.content.map((item: any) => (
                                                <InputComponent
                                                    className="individualField"
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
                                                    replaceText={item.type === "tel" ? replaceText : () => {}}
                                                />
                                            ))}
                                        </div>
                                    ) : header.id === 5 ? (
                                        <div className={`${styles.formContent}`}>
                                            <div className={styles.pastEducation}>
                                                <Nav tabs>
                                                    {["1", "2", "3"].map((ele) => (
                                                        <NavItem>
                                                            <NavLink
                                                                key={"education" + ele}
                                                                onClick={() => {
                                                                    educationToggle("education" + ele);
                                                                }}
                                                                className={classnames({
                                                                    active: educationActiveTab === "education" + ele,
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
                                                            <div className={styles.formTabContent}>
                                                                {header.content.map((item: any) => (
                                                                    <InputComponent
                                                                        className="individualField"
                                                                        label={item.label}
                                                                        name={`education[${index}].${item.name}`}
                                                                        defaultValue={ele[item.name] || ""}
                                                                        register={register}
                                                                        type={item.type}
                                                                        rules={{
                                                                            required:
                                                                                item.name === "id"
                                                                                    ? item.required
                                                                                    : index + 1 === 1
                                                                                    ? true
                                                                                    : false,
                                                                        }}
                                                                        readOnly={item.readOnly}
                                                                        errors={errors}
                                                                        trigger={trigger}
                                                                        isFieldArray={{
                                                                            status: true,
                                                                            type: "education",
                                                                            index: index,
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </TabPane>
                                                    ))}
                                                </TabContent>
                                            </div>
                                        </div>
                                    ) : header.id === 6 ? (
                                        <div className={`${styles.formContent}`}>
                                            <div className={styles.parent}>
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
                                                        <TabPane key={"parent" + index} tabId={"parent" + (index + 1)}>
                                                            <div className={styles.formTabContent}>
                                                                {header.content.map((item: any) => {
                                                                    return (
                                                                        <InputComponent
                                                                            className="individualField"
                                                                            label={item.label}
                                                                            name={`parent[${index}].${item.name}`}
                                                                            defaultValue={ele[item.name] || ""}
                                                                            register={register}
                                                                            type={item.type}
                                                                            options={item.options ? item.options : ""}
                                                                            rules={{
                                                                                required:
                                                                                    item.name === "id"
                                                                                        ? item.required
                                                                                        : index + 1 === 1
                                                                                        ? true
                                                                                        : false,
                                                                                pattern: item.pattern
                                                                                    ? item.pattern
                                                                                    : "",
                                                                                minLength: item.minLength
                                                                                    ? item.minLength
                                                                                    : "",
                                                                                maxLength: item.maxLength
                                                                                    ? item.maxLength
                                                                                    : "",
                                                                            }}
                                                                            readOnly={item.readOnly}
                                                                            errors={errors}
                                                                            trigger={trigger}
                                                                            replaceText={
                                                                                item.type === "tel" ||
                                                                                item.name === "chinese_name" ||
                                                                                item.name === "english_name"
                                                                                    ? replaceText
                                                                                    : () => {}
                                                                            }
                                                                            isFieldArray={{
                                                                                status: true,
                                                                                type: "parent",
                                                                                index: index,
                                                                            }}
                                                                        />
                                                                    );
                                                                })}
                                                            </div>
                                                        </TabPane>
                                                    ))}
                                                </TabContent>
                                            </div>
                                        </div>
                                    ) : header.id === 7 ? (
                                        <div className={`${styles.formContent}`}>
                                            <InputComponent
                                                className="individualField"
                                                label={header.preContent!.label}
                                                name={header.preContent!.name}
                                                type={header.preContent!.type}
                                                options={header.preContent!.options}
                                                register={register}
                                                rules={{
                                                    required: header.preContent!.required,
                                                }}
                                                errors={errors}
                                                trigger={trigger}
                                                onChangeFunction={handleHasSibling}
                                            />
                                            {hasSibling ? (
                                                <div className={styles.sibling}>
                                                    <Nav tabs>
                                                        {["1", "2"].map((ele, index) => (
                                                            <NavItem>
                                                                <NavLink
                                                                    className={classnames({
                                                                        active: siblingActiveTab === "sibling" + ele,
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
                                                                <div className={styles.formTabContent}>
                                                                    {header.content.map((item: any) => (
                                                                        <InputComponent
                                                                            className="individualField"
                                                                            label={item.label}
                                                                            name={`sibling[${index}].${item.name}`}
                                                                            defaultValue={ele[item.name] || ""}
                                                                            register={register}
                                                                            type={item.type}
                                                                            options={item.options}
                                                                            rules={{
                                                                                required:
                                                                                    item.name === "id"
                                                                                        ? item.required
                                                                                        : hasSibling
                                                                                        ? index + 1 === 1
                                                                                            ? true
                                                                                            : false
                                                                                        : false,
                                                                            }}
                                                                            readOnly={item.readOnly}
                                                                            errors={errors}
                                                                            trigger={trigger}
                                                                            isFieldArray={{
                                                                                status: true,
                                                                                type: "sibling",
                                                                                index: index,
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </TabPane>
                                                        ))}
                                                    </TabContent>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    ) : header.id === 8 ? (
                                        <>
                                            {header.content.map((item: any) =>
                                                item.type === "textarea" ? (
                                                    <>
                                                        <InputComponent
                                                            className="individualField"
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
                                                    </>
                                                ) : item.type === "file" ? (
                                                    <>
                                                        <InputComponent
                                                            className="individualField"
                                                            label={item.label}
                                                            name={item.name}
                                                            type="file"
                                                            register={register}
                                                            rules={{
                                                                required: displayImageFormDb ? false : item.required,
                                                            }}
                                                            errors={errors}
                                                            trigger={trigger}
                                                            loadImageFromDb={
                                                                // don't load image from db if this is add application page
                                                                isNaN(applicationId) ? false : true
                                                            }
                                                            displayImageFormDb={displayImageFormDb}
                                                            imageFormDbSource={imageFormDbSource}
                                                            previewImage={previewImage}
                                                            onChangeFunction={setSelectedImage}
                                                            onClickFunction={handleDeleteImage}
                                                        />
                                                    </>
                                                ) : item.type === "files" ? (
                                                    <InputComponent
                                                        className="individualField"
                                                        label={item.label}
                                                        name={item.name}
                                                        type={item.type}
                                                        register={register}
                                                        rules={{
                                                            required: item.required,
                                                            validate: isWithinUploadAmount,
                                                        }}
                                                        errors={errors}
                                                        trigger={trigger}
                                                        loadImageFromDb={
                                                            // false if this is add application page
                                                            isNaN(applicationId) || !displayDepositImageFormDb
                                                                ? false
                                                                : true
                                                        }
                                                        depositImageFormDbSource={depositImageFormDbSource}
                                                        previewSlips={previewSlips}
                                                        selectedSlips={selectedSlips}
                                                        onChangeFunction={setSelectedSlips}
                                                        onClickFunction={handleDeleteSlips}
                                                    />
                                                ) : (
                                                    ""
                                                )
                                            )}
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            ))}

                            {
                                // show 提交 only if this is add application page
                                <div className={styles.controlBtns}>
                                    {isAddApplicationLoading ? (
                                        <button className={styles.submit} disabled>
                                            處理中
                                        </button>
                                    ) : isFormEdited ? (
                                        <button className={styles.submit} type="submit">
                                            {isNaN(applicationId) ? "提交" : "修改"}
                                        </button>
                                    ) : (
                                        <button
                                            className={`${styles.submit} ${styles.disabled}`}
                                            type="submit"
                                            disabled
                                        >
                                            {isNaN(applicationId) ? "提交" : "修改"}
                                        </button>
                                    )}
                                </div>
                            }
                        </TabPane>
                        <TabPane tabId="main2">
                            {formInternalRemark.map((header: any) => (
                                <div className={`${styles.container} ${styles.formDetail}`}>
                                    <div className={styles.formContentTop}>
                                        <b>{header.header}</b>
                                        <hr />
                                    </div>
                                    <div className={`${styles.formContent}`}>
                                        {header.content.map((item: any) =>
                                            item.name === "interviewer" ? (
                                                <InputComponent
                                                    className="individualField"
                                                    label={item.label}
                                                    name={item.name}
                                                    register={register}
                                                    type="AsyncSelect"
                                                    rules={{
                                                        required: item.required,
                                                    }}
                                                    readOnly={role === "teacher" ? true : false}
                                                    errors={errors}
                                                    trigger={trigger}
                                                    control={control}
                                                    reactSelectValue={selectedTeacherValue}
                                                    loadOptions={loadTeacherOptions}
                                                    onChange={handleSelectTeacherChange}
                                                />
                                            ) : (
                                                <InputComponent
                                                    className="individualField"
                                                    label={item.label}
                                                    name={item.name}
                                                    register={register}
                                                    type={item.type}
                                                    options={item.options}
                                                    rules={{
                                                        required: item.required,
                                                    }}
                                                    errors={errors}
                                                    trigger={trigger}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </TabPane>

                        <TabPane tabId="main3">
                            <div className={styles.systemInfoContainer}>
                                <p>
                                    <strong>創建時間： </strong>
                                    {moment(record.created_at).format("YYYY/MM/DD hh:mm:ss")}
                                </p>
                                <p>
                                    <strong>最後修改時間: </strong>

                                    {moment(record.updated_at).format("YYYY/MM/DD hh:mm:ss")}
                                </p>
                                <p>
                                    <strong>最後修改帳戶類別： </strong>
                                    {record.updated_user_role}
                                </p>
                                <p>
                                    <strong>最後修改帳戶： </strong>
                                    {record.updated_user}
                                </p>
                            </div>
                        </TabPane>
                    </TabContent>
                </form>
            </section>
        </main>
    );
}
