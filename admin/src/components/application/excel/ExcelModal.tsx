import React, { Dispatch, SetStateAction, useState } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
// css
import styles from "../../../assets/scss/application/modal.module.scss";
// Component
import { arrayToExcel } from "./ArrayToExcel";
import cloneDeep from "lodash.clonedeep";
import { setIsShow } from "../../redux/application/action";
import { RootState } from "../../../store";
import { excelTitleMap } from "../../../util/Mapping";

export interface modalType {
    handleClose: Dispatch<SetStateAction<boolean>>;
}

export function ExcelModal(props: modalType) {
    const dispatch = useDispatch();
    const apiArray = useSelector((state: RootState) => state.application.payload.record.excelRecord);
    const fileName = "user_data";
    const [columnsType, setColumnsType] = useState("1");
    const [selectedColumns, setSelectedColumns] = useState([]);

    const totalColumns = apiArray ? Object.keys(apiArray[0]).length : "";
    const updateSelectedColumns = (e: any | never, column: any) => {
        if (e.target.checked) {
            //@ts-ignore
            setSelectedColumns([...selectedColumns, column]);
        } else {
            setSelectedColumns(selectedColumns.filter((value) => value !== column));
        }
    };

    const apiArrayToExcel = () => {
        if (columnsType === "1") {
            arrayToExcel.convertArrayToTable(apiArray, fileName);
        } else {
            const customArray = cloneDeep(apiArray);
            customArray.map((obj: any) =>
                Object.keys(obj).forEach((key) => {
                    //@ts-ignore
                    if (!selectedColumns.includes(key)) {
                        delete obj[key];
                    }
                })
            );
            arrayToExcel.convertArrayToTable(customArray, fileName);
            setSelectedColumns([]);
        }
    };

    /********************************************************************/

    return (
        <>
            {apiArray.length > 0 && apiArray !== undefined && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <section className={styles.header}>
                            <div>
                                <h5>匯出Excel</h5>
                                <button
                                    className={styles.cancel_btn}
                                    onClick={() => {
                                        dispatch(setIsShow("excel", false));
                                    }}
                                >
                                    <i className="fa fa-times"></i>
                                </button>
                            </div>
                        </section>

                        <form>
                            <div className={`${styles.input_container} ${styles.excel}`}>
                                <p style={{ marginBottom: "10px" }}>選擇下載類別: </p>
                                <select onChange={(e: any) => setColumnsType(e.target.value)}>
                                    <option value="1">所有欄位({totalColumns})</option>
                                    <option value="2">自訂欄位</option>
                                </select>

                                {columnsType === "2" && (
                                    <div className={styles.selectContainer}>
                                        {Object.keys(apiArray[0]).map((key, index) => {
                                            return (
                                                <div key={index} className={styles.options}>
                                                    <label>
                                                        <input
                                                            id={key}
                                                            type="checkbox"
                                                            value={key}
                                                            onChange={(e: any) => updateSelectedColumns(e, key)}
                                                        ></input>
                                                        {excelTitleMap.get(key)}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <button onClick={() => apiArrayToExcel()}>匯出</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
