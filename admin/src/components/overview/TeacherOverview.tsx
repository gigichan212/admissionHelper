import { useEffect, useState } from "react";
import styles from "../../assets/scss/overview.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardTitle, CardText } from "reactstrap";
import { Table } from "reactstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { applicationStatusMap } from "../../util/Mapping";
import moment from "moment";
import ReactPaginate from "react-paginate";

export function TeacherOverview(props: any) {
    let [display, setDisplay] = useState("今天面試學生");
    let [studentArray, setStudentArray] = useState([]);
    let [interviewedDisplayPage, setInterviewedDisplayPage] = useState(0);
    let [interviewTodayPage, setinterviewTodayPage] = useState(0);
    let [toBeInterviewPage, settoBeInterviewPage] = useState(0);

    const token = useSelector((state: RootState) => {
        return state.auth.payload.login.token;
    });

    function changeDisplay(changingTo: string) {
        setDisplay(changingTo);
        setInterviewedDisplayPage(0);
        setinterviewTodayPage(0);
        settoBeInterviewPage(0);
    }

    const userId = useSelector((state: RootState) => {
        return state.auth.payload.login.userId;
    });

    const today = moment(new Date()).format("YYYY/MM/DD");

    const interviewed = studentArray.filter((item: any) => {
        //Reformat to ignore time
        const interviewDate = moment(item.interview_date_time).format("YYYY/MM/DD");

        return today > interviewDate;
    });

    const interviewToday = studentArray.filter((item: any) => {
        //Reformat to ignore time
        const interviewDate = moment(item.interview_date_time).format("YYYY/MM/DD");

        return today === interviewDate;
    });

    const interviewLater = studentArray.filter((item: any) => {
        //Reformat to ignore time
        const interviewDate = moment(item.interview_date_time).format("YYYY/MM/DD");

        return today < interviewDate;
    });
    const interviewedDisplay = interviewed.map((item: any, index) => {
        if (Math.floor(index / 10) === interviewedDisplayPage) {
            return (
                <tr>
                    <td>
                        {item.prefix}
                        {item.id}
                    </td>
                    <td>{item.chinese_name}</td>
                    <td>{item.first_round_score}</td>
                    <td>{item.second_round_score}</td>
                    <td>{moment(item.interview_date_time).format("YYYY/MM/DD HH:mm")}</td>
                    <td>
                        <div
                            className={
                                item.application_status === "rejected"
                                    ? styles.status_box_rejected
                                    : item.application_status === "invalid"
                                    ? styles.status_box_invalid
                                    : styles.status_box_positive
                            }
                        >
                            {applicationStatusMap.get(item.application_status)}
                        </div>
                    </td>
                </tr>
            );
        }
    });

    const interviewTodayDisplay = interviewToday.map((item: any, index) => {
        if (Math.floor(index / 10) === interviewTodayPage) {
            return (
                <tr>
                    <td>
                        {item.prefix}
                        {item.id}
                    </td>
                    <td>{item.chinese_name}</td>
                    <td>{item.first_round_score}</td>
                    <td>{item.second_round_score}</td>
                    <td>{moment(item.interview_date_time).format("YYYY/MM/DD HH:mm")}</td>
                    <td>
                        <div
                            className={
                                item.application_status === "rejected"
                                    ? styles.status_box_rejected
                                    : item.application_status === "invalid"
                                    ? styles.status_box_invalid
                                    : styles.status_box_positive
                            }
                        >
                            {applicationStatusMap.get(item.application_status)}
                        </div>
                    </td>
                </tr>
            );
        }
    });

    const interviewLaterDisplay = interviewLater.map((item: any, index) => {
        if (Math.floor(index / 10) === toBeInterviewPage) {
            return (
                <tr>
                    <td>
                        {item.prefix}
                        {item.id}
                    </td>
                    <td>{item.chinese_name}</td>
                    <td>{item.first_round_score}</td>
                    <td>{item.second_round_score}</td>
                    <td>{moment(item.interview_date_time).format("YYYY/MM/DD HH:mm")}</td>
                    <td>
                        <div
                            className={
                                item.application_status === "rejected"
                                    ? styles.status_box_rejected
                                    : item.application_status === "invalid"
                                    ? styles.status_box_invalid
                                    : styles.status_box_positive
                            }
                        >
                            {applicationStatusMap.get(item.application_status)}
                        </div>
                    </td>
                </tr>
            );
        }
    });

    useEffect(() => {
        async function test() {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/application/allActiveApplication`,
                {
                    headers: { Authorization: "Bearer " + token },
                }
            );
            const result = await res.json();
            const resultArray = result.data;
            let studentDisplay = resultArray.filter((student: any) => {
                return student.interviewer_id === userId;
            });
            // studentDisplay.push(
            //     {"email":"wpostin2@google.ru","prefix":202103,"chinese_name":"银涵","english_name":"Wendell Postin","date_of_birth":"2015-12-04","place_of_birth":"China","birth_cert_num":"2464669776","address":"212 Sage Trail","sex":"M","nationality":"China","religion":"multi-tasking","phone":57546140,"remarks":"","have_sibling":true,"recent_photo":"https://robohash.org/minimanequeporro.png?size=200x200&set=set1","first_round_score":30,"first_round_remarks":"In congue. Etiam justo. Etiam pretium iaculis justo.","second_round_score":null,"second_round_remarks":null,"school_remarks":null,"is_active":true, "interview_date_time":"2020-04-16T06:25:44Z"},
            //     {"email":"wpostin2@google.ru","prefix":202103,"chinese_name":"银涵","english_name":"Wendell Postin","date_of_birth":"2015-12-04","place_of_birth":"China","birth_cert_num":"2464669776","address":"212 Sage Trail","sex":"M","nationality":"China","religion":"multi-tasking","phone":57546140,"remarks":"","have_sibling":true,"recent_photo":"https://robohash.org/minimanequeporro.png?size=200x200&set=set1","first_round_score":30,"first_round_remarks":"In congue. Etiam justo. Etiam pretium iaculis justo.","second_round_score":null,"second_round_remarks":null,"school_remarks":null,"is_active":true, "interview_date_time":"2020-04-16T06:25:44Z"},
            //     {"email":"wpostin2@google.ru","prefix":202103,"chinese_name":"银涵","english_name":"Wendell Postin","date_of_birth":"2015-12-04","place_of_birth":"China","birth_cert_num":"2464669776","address":"212 Sage Trail","sex":"M","nationality":"China","religion":"multi-tasking","phone":57546140,"remarks":"","have_sibling":true,"recent_photo":"https://robohash.org/minimanequeporro.png?size=200x200&set=set1","first_round_score":30,"first_round_remarks":"In congue. Etiam justo. Etiam pretium iaculis justo.","second_round_score":null,"second_round_remarks":null,"school_remarks":null,"is_active":true, "interview_date_time":"2020-04-16T06:25:44Z"},
            //     {"email":"wpostin2@google.ru","prefix":202103,"chinese_name":"银涵","english_name":"Wendell Postin","date_of_birth":"2015-12-04","place_of_birth":"China","birth_cert_num":"2464669776","address":"212 Sage Trail","sex":"M","nationality":"China","religion":"multi-tasking","phone":57546140,"remarks":"","have_sibling":true,"recent_photo":"https://robohash.org/minimanequeporro.png?size=200x200&set=set1","first_round_score":30,"first_round_remarks":"In congue. Etiam justo. Etiam pretium iaculis justo.","second_round_score":null,"second_round_remarks":null,"school_remarks":null,"is_active":true, "interview_date_time":"2020-04-16T06:25:44Z"},
            //     {"email":"wpostin2@google.ru","prefix":202103,"chinese_name":"银涵","english_name":"Wendell Postin","date_of_birth":"2015-12-04","place_of_birth":"China","birth_cert_num":"2464669776","address":"212 Sage Trail","sex":"M","nationality":"China","religion":"multi-tasking","phone":57546140,"remarks":"","have_sibling":true,"recent_photo":"https://robohash.org/minimanequeporro.png?size=200x200&set=set1","first_round_score":30,"first_round_remarks":"In congue. Etiam justo. Etiam pretium iaculis justo.","second_round_score":null,"second_round_remarks":null,"school_remarks":null,"is_active":true, "interview_date_time":"2020-04-16T06:25:44Z"},
            //     {"email":"wpostin2@google.ru","prefix":202103,"chinese_name":"银涵","english_name":"Wendell Postin","date_of_birth":"2015-12-04","place_of_birth":"China","birth_cert_num":"2464669776","address":"212 Sage Trail","sex":"M","nationality":"China","religion":"multi-tasking","phone":57546140,"remarks":"","have_sibling":true,"recent_photo":"https://robohash.org/minimanequeporro.png?size=200x200&set=set1","first_round_score":30,"first_round_remarks":"In congue. Etiam justo. Etiam pretium iaculis justo.","second_round_score":null,"second_round_remarks":null,"school_remarks":null,"is_active":true, "interview_date_time":"2020-04-16T06:25:44Z"},
            //     {"email":"wpostin2@google.ru","prefix":202103,"chinese_name":"银涵","english_name":"Wendell Postin","date_of_birth":"2015-12-04","place_of_birth":"China","birth_cert_num":"2464669776","address":"212 Sage Trail","sex":"M","nationality":"China","religion":"multi-tasking","phone":57546140,"remarks":"","have_sibling":true,"recent_photo":"https://robohash.org/minimanequeporro.png?size=200x200&set=set1","first_round_score":30,"first_round_remarks":"In congue. Etiam justo. Etiam pretium iaculis justo.","second_round_score":null,"second_round_remarks":null,"school_remarks":null,"is_active":true, "interview_date_time":"2020-04-16T06:25:44Z"},
            //     {"email":"wpostin2@google.ru","prefix":202103,"chinese_name":"银涵","english_name":"Wendell Postin","date_of_birth":"2015-12-04","place_of_birth":"China","birth_cert_num":"2464669776","address":"212 Sage Trail","sex":"M","nationality":"China","religion":"multi-tasking","phone":57546140,"remarks":"","have_sibling":true,"recent_photo":"https://robohash.org/minimanequeporro.png?size=200x200&set=set1","first_round_score":30,"first_round_remarks":"In congue. Etiam justo. Etiam pretium iaculis justo.","second_round_score":null,"second_round_remarks":null,"school_remarks":null,"is_active":true, "interview_date_time":"2020-04-16T06:25:44Z"},
            //     {"email":"wpostin2@google.ru","prefix":202103,"chinese_name":"银涵","english_name":"Wendell Postin","date_of_birth":"2015-12-04","place_of_birth":"China","birth_cert_num":"2464669776","address":"212 Sage Trail","sex":"M","nationality":"China","religion":"multi-tasking","phone":57546140,"remarks":"","have_sibling":true,"recent_photo":"https://robohash.org/minimanequeporro.png?size=200x200&set=set1","first_round_score":30,"first_round_remarks":"In congue. Etiam justo. Etiam pretium iaculis justo.","second_round_score":null,"second_round_remarks":null,"school_remarks":null,"is_active":true, "interview_date_time":"2020-04-16T06:25:44Z"},
            //     {"email":"wpostin2@google.ru","prefix":202103,"chinese_name":"银涵","english_name":"Wendell Postin","date_of_birth":"2015-12-04","place_of_birth":"China","birth_cert_num":"2464669776","address":"212 Sage Trail","sex":"M","nationality":"China","religion":"multi-tasking","phone":57546140,"remarks":"","have_sibling":true,"recent_photo":"https://robohash.org/minimanequeporro.png?size=200x200&set=set1","first_round_score":30,"first_round_remarks":"In congue. Etiam justo. Etiam pretium iaculis justo.","second_round_score":null,"second_round_remarks":null,"school_remarks":null,"is_active":true, "interview_date_time":"2020-04-17T06:25:44Z"},

            // )

            //Filter out students with no interview date and time
            studentDisplay = studentDisplay.filter((stu: any) => stu.interview_date_time);

            setStudentArray(studentDisplay);
        }

        test();
    }, [token, userId]);

    return (
        <>
            <section className={styles.control_container}>
                <div className={styles.controlBlocks}>
                    <Card
                        body
                        className={styles.card}
                        onClick={() => changeDisplay("已面試學生")}
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderColor: "#ffffff",
                        }}
                    >
                        <CardTitle className={styles.cardTitle}>已面試學生</CardTitle>
                        <CardText className={styles.cardText}>{interviewed.length}</CardText>
                    </Card>
                    <Card
                        body
                        className={styles.card}
                        onClick={() => changeDisplay("今天面試學生")}
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderColor: "#ffffff",
                        }}
                    >
                        <CardTitle className={styles.cardTitle}>今天面試學生</CardTitle>
                        <CardText className={styles.cardText}>{interviewToday.length}</CardText>
                    </Card>

                    <Card
                        body
                        className={styles.card}
                        onClick={() => changeDisplay("未面試學生")}
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderColor: "#ffffff",
                        }}
                    >
                        <CardTitle className={styles.cardTitle}>未面試學生</CardTitle>
                        <CardText className={styles.cardText}>{interviewLater.length}</CardText>
                    </Card>
                </div>
            </section>
            <section className={styles.bottom_container}>
                <div className={styles.header_container}>
                    <h5>{display}</h5>
                </div>
                <div>
                    <Table>
                        <thead>
                            <tr>
                                <th>申請編號</th>
                                <th>姓名</th>
                                <th>第一輪面試分數</th>
                                <th>第二輪面試分數</th>
                                <th>面試時間</th>
                                <th>申請狀態</th>
                            </tr>
                        </thead>
                        <tbody>
                            {display === "已面試學生" && interviewedDisplay}
                            {display === "今天面試學生" && interviewTodayDisplay}
                            {display === "未面試學生" && interviewLaterDisplay}
                        </tbody>
                    </Table>
                </div>
                {display === "已面試學生" && (
                    <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={Math.ceil(interviewed.length / 10)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={(selected: { selected: number }) => setInterviewedDisplayPage(selected.selected)}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        // When Current Page changed to 1, force the page to go to page 1
                        // When sorting, current page will be changed to 1
                        // forcePage={currentPage === 1 ? 0 : currentPage - 1}
                    />
                )}

                {display === "今天面試學生" && (
                    <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={Math.ceil(interviewToday.length / 10)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={(selected: { selected: number }) => setinterviewTodayPage(selected.selected)}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        // When Current Page changed to 1, force the page to go to page 1
                        // When sorting, current page will be changed to 1
                        // forcePage={currentPage === 1 ? 0 : currentPage - 1}
                    />
                )}
                {display === "未面試學生" && (
                    <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={Math.ceil(interviewLater.length / 10)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={(selected: { selected: number }) => settoBeInterviewPage(selected.selected)}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        // When Current Page changed to 1, force the page to go to page 1
                        // When sorting, current page will be changed to 1
                        // forcePage={currentPage === 1 ? 0 : currentPage - 1}
                    />
                )}
            </section>
        </>
    );
}
