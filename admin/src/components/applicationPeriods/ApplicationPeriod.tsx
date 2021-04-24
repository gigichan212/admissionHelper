import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../assets/scss/applicationPeriods.module.scss";
import { RootState } from "../../store";
import Header from "../Header";
import { addIsSuccess, editIsSuccess, setShowEdit } from "../redux/applicationPeriod/action";
import { ApplicationPeriodForm } from "./ApplicationPeriodForm";
import { ApplicationPeriodTable } from "./ApplicationPeriodTable";

export function ApplicationPeriod() {
    const dispatch = useDispatch();
    //Set if add container is expanded
    const [isExpanded, setIsExpanded] = useState(false);

    //Check if edit container is show
    const { isDivShow } = useSelector((state: RootState) => state.applicationPeriod.payload.edit);

    //Handle add container expansion
    function handleExpand() {
        //Scroll page to top when add btn is clicked
        document.querySelector(".outer_container")?.scrollTo({ top: 0, left: 0, behavior: "smooth" });

        setIsExpanded((prev) => {
            return !prev;
        });
    }

    //Check if period has been updated
    const { isUpdated } = useSelector((state: RootState) => {
        return state.applicationPeriod.payload.edit;
    });

    //Check if period has been updated
    const { isAdded } = useSelector((state: RootState) => {
        return state.applicationPeriod.payload.add;
    });

    //Get pagination related info
    const { currentPage, limit, recordCount } = useSelector((state: RootState) => {
        return state.applicationPeriod.payload.record;
    });

    //Show updated/deleted/added alert
    useEffect(() => {
        if (isUpdated) {
            alert("成功更新申請時段");
            dispatch(setShowEdit(null, false));
            dispatch(editIsSuccess());
        } else if (isAdded) {
            alert("成功新增申請時段");
            setIsExpanded(false);
            dispatch(addIsSuccess());
        }
    }, [isUpdated, isAdded, dispatch]);

    return (
        <div className="outer_container">
            <Header title="申請時段設定" />

            <main>
                {isExpanded && (
                    <section className={styles.top_container}>
                        <div>
                            <h6>
                                <i className="fa fa-plus"></i>新增申請時段
                            </h6>
                            <button
                                className={styles.cancel_btn}
                                onClick={() => {
                                    setIsExpanded(false);
                                }}
                            >
                                <i className="fa fa-times"></i>
                            </button>
                        </div>

                        {isExpanded && <ApplicationPeriodForm btnText="新增" type="add" />}
                    </section>
                )}

                {isDivShow && (
                    <section className={styles.edit_container}>
                        <div>
                            <h6>
                                <i className="fa fa-plus"></i>修改申請時段
                            </h6>
                            <button
                                className={styles.cancel_btn}
                                onClick={() => {
                                    dispatch(setShowEdit(null, false));
                                }}
                            >
                                <i className="fa fa-times"></i>
                            </button>
                        </div>

                        <ApplicationPeriodForm btnText="修改" type="modify" />
                    </section>
                )}

                <section className={styles.bottom_container}>
                    <div className={styles.header_container}>
                        <h5>申請時段紀錄</h5>

                        <button onClick={() => handleExpand()}>
                            <i className="fa fa-plus"></i>

                            <span>新增申請時段</span>
                        </button>
                    </div>
                    <div className="pageAmount">
                        共有記錄: {recordCount}
                        {recordCount! > 0
                            ? ` (現正顯示${limit * (currentPage - 1) + 1}-
                                ${limit * currentPage > recordCount! ? recordCount : limit * currentPage}個)`
                            : ""}
                    </div>
                    <ApplicationPeriodTable />
                </section>
            </main>
        </div>
    );
}
