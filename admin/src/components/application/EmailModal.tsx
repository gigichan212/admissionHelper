import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { batchUpdate } from "../redux/application/thunkAction";
// css
import styles from "../../assets/scss/application/modal.module.scss";
// react hook form
import { useForm } from "react-hook-form";
// Component
import InputComponent from "../formElement/InputComponent";
import { applicationStatusMap } from "../../util/Mapping";
import { FAILED, resetError, setIsShow } from "../redux/application/action";
import LoadingComponent from "../general/Loading";

export interface modalType {
    handleClose: Dispatch<SetStateAction<boolean>>;
    myToken: string;
}

export interface form {
    application_status: string;
    application_period: {
        value: number;
        label: string;
    };
}

export function EmailModal(props: modalType) {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state: RootState) => state.application.payload.record);
    //For alerting error message when send email failed
    const { isError, ErrorType } = useSelector((state: RootState) => state.application.payload.record.error);

    useEffect(() => {
        if (isError && ErrorType) {
            alert("發送電郵失敗");
            dispatch(resetError(ErrorType as FAILED));
            return;
        }
    }, [isError]);

    /********************************************************************/
    // fetch application period
    // const [inputPeriodValue, setInputPeriodValue] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState<{ value: number; label: string }>();

    // handle selection
    const handleSelectPeriodChange = (value: any) => {
        setSelectedValue(value);
    };

    // load options from db
    const loadPeriodOptions = (inputValue: any) => {
        return fetch(
            `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/application-period`,
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

                return options.filter((option) => option.label.includes(inputValue));
            });
    };

    /********************************************************************/
    // Set form registration
    const { register, handleSubmit, errors, trigger, control } = useForm<form>({
        defaultValues: {},
        mode: "onBlur",
    });

    //Set option for application status
    const statusOptionArr = Array.from(applicationStatusMap).slice(1, 4);
    statusOptionArr.unshift(["", "請選擇申請狀態"]);

    //Handle send email submit
    function onSubmit(data: any) {
        let { application_period, application_status } = data;

        //Check if both fields are filled in
        if (application_period === "" || application_status === "") {
            alert("請輸入收生時段/申請狀態");
            return;
        }

        // get no. of selected applicants and show it to users
        return fetch(
            `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/application/batchEmailList/periodId/${application_period.value}/:status/${application_status}`,
            {
                headers: { Authorization: "Bearer " + props.myToken },
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.isSuccess && result.count > 0) {
                    //Ask user if they confirm the action
                    const confirm = window.confirm(
                        `確認發送電郵至所有 ${applicationStatusMap.get(application_status)} (共有${
                            result.count
                        }個) 的申請？ `
                    );

                    //Fetch to backend to send email
                    if (confirm) {
                        dispatch(
                            batchUpdate({
                                application_period_id: application_period.value,
                                application_status: application_status,
                            })
                        );
                    }
                } else if (result.isSuccess && result.count === 0) {
                    alert("所選的條件內沒有申請");
                } else {
                    alert("發生錯誤，請重試。");
                }
            });
    }

    if (isLoading) {
        return <LoadingComponent height="full" />;
    }

    return (
        <>
            <div className={styles.modal}>
                <div className={styles.modalContent}>
                    <section className={styles.header}>
                        <div>
                            <h5>發送電郵</h5>
                            <button
                                className={styles.cancel_btn}
                                onClick={() => {
                                    dispatch(setIsShow("email", false));
                                }}
                            >
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                    </section>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.input_container}>
                            <InputComponent
                                label="收生時段"
                                name="application_period"
                                register={register}
                                type="AsyncSelect"
                                rules={{
                                    required: true,
                                }}
                                errors={errors}
                                trigger={trigger}
                                control={control}
                                reactSelectValue={selectedValue}
                                loadOptions={loadPeriodOptions}
                                // onInputChange={handlePeriodInputChange}
                                onChange={handleSelectPeriodChange}
                            />
                            <InputComponent
                                label="申請狀態"
                                name="application_status"
                                register={register}
                                type="select"
                                options={statusOptionArr}
                                rules={{
                                    required: true,
                                }}
                                errors={errors}
                                trigger={trigger}
                            />

                            <button type="submit">發送</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
