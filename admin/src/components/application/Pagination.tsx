import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setCurrentPage } from "../redux/application/action";
import { setCurrentPage as setPeriodCurrentPage } from "../redux/applicationPeriod/action";
import { setCurrentPage as setUserCurrentPage } from "../redux/user/action";
import "../../assets/scss/application/pagination.scss";
import ReactPaginate from "react-paginate";
import { setCurrentPage as setEmailCurrentPage } from "../redux/email/action";
import { screenSizeMap } from "../../util/Mapping";

export interface paginationType {
    application?: boolean;
    applicationPeriod?: boolean;
    email?: boolean;
    user?: boolean;
}

export function Pagination(props: paginationType) {
    const dispatch = useDispatch();
    const [size, setSize] = useState([0, 0]);
    const [pageNum, setPageNum] = useState({ page: 5, marginPage: 2 });

    //Fetch limit and record count
    const { limit, recordCount, currentPage } = useSelector((state: RootState) => {
        if (props.application) {
            return state.application.payload.record;
        } else if (props.applicationPeriod) {
            return state.applicationPeriod.payload.record;
        } else if (props.email) {
            return state.email.payload.record;
        } else if (props.user) {
            return state.user.payload.record;
        } else {
            return state.application.payload.record;
        }
    });

    //Calculate number of pages
    let pageCount: number = 0;

    if (recordCount) {
        pageCount = Math.ceil(recordCount / limit);
    }

    //Set current page accordingly
    //application or application period
    function handlePageClick(e: any) {
        const selectedPage = e.selected;

        if (props.application) {
            return dispatch(setCurrentPage(selectedPage + 1));
        } else if (props.applicationPeriod) {
            return dispatch(setPeriodCurrentPage(selectedPage + 1));
        } else if (props.email) {
            return dispatch(setEmailCurrentPage(selectedPage + 1));
        } else if (props.user) {
            return dispatch(setUserCurrentPage(selectedPage + 1));
        } else {
            return dispatch(setCurrentPage(selectedPage + 1));
        }
    }

    //Get current screen size
    useEffect(() => {
        //Update size state when window resized
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }

        //Detect when window resize
        window.addEventListener("resize", updateSize);

        updateSize();

        return () => window.removeEventListener("resize", updateSize);
    }, []);

    //Show less page number when the screen size is smaller than medium
    useEffect(() => {
        if (size[0] < 1) return;

        if (size[0] <= screenSizeMap.get("medium")!) {
            setPageNum({ page: 2, marginPage: 0 });
        }
    }, [size[0]]);

    return (
        <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={pageNum.marginPage}
            pageRangeDisplayed={pageNum.page}
            onPageChange={(e) => {
                handlePageClick(e);
            }}
            containerClassName={"pagination"}
            activeClassName={"active"}
            // When Current Page changed to 1, force the page to go to page 1
            // When sorting, current page will be changed to 1
            forcePage={currentPage === 1 ? 0 : currentPage - 1}
        />
    );
}
