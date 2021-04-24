import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../assets/scss/application/myTable.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { Pagination } from "./Pagination";
import { levelMap, applicationStatusMap } from "../../util/Mapping";
import { push } from "connected-react-router";
import { fetchRecord, searchApplication } from "../redux/application/thunkAction";
import moment from "moment";
import { setSelectedApp } from "../redux/application/action";
import LoadingComponent from "../general/Loading";

export interface recordType {
    id: number;
    idWithPrefix: number;
    chinese_name: string;
    english_name: string;
    first_round_score: number;
    second_round_score: number;
    created_at: any;
    application_status: string;
    level: string;
}

export function MyTable() {
    const dispatch = useDispatch();
    //Get application record and current page
    const { record, currentPage, searchQuery, isLoading } = useSelector(
        (state: RootState) => state.application.payload.record
    );
    //Set the pagination page to be application
    const [paginationIsTrue, setIsTrue] = useState(false);
    //Get/Set checked applications
    const selected = useSelector((state: RootState) => state.application.payload.record.selected);

    //Get user role
    const { role, userId } = useSelector((state: RootState) => state.auth.payload.login);

    //Fetch record when page changed
    useEffect(() => {
        if (searchQuery) {
            //fetch searched application record
            dispatch(searchApplication(searchQuery));
        } else if (role !== "admin" && userId) {
            //fetch application record for the logged in teacher
            dispatch(fetchRecord(userId));
        } else {
            //fetch application record
            dispatch(fetchRecord());
        }

        //Set pagination page
        setIsTrue(true);

        //Free up pagination page when user leave this page
        return function cleanup() {
            setIsTrue(false);
        };
    }, [currentPage, dispatch, role, searchQuery, userId]);

    // Go to application detail page
    function toApplicationDetail(applicationId: number) {
        dispatch(push(`/application/${applicationId}`));
    }

    // Loading effect
    if (isLoading) {
        return <LoadingComponent />;
    }

    //When checkbox for select all is clicked
    function handleClickAll(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
        if (e.currentTarget.checked) {
            const selectedArr = record.map((rec) => rec.id);
            dispatch(setSelectedApp(selectedArr));
        } else {
            dispatch(setSelectedApp([]));
        }
    }

    //When checkbox is checked
    function handleChecked(e: React.ChangeEvent<HTMLInputElement>, recordId: number) {
        //When the checkbox is checked, add this record id to the selected array
        if (e.currentTarget.checked) {
            dispatch(setSelectedApp(recordId));
        } else {
            const selectedArr = selected.filter((s) => s !== recordId);
            dispatch(setSelectedApp(selectedArr));
        }
    }

    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th style={{ width: "30px" }} className="checkBoxColumn" data-type="select_all">
                            <input type="checkbox" onClick={(e) => handleClickAll(e)} />
                        </th>
                        <th>申請編號</th>
                        <th>姓名</th>
                        <th>第一輪面試分數</th>
                        <th>第二輪面試分數</th>
                        <th>申請日期</th>
                        <th>申請狀態</th>
                    </tr>
                </thead>
                <tbody>
                    {record.length < 1 && (
                        <tr>
                            <td colSpan={7} className={styles.no_record}>
                                <h5 style={{ textAlign: "center" }}>沒有申請記錄</h5>
                            </td>
                        </tr>
                    )}
                    {record.map((record: recordType) => {
                        return (
                            <tr>
                                <td className="checkBoxColumn">
                                    {/* Check if the checkbox has already been selected */}
                                    <input
                                        type="checkbox"
                                        checked={selected.indexOf(record.id) > -1}
                                        onChange={(e) => handleChecked(e, record.id)}
                                    />
                                </td>
                                <td data-label="申請編號">{record.idWithPrefix}</td>
                                <td
                                    onClick={() => {
                                        toApplicationDetail(record.id);
                                    }}
                                    className={styles.application_detail}
                                    data-label="姓名"
                                >
                                    {record.chinese_name}
                                    {record.english_name}
                                    <p>{levelMap.get(record.level)}</p>
                                </td>
                                <td data-label="第一輪面試分數">{record.first_round_score}</td>
                                <td data-label="第二輪面試分數">{record.second_round_score}</td>
                                <td data-label="申請日期">{moment(record.created_at).format("YYYY/MM/DD HH:mm")}</td>
                                <td data-label="申請狀態">
                                    <div
                                        className={
                                            record.application_status === "rejected"
                                                ? styles.status_box_rejected
                                                : record.application_status === "invalid"
                                                ? styles.status_box_invalid
                                                : record.application_status === "pending"
                                                ? styles.status_box_processing
                                                : record.application_status === "first_round_interview" ||
                                                  record.application_status === "second_round_interview"
                                                ? styles.status_box_interview
                                                : styles.status_box_positive
                                        }
                                    >
                                        {applicationStatusMap.get(record.application_status)}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <Pagination application={paginationIsTrue}></Pagination>
        </div>
    );
}
