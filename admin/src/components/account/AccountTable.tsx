import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "reactstrap";
import { RootState } from "../../store";
import { userRoleMap } from "../../util/Mapping";
import { Pagination } from "../application/Pagination";
import LoadingComponent from "../general/Loading";
import { fetchRecord, isEditShow as setIsEditShow } from "../redux/user/action";
import { User } from "../redux/user/state";
import styles from "../../assets/scss/application/myTable.module.scss";

export function AccountTable() {
    const dispatch = useDispatch();

    // Get users data from store
    const { users, currentPage, isLoading, limit } = useSelector((state: RootState) => {
        return state.user.payload.record;
    });

    const [paginationIsTrue, setIsTrue] = useState(false);

    useEffect(() => {
        //Calculate offset
        const offset = limit * (currentPage - 1);

        //Get users data
        dispatch(fetchRecord(limit, offset));

        //Use the correct pagination for user
        setIsTrue(true);

        //clean up pagination when we leave the page
        return function cleanup() {
            setIsTrue(false);
        };
    }, [currentPage, dispatch]);

    if (isLoading) {
        return <LoadingComponent />;
    }

    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>賬戶號碼</th>
                        <th>用戶名稱</th>
                        <th>權限類別</th>
                        <th>最後修改時間</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length < 1 && (
                        <tr className={styles.no_record}>
                            <td colSpan={7}>
                                <h5 style={{ textAlign: "center" }}>沒有申請時段</h5>
                            </td>
                        </tr>
                    )}
                    {users.map((user: User) => {
                        return (
                            <tr
                                onClick={() => {
                                    dispatch(setIsEditShow(user.id!, true));
                                }}
                            >
                                <td data-label="賬戶號碼">{user.id}</td>
                                <td data-label="用戶名稱">{user.username}</td>
                                <td data-label="用戶名稱">{userRoleMap.get(user.role)}</td>
                                <td data-label="用戶名稱">{moment(user.updated_at).format("YYYY/MM/DD hh:mm:ss")}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <Pagination user={paginationIsTrue}></Pagination>
        </div>
    );
}
