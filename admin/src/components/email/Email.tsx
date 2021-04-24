import moment from "moment";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../assets/scss/email.module.scss";
import { RootState } from "../../store";
import { applicationType, emailCategoryMap, emailMap, emailStatusMap } from "../../util/Mapping";
import { SearchBar } from "../application/SearchBar";
import InputComponent from "../formElement/InputComponent";
import Header from "../Header";
import { fetchFailed, fetchRecord, setRecordLimit, setShowEdit } from "../redux/email/action";
import { EmailTable } from "./EmailTable";

export function Email() {
    const dispatch = useDispatch();

    //Show edit / searchBar container or not
    const { isDivShow } = useSelector((state: RootState) => state.email.payload.edit);

    //Get the id of the clicked record
    const { id } = useSelector((state: RootState) => state.email.payload.edit);

    //Get the records
    const { record, recordCount, error, currentPage, limit } = useSelector(
        (state: RootState) => state.email.payload.record
    );

    //Get the record clicked
    let currentRecord = record.filter((rec) => rec.application_id === id)[0];

    //handle change on items displayed per page
    function handlePageItems(e: React.ChangeEvent<HTMLSelectElement>) {
        const limit = parseInt(e.target.value);
        const offset = limit * (currentPage - 1);

        //Change limit in redux store
        dispatch(setRecordLimit(limit));
        dispatch(fetchRecord(limit, offset));
    }

    //Show error
    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(fetchFailed());
            return;
        }
    }, [error, dispatch]);

    const { register, trigger, errors, reset } = useForm({
        defaultValues: currentRecord,
    });

    //Reset form when a new email record is clicked
    useEffect(() => {
        if (currentRecord) {
            let { application_type, category, submitted_at } = currentRecord;

            //Format application type, category and submitted at
            application_type = applicationType.get(application_type);
            category = emailCategoryMap.get(category);
            submitted_at = moment(submitted_at).format("YYYY/MM/DD hh:mm:ss");

            //restructure current record
            currentRecord = {
                ...currentRecord,
                application_type: application_type,
                category: category,
                submitted_at: submitted_at,
            };

            //reset the form
            reset(currentRecord, {
                errors: true, // errors will not be reset
                dirtyFields: true, // dirtyFields will not be reset
                isDirty: true, // dirty will not be reset
            });
        }
    }, [currentRecord, reset]);

    return (
        <div className="outer_container">
            <Header title="電郵發送記錄" />

            <main>
                <SearchBar />

                {isDivShow && (
                    <section className={styles.edit_container}>
                        <div>
                            <div className={styles.emailDetailTitle}>
                                <h5>電郵發送記錄</h5>
                                <a
                                    href={`/application/${currentRecord.application_id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    查看申請
                                </a>
                            </div>
                            <button
                                className={styles.cancel_btn}
                                onClick={() => {
                                    dispatch(setShowEdit(null, false));
                                }}
                            >
                                <i className="fa fa-times"></i>
                            </button>
                        </div>

                        <div className={styles.option_container}>
                            <div className={`${styles.email_status_container} myInput`}>
                                <label>發送狀態</label>
                                <br />
                                <div
                                    className={
                                        currentRecord.email_status === "failed"
                                            ? styles.status_box_rejected
                                            : styles.status_box_positive
                                    }
                                >
                                    {emailStatusMap.get(currentRecord.email_status)}
                                </div>
                            </div>

                            <form>
                                {Array.from(emailMap)
                                    .slice(1)
                                    .map((item: any) => (
                                        <InputComponent
                                            label={item[0]}
                                            name={item[1]}
                                            register={register}
                                            type={
                                                item[1] === "fail_type"
                                                    ? "textarea"
                                                    : item[1] === "fail_message"
                                                    ? "textarea"
                                                    : "text"
                                            }
                                            rules={{ required: false }}
                                            readOnly={true}
                                            errors={errors}
                                            trigger={trigger}
                                            className="no_border"
                                        />
                                    ))}
                            </form>
                        </div>
                    </section>
                )}

                <section className={styles.bottom_container}>
                    <div className="pageAmount">
                        共有記錄: {recordCount}
                        {recordCount! > 0
                            ? ` (現正顯示${limit * (currentPage - 1) + 1}-
                                ${limit * currentPage > recordCount! ? recordCount : limit * currentPage}個)`
                            : ""}
                    </div>
                    <div className={styles.option_container}>
                        <div className={styles.bottom_select}>
                            <label htmlFor="page_items">每頁顯示數目</label>
                            <select name="page_items" id="page_items" onChange={(e) => handlePageItems(e)}>
                                <option value="50" selected>
                                    50
                                </option>
                                <option value="100">100</option>
                                <option value={recordCount + ""}>所有</option>
                            </select>
                        </div>
                    </div>
                    <EmailTable></EmailTable>
                </section>
            </main>
        </div>
    );
}
