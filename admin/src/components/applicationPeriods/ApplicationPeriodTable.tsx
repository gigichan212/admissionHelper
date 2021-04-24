import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "reactstrap";
import { RootState } from "../../store";
import { periodsTableMap } from "../../util/Mapping";
import { loadApplicationPeriod, setShowEdit } from "../redux/applicationPeriod/action";
import { Pagination } from "../application/Pagination";
import styles from "../../assets/scss/applicationPeriods.module.scss";
import moment from "moment";

export interface periodRecordType {
    is_active: boolean;
    application_type: string;
    application_year: number;
    round: number;
    // date
    start_date: any;
    end_date: any;
    end_deadline: any;
    // timestamp
    updated_at: any;
}

export function ApplicationPeriodTable() {
    const dispatch = useDispatch();
    //Get records and the page(for pagination)
    const { record, currentPage, limit } = useSelector((state: RootState) => state.applicationPeriod.payload.record);

    const [paginationIsTrue, setIsTrue] = useState(false);

    useEffect(() => {
        //Calculate offset
        const offset = limit * (currentPage - 1);

        //Get record data
        dispatch(loadApplicationPeriod(limit, offset));

        //Use the correct pagination for application period
        setIsTrue(true);

        //clean up pagination when we leave the page
        return function cleanup() {
            setIsTrue(false);
        };
    }, [currentPage, dispatch]);

    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        {Array.from(periodsTableMap).map((data) => (
                            <th>{data[0]}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {record.length < 1 && (
                        <tr className={styles.no_record}>
                            <td colSpan={7}>
                                <h5 style={{ textAlign: "center" }}>沒有申請時段</h5>
                            </td>
                        </tr>
                    )}
                    {record.map((record: any) => {
                        return (
                            <tr
                                onClick={() => {
                                    console.log("clicked");

                                    dispatch(setShowEdit(record.id, true));
                                }}
                                className={styles.rowHover}
                            >
                                {/* about application period status */}
                                {Array.from(periodsTableMap)
                                    .slice(0, 1)
                                    .map((data) =>
                                        record[data[1]] === true && new Date() > new Date(record.start_date) ? (
                                            <td data-label={data[0]}>
                                                <div className={styles.status_box_positive}>已開放</div>
                                            </td>
                                        ) : record[data[1]] === true && new Date() < new Date(record.start_date) ? (
                                            <td data-label={data[0]}>
                                                <div className={styles.status_box_processing}>未開放</div>
                                            </td>
                                        ) : (
                                            <td data-label={data[0]}>
                                                <div className={styles.status_box_rejected}>已過期</div>
                                            </td>
                                        )
                                    )}
                                {Array.from(periodsTableMap)
                                    .slice(1, 4)
                                    .map((data) =>
                                        record[data[1]] === "normal" ? (
                                            <td data-label={data[0]}>新生</td>
                                        ) : record[data[1]] === "interim" ? (
                                            <td data-label={data[0]}>插班生</td>
                                        ) : (
                                            <td data-label={data[0]}>{record[data[1]]}</td>
                                        )
                                    )}
                                {Array.from(periodsTableMap)
                                    .slice(4)
                                    .map((data) => (
                                        <td data-label={data[0]}>
                                            {moment(record[data[1]]).format("YYYY/MM/DD HH:mm")}
                                        </td>
                                    ))}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <Pagination applicationPeriod={paginationIsTrue}></Pagination>
        </div>
    );
}
