import React, { useState, useEffect } from "react";
import styles from "../../assets/scss/overview.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardTitle, CardText } from "reactstrap";
import { Table } from "reactstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import moment from "moment";
import ReactPaginate from "react-paginate";
import "../../assets/scss/application/pagination.scss";

export function AdminOverview(props: any) {
    let [display, setDisplay] = useState("現有開放時間");
    let [closedPeriod, setclosedPeriod] = useState([]);
    let [amendablePeriod, setAmendablePeriod] = useState([]);
    let [openPeriod, setOpenPeriod] = useState([]);
    let [closedPeriodFetch, setclosedPeriodFetch] = useState([]);
    let [amendablePeriodFetch, setAmendablePeriodFetch] = useState([]);
    let [openPeriodFetch, setOpenPeriodFetch] = useState([]);

    const token = useSelector((state: RootState) => {
        return state.auth.payload.login.token;
    });

    function changeDisplay(changingTo: string) {
        setDisplay(changingTo);

        if (closedPeriodFetch.length > 1) {
            setclosedPeriod(() => {
                let temp: any = [];
                for (let i = 0; i < closedPeriodFetch.length; i++) {
                    temp.push(closedPeriodFetch[i]);
                }
                return temp;
            });
        }

        if (amendablePeriodFetch.length > 1) {
            setAmendablePeriod(() => {
                let temp: any = [];
                for (let i = 0; i < amendablePeriodFetch.length; i++) {
                    temp.push(amendablePeriodFetch[i]);
                }
                return temp;
            });
        }

        if (openPeriodFetch.length > 1) {
            setOpenPeriod(() => {
                let temp: any = [];
                for (let i = 0; i < openPeriodFetch.length; i++) {
                    temp.push(openPeriodFetch[i]);
                }
                return temp;
            });
        }
    }

    function handleClosedPeriodPagination(selected: { selected: number }) {
        let temp: any = [];
        for (let i = selected.selected * 10; i <= (selected.selected + 1) * 10 - 1; i++) {
            if (closedPeriodFetch[i]) {
                temp.push(closedPeriodFetch[i]);
            }
        }
        setclosedPeriod(temp);
    }

    function handleAmendablePeriodPagination(selected: { selected: number }) {
        let temp: any = [];
        for (let i = selected.selected * 10; i <= (selected.selected + 1) * 10 - 1; i++) {
            if (amendablePeriodFetch[i]) {
                temp.push(amendablePeriodFetch[i]);
            }
        }
        setAmendablePeriod(temp);
    }

    function handleOpenPeriodPagination(selected: { selected: number }) {
        let temp: any = [];
        for (let i = selected.selected * 10; i <= (selected.selected + 1) * 10 - 1; i++) {
            if (openPeriodFetch[i]) {
                temp.push(openPeriodFetch[i]);
            }
        }
        setOpenPeriod(temp);
    }

    useEffect(() => {
        async function load() {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/application-period/getClosedPeriod`,
                {
                    headers: { Authorization: "Bearer " + token },
                }
            );
            const result = await res.json();
            setclosedPeriodFetch(result.data);
            let temp: any = [];
            for (let i = 0; i < 10; i++) {
                if (result.data[i]) {
                    temp.push(result.data[i]);
                }
            }
            setclosedPeriod(temp);
        }

        load();
    }, [token]);

    useEffect(() => {
        async function load() {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/application-period/getAmendablePeriod`,
                {
                    headers: { Authorization: "Bearer " + token },
                }
            );
            const result = await res.json();
            setAmendablePeriodFetch(result.data);
            let temp: any = [];
            for (let i = 0; i < 10; i++) {
                if (result.data[i]) {
                    temp.push(result.data[i]);
                }
            }
            setAmendablePeriod(temp);
        }

        load();
    }, [token]);

    useEffect(() => {
        async function load() {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/application-period/getOpenPeriod`,
                {
                    headers: { Authorization: "Bearer " + token },
                }
            );
            const result = await res.json();
            setOpenPeriodFetch(result.data);
            let temp: any = [];
            for (let i = 0; i < 10; i++) {
                if (result.data[i]) {
                    temp.push(result.data[i]);
                }
            }
            setOpenPeriod(temp);
        }

        load();
    }, [token]);

    const applicationTypeText = (str: string) => {
        switch (str) {
            case "interim":
                return "插班生";
            case "normal":
                return "新生";
        }
    };

    const applicationRoundText = (str: string) => {
        switch (str) {
            case "1":
                return "第一輪收生";
            case "2":
                return "第二輪收生";
            case "3":
                return "第三輪收生";
            case "4":
                return "第四輪收生";
        }
    };

    const closedPeriodDisplay = closedPeriod.map((obj: any, index: number) => {
        return (
            <tr>
                <td data-label="收生類別" style={{ fontWeight: "bold" }}>
                    {applicationTypeText(obj.type)}
                </td>
                <td data-label="收生年份">{obj.application_year}</td>
                <td data-label="收生階段">{applicationRoundText(obj.round)}</td>
                <td data-label="開始日期">{moment(obj.start_date).format("YYYY/MM/DD HH:mm")}</td>
                <td data-label="結束日期">{moment(obj.end_date).format("YYYY/MM/DD HH:mm")}</td>
                <td data-label="家長修改期限">{moment(obj.end_deadline).format("YYYY/MM/DD HH:mm")}</td>
                <td data-label="最後修改時間">{moment(obj.updated_at).format("YYYY/MM/DD HH:mm")}</td>
            </tr>
        );
    });

    const AmendableDisplay = amendablePeriod.map((obj: any) => {
        return (
            <tr>
                <td data-label="收生類別" style={{ fontWeight: "bold" }}>
                    {applicationTypeText(obj.type)}
                </td>
                <td data-label="收生年份">{obj.application_year}</td>
                <td data-label="收生階段">{applicationRoundText(obj.round)}</td>
                <td data-label="開始日期">{moment(obj.start_date).format("YYYY/MM/DD HH:mm")}</td>
                <td data-label="結束日期">{moment(obj.end_date).format("YYYY/MM/DD HH:mm")}</td>
                <td data-label="家長修改期限">{moment(obj.end_deadline).format("YYYY/MM/DD HH:mm")}</td>
                <td data-label="最後修改時間">{moment(obj.updated_at).format("YYYY/MM/DD HH:mm")}</td>
            </tr>
        );
    });

    const openPeriodDisplay = openPeriod.map((obj: any) => {
        return (
            <tr>
                <td data-label="收生類別" style={{ fontWeight: "bold" }}>
                    {applicationTypeText(obj.type)}
                </td>
                <td data-label="收生年份">{obj.application_year}</td>
                <td data-label="收生階段">{applicationRoundText(obj.round)}</td>
                <td data-label="開始日期">{moment(obj.start_date).format("YYYY/MM/DD HH:mm")}</td>
                <td data-label="結束日期">{moment(obj.end_date).format("YYYY/MM/DD HH:mm")}</td>
                <td data-label="家長修改期限">{moment(obj.end_deadline).format("YYYY/MM/DD HH:mm")}</td>
                <td data-label="最後修改時間">{moment(obj.updated_at).format("YYYY/MM/DD HH:mm")}</td>
            </tr>
        );
    });

    return (
        <>
            <section className={styles.control_container}>
                <div className={styles.controlBlocks}>
                    <Card
                        body
                        className={`${styles.card} ${styles.pointer} `}
                        onClick={() => changeDisplay("已關閉時段")}
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderColor: "#ffffff",
                        }}
                    >
                        <CardTitle className={styles.cardTitle}>已關閉時段</CardTitle>
                        <CardText className={styles.cardText}>{closedPeriodFetch.length}</CardText>
                    </Card>
                    <Card
                        body
                        className={`${styles.card} ${styles.pointer}`}
                        onClick={() => changeDisplay("家長可修改時段")}
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderColor: "#ffffff",
                        }}
                    >
                        <CardTitle className={styles.cardTitle}>家長可修改時段</CardTitle>
                        <CardText className={styles.cardText}>{amendablePeriodFetch.length}</CardText>
                    </Card>
                    <Card
                        body
                        className={`${styles.card} ${styles.pointer}`}
                        onClick={() => changeDisplay("現有開放時間")}
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderColor: "#ffffff",
                        }}
                    >
                        <CardTitle className={styles.cardTitle}>現有開放時間</CardTitle>
                        <CardText className={styles.cardText}>{openPeriodFetch.length}</CardText>
                    </Card>
                </div>
            </section>

            <section className={styles.bottom_container}>
                <div className={styles.header_container}>
                    <h5>{display}</h5>
                </div>
                <div>
                    <Table className={styles.table}>
                        <thead>
                            <tr className={styles.tableHead}>
                                <th>收生類別</th>
                                <th>收生年份</th>
                                <th>收生階段</th>
                                <th>開始日期</th>
                                <th>結束日期</th>
                                <th>家長修改期限</th>
                                <th>最後修改時間</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tableHead}>
                            {display === "已關閉時段" && closedPeriodDisplay}
                            {display === "家長可修改時段" && AmendableDisplay}
                            {display === "現有開放時間" && openPeriodDisplay}
                        </tbody>
                    </Table>
                    {display === "已關閉時段" && (
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={Math.ceil(closedPeriodFetch.length / 10)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={(selected) => handleClosedPeriodPagination(selected)}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                            // When Current Page changed to 1, force the page to go to page 1
                            // When sorting, current page will be changed to 1
                            // forcePage={currentPage === 1 ? 0 : currentPage - 1}
                        />
                    )}
                    {display === "家長可修改時段" && (
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={Math.ceil(amendablePeriodFetch.length / 10)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={(selected) => handleAmendablePeriodPagination(selected)}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                            // When Current Page changed to 1, force the page to go to page 1
                            // When sorting, current page will be changed to 1
                            // forcePage={currentPage === 1 ? 0 : currentPage - 1}
                        />
                    )}
                    {display === "現有開放時間" && (
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={Math.ceil(openPeriodFetch.length / 10)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={(selected) => handleOpenPeriodPagination(selected)}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                            // When Current Page changed to 1, force the page to go to page 1
                            // When sorting, current page will be changed to 1
                            // forcePage={currentPage === 1 ? 0 : currentPage - 1}
                        />
                    )}
                </div>
            </section>
        </>
    );
}
