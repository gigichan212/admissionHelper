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
            alert("??????Excel???????????????????????????");
            return;
        }

        dispatch(fetchExcelData());
        if (selected.length > 0) {
            showExcelModal(true);
        } else {
            // if there is no record selected
            alert("??????????????????????????????");
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
            alert("??????????????????????????????");
            return;
        }

        //Ask user if they confirm the action
        const confirm = window.confirm(
            `????????????   ${numOfSelected}???   ????????????????????? ${applicationStatusMap.get(status)}???`
        );

        //send fetch to update application status
        if (confirm) {
            dispatch(batchUpdate({ selected: selected, status: status }));
        }
    }

    //If batch update is successful, alert user
    useEffect(() => {
        if (isUpdated) {
            alert("??????????????????");
            dispatch(setIsUpdated());
        } else if (isUpdatedEmail) {
            if (failEmailRecordCount && failEmailRecordCount > 0) {
                const successRecord = (emailRecordCount as number) - failEmailRecordCount;
                if (successRecord < 1) {
                    // if there is no success record
                    alert(`??????${failEmailRecordCount}????????????: ${failEmailRecord?.map((email) => email)}`);
                } else {
                    // if there are success and fail record
                    alert(
                        `??????????????????${
                            (emailRecordCount as number) - failEmailRecordCount
                        }????????????\n??????${failEmailRecordCount}??????????????????: ${failEmailRecord?.map((email) => email)}`
                    );
                }
            } else {
                // if there is no fail record
                alert(`??????????????????${emailRecordCount}????????????`);
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
                <Header title="????????????" />
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
                                ????????????: {recordCount}
                                {recordCount! > 0
                                    ? ` (????????????${limit * (currentPage - 1) + 1}-
                                ${limit * currentPage > recordCount! ? recordCount : limit * currentPage}???)`
                                    : ""}
                            </div>
                            <div className={styles.option_container}>
                                <div className={styles.option_container_left}>
                                    <div className={styles.bottom_select}>
                                        <label htmlFor="page_items">??????????????????</label>
                                        <select name="page_items" id="page_items" onChange={(e) => handlePageItems(e)}>
                                            <option value="50" selected>
                                                50
                                            </option>
                                            <option value="100">100</option>
                                            <option value={recordCount + ""}>??????</option>
                                        </select>
                                    </div>
                                    <button
                                        className={`${styles.email_btn} ${styles.batchUpdateBtns}`}
                                        onClick={() => dispatch(setIsShow("email", true))}
                                    >
                                        ????????????
                                    </button>
                                    <button
                                        className={styles.batchUpdateBtns}
                                        onClick={() => {
                                            handleToAddApplication();
                                        }}
                                    >
                                        ????????????
                                        <i className="fa fa-plus-square"></i>
                                    </button>

                                    <button
                                        className={styles.batchUpdateBtns}
                                        onClick={() => {
                                            handleExpand();
                                        }}
                                    >
                                        ????????????
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
                                            ???????????????
                                        </option>
                                        <option value="first_round_score">??????????????????????????????</option>
                                        <option value="second_round_score">??????????????????????????????</option>
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
                                        ??????Excel
                                    </button>
                                    {isExcelShow && excelRecord.length > 0 && (
                                        <ExcelModal handleClose={() => showExcelModal(false)} />
                                    )}

                                    {/* <button>??????PDF</button> */}
                                    {role === "admin" && (
                                        <>
                                            <button className={`${styles.select_btn} ${styles.batchUpdateBtns}`}>
                                                <select
                                                    name="applicationStatus"
                                                    id="applicationStatus"
                                                    onChange={(e) => handleUpdateStatus(e)}
                                                >
                                                    <option value="" selected>
                                                        ??????????????????
                                                    </option>
                                                    <option value="pending">?????????</option>
                                                    <option value="first_round_interview">?????????????????????</option>
                                                    <option value="second_round_interview">?????????????????????</option>
                                                    <option value="admitted">??????</option>
                                                    <option value="invalid">??????</option>
                                                    <option value="rejected">??????</option>
                                                </select>
                                            </button>
                                            <button className={styles.batchUpdateBtns} onClick={() => showModal(true)}>
                                                ???????????????????????????
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
