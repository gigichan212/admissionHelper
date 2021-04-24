import React, { Dispatch, SetStateAction, useState } from "react";
// css
import styles from "../../assets/scss/application/modal.module.scss";
// react hook form
import { useForm } from "react-hook-form";
// Component
import InputComponent from "../formElement/InputComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { batchUpdate } from "../redux/application/thunkAction";

export interface modalType {
    handleClose: Dispatch<SetStateAction<boolean>>;
    myToken: string;
}

export interface form {
    startDate: string;
    startTime: string;
    teacherName: {
        value: number;
        label: string;
    };
}

export function Modal(props: modalType) {
    const dispatch = useDispatch();

    /********************************************************************/
    // fetch teacher options
    //const [inputTeacherValue, setInputTeacherValue] = useState<string>("");
    const [selectedTeacherValue, setSelectedTeacherValue] = useState<{ value: number; label: string }>();
    // handle input change event
    // const handleTeacherInputChange = (value: any) => {
    //     setInputTeacherValue(value);
    // };
    // handle selection
    const handleSelectTeacherChange = (value: any) => {
        setSelectedTeacherValue(value);
    };

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
                    return options.filter((option) => option.label.includes(inputValue));
                }
            })
            .catch((err) => {
                return "Oh! Error occurs!";
            });
    };

    /********************************************************************/
    // Set form registration
    const { register, handleSubmit, errors, trigger, control, reset } = useForm<any>({
        defaultValues: {},
        mode: "onBlur",
    });

    //Get selected applications
    const selected = useSelector((state: RootState) => state.application.payload.record.selected);

    //Handle assign interviewer and interview time
    function onSubmit(data: form) {
        let { startDate, startTime } = data;

        //Check if any application is selected
        const numOfSelected = selected.length;
        if (numOfSelected < 1) {
            alert("請先選擇申請");
            return;
        }

        //start date can't be today
        startDate = `${startDate} ${startTime}`;
        if (new Date() >= new Date(startDate)) {
            alert("面試日期不能早於今天");
            return;
        }

        //Ask user if they confirm the action
        const confirm = window.confirm(
            `確認更改   ${numOfSelected}人   的面試老師為： ${data.teacherName.label} 及面試時間： ${startDate}？`
        );

        if (confirm) {
            dispatch(
                batchUpdate({
                    selected: selected,
                    interviewer_id: data.teacherName.value,
                    interview_date_time: startDate,
                })
            );
        } else {
            reset({});
        }
    }

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <section className={styles.header}>
                    <div>
                        <h5>分配面試老師及時間</h5>
                        <p>提示： 面試日期不能早於今天</p>
                    </div>
                    <button
                        onClick={() => {
                            props.handleClose(false);
                        }}
                    >
                        <i className="fa fa-times"></i>
                    </button>
                </section>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.input_container}>
                        <InputComponent
                            label="負責老師"
                            name="teacherName"
                            register={register}
                            type="AsyncSelect"
                            rules={{
                                required: false,
                            }}
                            errors={errors}
                            trigger={trigger}
                            control={control}
                            reactSelectValue={selectedTeacherValue}
                            loadOptions={loadTeacherOptions}
                            // onInputChange={handleTeacherInputChange}
                            onChange={handleSelectTeacherChange}
                        />
                        <InputComponent
                            name="startDate"
                            label="面試日期"
                            register={register}
                            type="date"
                            rules={{
                                required: true,
                            }}
                            errors={errors}
                            trigger={trigger}
                        />
                        <InputComponent
                            name="startTime"
                            label="面試時間"
                            register={register}
                            type="time"
                            rules={{
                                required: true,
                            }}
                            errors={errors}
                            trigger={trigger}
                        />
                        <button type="submit">確認</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
