import React, { useState } from "react";
// react hook form
import { useForm } from "react-hook-form";
// redux
import { useDispatch, useSelector } from "react-redux";
import useRouter from "use-react-router";
// css
import styles from "../../assets/scss/application/searchBar.module.scss";
// component
import { RootState } from "../../store";
import { advanceSearchMap, applicationStatusMap, levelMap } from "../../util/Mapping";
import InputComponent from "../formElement/InputComponent";
import { searchApplication } from "../redux/application/thunkAction";
import { searchEmail } from "../redux/email/action";

export interface form {
    application_period?: string;
    application_status?: string;
    application_year?: string;
    application_number?: string;
    chinese_name?: string;
    english_name?: string;
    birth_cert_num?: string;
    email?: string;
    parent_chinese_name?: string;
    parent_english_name?: string;
}

export function SearchBar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useDispatch();
    // router handling
    const router = useRouter();
    const { token, role, userId } = useSelector((state: RootState) => state.auth.payload.login);
    /********************************************************************/
    // fetch application period
    // const [inputPeriodValue, setInputPeriodValue] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState<{ value: number; label: string }>();
    // handle input change event
    // const handlePeriodInputChange = (value: any) => {
    //     setInputPeriodValue(value);
    // };
    // handle selection
    const handleSelectPeriodChange = (value: any) => {
        setSelectedValue(value);
    };

    // load options from db
    const loadPeriodOptions = (inputValue: any) => {
        return fetch(
            `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/teacher/application-period`,
            {
                headers: { Authorization: "Bearer " + token },
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
                options.unshift({ value: "", label: "請選擇收生時段" });

                return options.filter((option) => option.label.includes(inputValue));
            });
    };

    /********************************************************************/
    // Set form registration
    const { register, handleSubmit, errors, trigger, setValue, control } = useForm<any>({
        defaultValues: {},
        mode: "onBlur",
    });

    //Set option for application status
    const statusOptionArr = Array.from(applicationStatusMap);
    statusOptionArr.unshift(["", "請選擇申請狀態"]);
    const applicationYearArr = Array.from(levelMap);
    applicationYearArr.unshift(["", "請選擇申請年級"]);

    const { limit, currentPage } = useSelector((state: RootState) => state.email.payload.record);
    const offset = limit * (currentPage - 1);

    //Handle form submit
    function onSubmit(data: any) {
        const { application_period, ...others } = data;

        //Pick out unused fields
        for (let item in others) {
            if (others[item] === "") {
                delete others[item];
            }
        }

        //send request
        //If application period is searched, send the value of it
        //Else, send all others
        if (application_period.value === "") {
            if (router.location.pathname === "/application") {
                //Fetch application assigned to a specific teacher
                role !== "admin"
                    ? dispatch(searchApplication({ ...others, interviewer_id: userId }))
                    : dispatch(searchApplication(others));
            } else if (router.location.pathname === "/email") {
                dispatch(searchEmail(limit, offset, others));
            }
        } else {
            if (router.location.pathname === "/application") {
                role !== "admin"
                    ? dispatch(
                          searchApplication({
                              application_period_id: application_period.value,
                              ...others,
                              interviewer_id: userId,
                          })
                      )
                    : dispatch(searchApplication({ application_period_id: application_period.value, ...others }));
            } else if (router.location.pathname === "/email") {
                dispatch(searchEmail(limit, offset, { application_period_id: application_period.value, ...others }));
            }
        }
    }

    return (
        <section className={styles.top_container}>
            <h5>搜尋</h5>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.option_container}>
                    <InputComponent
                        className="searchBar"
                        label="收生時段"
                        name="application_period"
                        register={register}
                        type="AsyncSelect"
                        rules={{
                            required: false,
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
                        className="searchBar"
                        label="申請狀態"
                        name="application_status"
                        register={register}
                        type="select"
                        options={statusOptionArr}
                        rules={{
                            required: false,
                        }}
                        errors={errors}
                        trigger={trigger}
                    />
                    <div className={styles.btn_container}>
                        <div
                            className={styles.drop_down_btn}
                            onClick={() => {
                                setIsExpanded((prev: any) => !prev);
                            }}
                        >
                            {isExpanded ? <i className="fa fa-chevron-up"></i> : <i className="fa fa-chevron-down"></i>}
                        </div>
                        <button className={styles.search_btn} type="submit">
                            搜尋
                        </button>
                    </div>
                </div>
                <button type="reset" className={styles.resetBtn} onClick={() => setValue("application_period", "")}>
                    <i className="fa fa-trash"></i>
                    <span>清除搜尋條件</span>
                </button>
                {isExpanded && (
                    <div className={styles.advanceSearch}>
                        <h5>進階搜尋</h5>
                        <div className={styles.innerContainer}>
                            <div className={styles.input_container}>
                                <InputComponent
                                    className="advancedSearch"
                                    label="申請年級"
                                    name="level"
                                    register={register}
                                    type="select"
                                    options={applicationYearArr}
                                    rules={{
                                        required: false,
                                    }}
                                    errors={errors}
                                    trigger={trigger}
                                />

                                {Array.from(advanceSearchMap).map((item) => (
                                    <InputComponent
                                        className="advancedSearch"
                                        label={item[0]}
                                        name={item[1]}
                                        register={register}
                                        type="text"
                                        rules={{
                                            required: false,
                                        }}
                                        errors={errors}
                                        trigger={trigger}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </section>
    );
}
