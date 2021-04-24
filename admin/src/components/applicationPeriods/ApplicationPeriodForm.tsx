// import moment from "moment";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { periodItems } from "../../util/inputComponentArray";
import { periodStatusMap } from "../../util/Mapping";
import InputComponent from "../formElement/InputComponent";
import LoadingComponent from "../general/Loading";
import { addPeriod, checkHaveRecord, editPeriod, requestFailed } from "../redux/applicationPeriod/action";
import { recordType } from "../redux/applicationPeriod/reducer";
import styles from "../../assets/scss/applicationPeriods.module.scss";
import moment from "moment";

export interface periodFormType {
    btnText: string;
    type: string;
}

export interface editForm {
    id: number;
    type: string;
    application_year: number;
    round: number;
    start_date: string;
    end_date: string;
    end_deadline: string;
    start_time: string;
    end_time: string;
    end_deadline_time: string;
}

export function ApplicationPeriodForm(props: periodFormType) {
    const dispatch = useDispatch();

    //Get application period record displayed in table
    const { record, isLoading } = useSelector((state: RootState) => state.applicationPeriod.payload.record);

    //Get clicked period id
    //Get if a period has application record
    //Get update error
    //Get number of applicants
    const { id: periodId, haveRecord, error, numOfApplicant } = useSelector(
        (state: RootState) => state.applicationPeriod.payload.edit
    );

    //Get clicked period id
    const { error: addError } = useSelector((state: RootState) => state.applicationPeriod.payload.add);

    //When a period record is clicked, check if it has any application record
    //If it has, only allow it to modify end date and end deadline
    useEffect(() => {
        if (!periodId) return;
        dispatch(checkHaveRecord(periodId));
    }, [periodId, dispatch]);

    let currentRecord: recordType = record.filter((rec) => rec.id === periodId)[0];

    // Add Form
    const { register, handleSubmit, trigger, errors } = useForm();

    // Edit Form(have record)
    const {
        register: register2,
        handleSubmit: handleSubmit2,
        trigger: trigger2,
        errors: errors2,
        reset: reset2,
        // formState: haveRecordEditFormState,  //TODO: ask alex
    } = useForm({
        defaultValues: currentRecord,
        mode: "onBlur",
    });
    // const haveRecordEditIsDirty = haveRecordEditFormState.isDirty; //TODO: ask alex

    // Edit Form(no record)
    const {
        register: register3,
        handleSubmit: handleSubmit3,
        trigger: trigger3,
        errors: errors3,
        reset: reset3,
        // formState: noRecordEditFormState,  //TODO: ask alex
    } = useForm({
        defaultValues: currentRecord,
        mode: "onBlur",
    });
    // const noRecordEditIsDirty = noRecordEditFormState.isDirty;  //TODO: ask alex

    //Reset edit field when user clicked changed
    //Or when finish checking have application record
    useEffect(() => {
        if (currentRecord) {
            currentRecord = splitTimestamp(currentRecord);
        }

        if (!currentRecord) return;

        //Clear the correct form
        //have record can be inactive or active
        //Inactive form use form3
        if (haveRecord && currentRecord.is_active) {
            reset2(currentRecord, {
                errors: true, // errors will not be reset
                dirtyFields: true, // dirtyFields will not be reset
                isDirty: true, // dirty will not be reset
            });
        } else {
            reset3(currentRecord, {
                errors: true, // errors will not be reset
                dirtyFields: true, // dirtyFields will not be reset
                isDirty: true, // dirty will not be reset
            });
        }
    }, [currentRecord, haveRecord]);

    function onAddSubmit(data: editForm) {
        data = combineToTimestamp(data);

        //Check if start date is earlier than today
        if (new Date(data.start_date) < new Date()) {
            alert("開始日期不能早於今天");
            return;
        }

        //Check if end date is earlier than start date
        if (new Date(data.end_date) < new Date(data.start_date)) {
            alert("結束日期不能早於開始日期");
            return;
        }

        //Check if end deadline is after start date
        if (new Date(data.end_deadline) < new Date(data.start_date)) {
            alert("家長修改期限不能早於開始日期");
            return;
        }

        //Check if end deadline is after end date
        if (new Date(data.end_deadline) < new Date(data.end_date)) {
            alert("家長修改期限不能早於結束日期");
            return;
        }

        dispatch(addPeriod(data));
    }

    function onEditSubmit(data: editForm) {
        data = combineToTimestamp(data);

        const { end_date, end_deadline, round, application_year, start_date } = data;

        //Check if start date is earlier than today
        if (new Date(end_date) < new Date()) {
            alert("結束日期不能早於今天");
            return;
        }

        //Check if end date is earlier than start date
        if (new Date(end_date) < new Date(data.start_date)) {
            alert("結束日期不能早於開始日期");
            return;
        }

        //Check if end deadline is after start date
        if (new Date(end_deadline) < new Date(data.start_date)) {
            alert("家長修改期限不能早於開始日期");
            return;
        }

        //Check if end deadline is after end date
        if (new Date(end_deadline) < new Date(end_date)) {
            alert("家長修改期限不能早於結束日期");
            return;
        }

        let reqData;

        if (!haveRecord) {
            if (data.type !== currentRecord.type) {
                alert("無法修改申請類別");
                return;
            }

            const { updated_at, ...record } = currentRecord;

            //Send all the fields
            reqData = {
                ...record,
                round: round,
                application_year: application_year,
                end_deadline: end_deadline,
                end_date: end_date,
                start_date: start_date,
            };
        } else {
            //Send only editable fields
            reqData = {
                end_deadline: end_deadline,
                end_date: end_date,
                id: currentRecord.id,
            };
        }

        dispatch(editPeriod(reqData));
    }

    //Show error when update failed
    useEffect(() => {
        if (error) {
            alert(error);
            //Reset error
            dispatch(requestFailed("@@applicationPeriod/editFailed"));
        } else if (addError) {
            alert(addError);
            //Reset error
            dispatch(requestFailed("@@applicationPeriod/addFailed"));
        }
    }, [error, addError, dispatch]);

    ////////////Combine time and date to timestamp
    function combineToTimestamp(data: any) {
        let { start_time, end_time, end_deadline_time, ...others } = data;

        others.start_date = `${others.start_date} ${start_time}`;
        others.end_date = `${others.end_date} ${end_time}`;
        others.end_deadline = `${others.end_deadline} ${end_deadline_time}`;

        if (others.start_date) {
            return others;
        } else {
            const { start_date, ...rest } = others;
            return rest;
        }
    }

    ///////////////Split date and time from timestamp
    function splitTimestamp(timestamp: recordType) {
        let { start_date, end_date, end_deadline, ...others } = timestamp;

        const start_time = moment(start_date).format("HH:mm");
        start_date = moment(start_date).format("YYYY-MM-DD");

        const end_time = moment(end_date).format("HH:mm");
        end_date = moment(end_date).format("YYYY-MM-DD");

        const end_deadline_time = moment(end_deadline).format("HH:mm");
        end_deadline = moment(end_deadline).format("YYYY-MM-DD");

        return {
            ...others,
            start_time: start_time,
            start_date: start_date,
            end_time: end_time,
            end_date: end_date,
            end_deadline: end_deadline,
            end_deadline_time: end_deadline_time,
        };
    }

    // loading handling
    if (isLoading) {
        return <LoadingComponent />;
    }

    if (props.type === "add") {
        return (
            <form onSubmit={handleSubmit(onAddSubmit)}>
                <div className="applicationPeriods_option_container__wghfS">
                    {periodItems.map((item: any) => (
                        <InputComponent
                            label={item.label}
                            name={item.name}
                            register={register}
                            type={item.type}
                            options={item.options}
                            rules={item.required}
                            errors={errors}
                            trigger={trigger}
                        />
                    ))}
                    <div className="controlBtns">
                        <button className="applicationPeriods_add_btn__oFvuj">{props.btnText}</button>
                    </div>
                </div>
            </form>
        );
    } else if (!currentRecord.is_active) {
        return (
            <form onSubmit={handleSubmit3(onEditSubmit)}>
                <div className={`${styles.option_container} ${styles.status}`}>
                    <div className={`myInput`}>
                        <label>狀態</label>
                        <br />
                        <div className={styles.status_box_rejected}>
                            {periodStatusMap.get(currentRecord.is_active as any)}
                        </div>
                    </div>

                    <div className={`myInput`}>
                        <label>申請人數</label>
                        <br />
                        <div className="no_border custom">{numOfApplicant}</div>
                    </div>
                    <div className={`myInput`}></div>
                </div>
                <div className={styles.option_container}>
                    {periodItems.map((item: any) => (
                        <InputComponent
                            label={item.label}
                            name={item.name}
                            register={register3}
                            type={item.type}
                            options={item.options}
                            rules={item.required}
                            errors={errors3}
                            trigger={trigger3}
                            readOnly={true}
                        />
                    ))}
                </div>
                <span>提示：此申請時段已過期，無法更改時段設定</span>
            </form>
        );
    } else if (haveRecord) {
        return (
            <form onSubmit={handleSubmit2(onEditSubmit)}>
                <div className={styles.option_container}>
                    <div className={`myInput`}>
                        <label>狀態</label>
                        <br />
                        <div
                            className={
                                new Date() > new Date(currentRecord.start_date)
                                    ? styles.status_box_positive
                                    : styles.status_box_processing
                            }
                        >
                            {/* {currentRecord.is_active &&
                                new Date() > new Date(currentRecord.start_date) &&
                                periodStatusMap.get(currentRecord.is_active as any)}
                            {currentRecord.is_active && new Date() < new Date(currentRecord.start_date) && "未開放"}
                            {!currentRecord.is_active && periodStatusMap.get(currentRecord.is_active as any)} */}
                            {new Date() > new Date(currentRecord.start_date)
                                ? periodStatusMap.get(currentRecord.is_active as any)
                                : "未開放"}
                        </div>
                    </div>
                    <div className={`myInput`}>
                        <label>申請人數</label>
                        <br />
                        <div className="no_border custom">{numOfApplicant}</div>
                    </div>
                    <div className={`myInput`}></div>
                </div>
                <div className="applicationPeriods_option_container__wghfS">
                    {periodItems.slice(0, -4).map((item: any) => (
                        <InputComponent
                            label={item.label}
                            name={item.name}
                            register={register2}
                            type={item.type}
                            options={item.options}
                            rules={item.required}
                            errors={errors2}
                            trigger={trigger2}
                            readOnly={true}
                            className="no_border"
                        />
                    ))}

                    {periodItems.slice(-4).map((item: any) => (
                        <InputComponent
                            label={item.label}
                            name={item.name}
                            register={register2}
                            type={item.type}
                            options={item.options}
                            rules={item.required}
                            errors={errors2}
                            trigger={trigger2}
                        />
                    ))}

                    <div className="controlBtns">
                        <button className={`${styles.add_btn} `}>{props.btnText}</button>
                    </div>
                </div>
                <span>提示：此申請時段已有報名，無法更改某部份時段設定</span>
            </form>
        );
    } else {
        return (
            <form onSubmit={handleSubmit3(onEditSubmit)}>
                <div className={styles.option_container}>
                    <div className={`myInput`}>
                        <label>狀態</label>
                        <br />
                        <div
                            className={
                                new Date() > new Date(currentRecord.start_date)
                                    ? styles.status_box_positive
                                    : styles.status_box_processing
                            }
                        >
                            {new Date() > new Date(currentRecord.start_date)
                                ? periodStatusMap.get(currentRecord.is_active as any)
                                : "未開放"}
                        </div>
                    </div>
                    <div className={`myInput`}>
                        <label>申請人數</label>
                        <br />
                        <div className="no_border custom">{numOfApplicant}</div>
                    </div>
                    <div className={`myInput`}></div>
                </div>
                <div className="applicationPeriods_option_container__wghfS">
                    {periodItems.map((item: any) => (
                        <InputComponent
                            label={item.label}
                            name={item.name}
                            register={register3}
                            type={item.type}
                            options={item.options}
                            rules={item.required}
                            errors={errors3}
                            trigger={trigger3}
                        />
                    ))}
                    <div className="controlBtns">
                        <button className={`${styles.add_btn} `}>{props.btnText}</button>
                    </div>
                </div>
            </form>
        );
    }
}
