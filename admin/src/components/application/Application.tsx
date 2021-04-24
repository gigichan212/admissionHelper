import React, { useEffect, useState } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
// router
import { push } from "connected-react-router";
import useRouter from "use-react-router";
// Css
import styles from "../../assets/scss/application/application.module.scss";
// Component
import { MyTable } from "./MyTable";
import { Modal } from "./Modal";
import { ApplicationDetails } from "./ApplicationDetails";
import Header from "../Header";
import { SearchBar } from "./SearchBar";
import { RootState } from "../../store";
import { batchUpdate, fetchExcelData, fetchRecord, searchApplication } from "../redux/application/thunkAction";
import {
    saveSearchData,
    setCurrentPage,
    setIsShow,
    setIsUpdated,
    setRecordLimit,
    setRecordSortBy,
    setSelectedApp,
} from "../redux/application/action";
import { applicationStatusMap } from "../../util/Mapping";
import { EmailModal } from "./EmailModal";
import LoadingComponent from "../general/Loading";
import { ExcelModal } from "./excel/ExcelModal";

export function Application() {
    const router = useRouter<{ id?: string }>();
    const dispatch = useDispatch();

    //Get if email modal is show
    const { isShow: isEmailModalShow } = useSelector((state: RootState) => {
        return state.application.payload.container.email;
    });
    function showEmailModal(isShow: boolean) {
        dispatch(setIsShow("email", isShow));
    }

    // Batch action
    const { isShow: batchIsShow } = useSelector((state: RootState) => {
        return state.application.payload.container.batchUpdate;
    });
    const isUpdateLoading = useSelector((state: RootState) => {
        return state.application.payload.container.batchUpdate.isLoading;
    });
    function handleExpand() {
        dispatch(setIsShow("batch", !batchIsShow));
    }

    // Assign teacher
    const { isShow: isModalShow } = useSelector((state: RootState) => {
        return state.application.payload.container.interviewerModal;
    });
    function showModal(isShow: boolean) {
        dispatch(setIsShow("interviewer", isShow));
    }

    // Get window width
    const [windowWidth, setWindowSize] = useState<number | null>(null);
    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            setWindowSize(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    // Export excel
    const { isShow: isExcelShow } = useSelector((state: RootState) => {
        return state.application.payload.container.excel;
    });
    function showExcelModal(isShow: boolean) {
        dispatch(setIsShow("excel", isShow));
    }
    function handleExportExcel() {
        //return if screen size is smaller than iPad
        if (windowWidth && windowWidth < 768) {
            alert("匯出Excel不支援用電話使用。");
            return;
        }

        dispatch(fetchExcelData());
        if (selected.length > 0) {
            showExcelModal(true);
        } else {
            // if there is no record selected
            alert("請先選擇要匯出的申請");
        }
    }

    // Get user token from the store
    const token: string = useSelector((state: RootState) => {
        return state.auth.payload.login.token;
    });

    // Get application count and selected applications from the store
    // Get search query and record from store(for clearing selected records)
    const {
        recordCount,
        selected,
        isUpdated,
        searchQuery,
        isUpdatedEmail,
        emailRecordCount,
        failEmailRecordCount,
        failEmailRecord,
        excelRecord,
        limit,
        currentPage,
    } = useSelector((state: RootState) => {
        return state.application.payload.record;
    });

    // Get user role from the store
    const { role } = useSelector((state: RootState) => {
        return state.auth.payload.login;
    });

    /********************************************************************/

    useEffect(() => {
        //When search query is displayed, clear the selected applications array
        if (searchQuery) {
            dispatch(setSelectedApp([]));
        }
    }, [searchQuery, dispatch]);

    //Clear search data on page leave
    useEffect(() => {
        return () => {
            dispatch(saveSearchData());
            dispatch(setSelectedApp([]));
            dispatch(setRecordSortBy("created_at"));
        };
    }, [dispatch]);

    /********************************************************************/
    // Go to add application page
    function handleToAddApplication() {
        dispatch(push(`/application/add`));
    }

    //handle change on items displayed per page
    function handlePageItems(e: React.ChangeEvent<HTMLSelectElement>) {
        const limit = parseInt(e.target.value);

        //Change limit in redux store
        dispatch(setRecordLimit(limit));

        if (searchQuery) {
            dispatch(searchApplication(searchQuery));
        } else {
            dispatch(fetchRecord());
        }
    }

    //Handle application sorting
    function handleSorting(e: React.ChangeEvent<HTMLSelectElement>) {
        const sortBy = e.target.value;

        dispatch(setRecordSortBy(sortBy));

        //Set current page to 1 (Bring the user back to page 1)
        dispatch(setCurrentPage(1));

        //Fetch record again
        if (searchQuery) {
            dispatch(searchApplication(searchQuery));
        } else {
            dispatch(fetchRecord());
        }
    }

    //handle batch update application status
    function handleUpdateStatus(e: React.ChangeEvent<HTMLSelectElement>) {
        //Get which option is selected
        const status = e.target.value;

        //Check if the status is selected
        if (!status) return;
        //Check if any application is selected
        const numOfSelected = selected.length;
        if (numOfSelected < 1) {
            alert("請選擇需要更改的申請");
            return;
        }

        //Ask user if they confirm the action
        const confirm = window.confirm(
            `確認更改   ${numOfSelected}人   的申請狀態為： ${applicationStatusMap.get(status)}？`
        );

        //send fetch to update application status
        if (confirm) {
            dispatch(batchUpdate({ selected: selected, status: status }));
        }
    }

    //If batch update is successful, alert user
    useEffect(() => {
        if (isUpdated) {
            alert("更改資料成功");
            dispatch(setIsUpdated());
        } else if (isUpdatedEmail) {
            if (failEmailRecordCount && failEmailRecordCount > 0) {
                const successRecord = (emailRecordCount as number) - failEmailRecordCount;
                if (successRecord < 1) {
                    // if there is no success record
                    alert(`共有${failEmailRecordCount}失敗記錄: ${failEmailRecord?.map((email) => email)}`);
                } else {
                    // if there are success and fail record
                    alert(
                        `已發送電郵至${
                            (emailRecordCount as number) - failEmailRecordCount
                        }名申請人\n共有${failEmailRecordCount}無法發送記錄: ${failEmailRecord?.map((email) => email)}`
                    );
                }
            } else {
                // if there is no fail record
                alert(`已發送電郵至${emailRecordCount}名申請人`);
            }

            dispatch(setIsUpdated());
        }
    }, [isUpdated, emailRecordCount, isUpdatedEmail, failEmailRecordCount, dispatch]);

    /********************************************************************/
    // Loading effect
    if (isUpdateLoading) {
        return <LoadingComponent height="full" />;
    }

    //Stop user from scrolling when modal is opened
    let overflow;
    if (isEmailModalShow || isModalShow || isExcelShow) {
        overflow = {
            overflow: "hidden",
        };
    } else {
        overflow = {
            overflow: "scroll",
        };
    }

    return (
        <>
            <div className="outer_container" style={overflow}>
                <Header title="申請記錄" />
                {(isEmailModalShow || isModalShow || isExcelShow) && (
                    <div className={`${styles.modalBackground} `}></div>
                )}

                {/* show application details if have params id */}
                {router.match.params.id || router.location.pathname.endsWith("add") ? (
                    <ApplicationDetails myToken={token} />
                ) : (
                    <main>
                        <SearchBar />

                        {isEmailModalShow && <EmailModal handleClose={() => showEmailModal(false)} myToken={token} />}

                        <section className={styles.bottom_container}>
                            <div className="pageAmount">
                                共有記錄: {recordCount}
                                {recordCount! > 0
                                    ? ` (現正顯示${limit * (currentPage - 1) + 1}-
                                ${limit * currentPage > recordCount! ? recordCount : limit * currentPage}個)`
                                    : ""}
                            </div>
                            <div className={styles.option_container}>
                                <div className={styles.option_container_left}>
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
                                    <button
                                        className={`${styles.email_btn} ${styles.batchUpdateBtns}`}
                                        onClick={() => dispatch(setIsShow("email", true))}
                                    >
                                        發送電郵
                                    </button>
                                    <button
                                        className={styles.batchUpdateBtns}
                                        onClick={() => {
                                            handleToAddApplication();
                                        }}
                                    >
                                        新增記錄
                                        <i className="fa fa-plus-square"></i>
                                    </button>

                                    <button
                                        className={styles.batchUpdateBtns}
                                        onClick={() => {
                                            handleExpand();
                                        }}
                                    >
                                        批量工作
                                        {batchIsShow ? (
                                            <i className="fa fa-minus-square"></i>
                                        ) : (
                                            <i className="fa fa-plus-square"></i>
                                        )}
                                    </button>
                                </div>

                                <div className={styles.bottom_select}>
                                    <label htmlFor="page_sort">
                                        <i className="fas fa-sort-amount-down"></i>
                                    </label>
                                    <select name="page_sort" id="page_sort" onChange={(e) => handleSorting(e)}>
                                        <option value="created_at" selected>
                                            按日期排序
                                        </option>
                                        <option value="first_round_score">按第一輪面試分數排序</option>
                                        <option value="second_round_score">按第二輪面試分數排序</option>
                                    </select>
                                </div>
                            </div>
                            {batchIsShow && (
                                <div className={styles.batch}>
                                    <button
                                        className={styles.batchUpdateBtns}
                                        onClick={() => {
                                            handleExportExcel();
                                        }}
                                    >
                                        匯出Excel
                                    </button>
                                    {isExcelShow && excelRecord.length > 0 && (
                                        <ExcelModal handleClose={() => showExcelModal(false)} />
                                    )}

                                    {/* <button>匯出PDF</button> */}
                                    {role === "admin" && (
                                        <>
                                            <button className={`${styles.select_btn} ${styles.batchUpdateBtns}`}>
                                                <select
                                                    name="applicationStatus"
                                                    id="applicationStatus"
                                                    onChange={(e) => handleUpdateStatus(e)}
                                                >
                                                    <option value="" selected>
                                                        修改申請狀態
                                                    </option>
                                                    <option value="pending">處理中</option>
                                                    <option value="first_round_interview">進入第一輪面試</option>
                                                    <option value="second_round_interview">進入第二輪面試</option>
                                                    <option value="admitted">取錄</option>
                                                    <option value="invalid">無效</option>
                                                    <option value="rejected">拒絕</option>
                                                </select>
                                            </button>
                                            <button className={styles.batchUpdateBtns} onClick={() => showModal(true)}>
                                                分配面試老師及時間
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                            {isModalShow && <Modal handleClose={() => showModal(false)} myToken={token}></Modal>}

                            <MyTable></MyTable>
                        </section>
                    </main>
                )}
            </div>
        </>
    );
}
