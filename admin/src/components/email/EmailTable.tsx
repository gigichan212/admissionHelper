import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../assets/scss/application/myTable.module.scss";
import { fetchRecord, setShowEdit } from "../redux/email/action";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { Pagination } from "../application/Pagination";
import { emailCategoryMap, emailMap, emailStatusMap } from "../../util/Mapping";
import moment from "moment";
import LoadingComponent from "../general/Loading";

export interface recordType {
    category: string;
    application_id: number;
    email_status: string;
    message_id: number;
    email: string;
    idWithPrefix: number;
    chinese_name: string;
    english_name: string;
    application_type: string;
    application_year: number;
    round: string;
    submitted_at: any;
}

export function EmailTable() {
    const dispatch = useDispatch();
    const { record, currentPage, isLoading, limit } = useSelector((state: RootState) => state.email.payload.record);
    const [paginationIsTrue, setPagIsTrue] = useState(false);

    useEffect(() => {
        //Calculate limit and offset
        const offset = limit * (currentPage - 1);

        dispatch(fetchRecord(limit, offset));

        setPagIsTrue(true);

        return function cleanup() {
            setPagIsTrue(false);
        };
    }, [currentPage, dispatch]);
    // Loading effect
    if (isLoading) {
        return <LoadingComponent />;
    }
    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        {Array.from(emailMap)
                            .slice(0, 5)
                            .concat(Array.from(emailMap).splice(-3, 1))
                            .map((data) => (
                                <th>{data[0]}</th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {record.length < 1 && (
                        <tr className={styles.no_record}>
                            <td colSpan={8}>
                                <h5 style={{ textAlign: "center" }}>沒有電郵發送記錄</h5>
                            </td>
                        </tr>
                    )}
                    {record.map((record: recordType) => {
                        return (
                            <tr
                                onClick={() => {
                                    dispatch(setShowEdit(record.application_id, true));
                                }}
                            >
                                <td data-label="發送狀態">
                                    <div
                                        className={
                                            record.email_status === "failed"
                                                ? styles.status_box_rejected
                                                : styles.status_box_positive
                                        }
                                    >
                                        {emailStatusMap.get(record.email_status)}
                                    </div>
                                </td>
                                <td data-label="類別">{emailCategoryMap.get(record.category)} </td>
                                <td data-label="電郵編號">{record.message_id}</td>
                                <td data-label="電郵">{record.email}</td>
                                <td data-label="申請編號">
                                    {record.idWithPrefix}
                                    <p>
                                        {record.chinese_name} {record.english_name}
                                    </p>
                                </td>
                                <td data-label="發送時間">
                                    {moment(record.submitted_at).format("YYYY/MM/DD hh:mm:ss")}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <Pagination email={paginationIsTrue}></Pagination>
        </div>
    );
}
