import { push } from "connected-react-router";
import { RootState, ThunkDispatch } from "../../../store";
import { form } from "../../application/SearchBar";
import {
  batchUpdateSuccess,
  failed,
  listRecordReceived,
  markBatchUpdateIsLoading,
  markListIsLoading,
  markSingleIsLoading,
  saveSearchData,
  putApplicationSuccess,
  singleRecordReceived,
  fetchExcelDataSuccess,
  markAddApplicationIsLoading,
  addApplicationSuccess,
} from "./action";
import { ApplicationDataState, EducationState, ParentState, SiblingState } from "./state";

/*******************Single Record Update*****************/
export function fetchRecord(interviewer_id?: number) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      dispatch(markListIsLoading(true));

      //Calculate offset
      let { currentPage, sortBy, limit } = getState().application.payload.record;

      const offset = limit * (currentPage - 1);

      let query = `limit=${limit}&offset=${offset}&sort_by=${sortBy}`;

      //Get only application assigned for a specific teacher
      if (interviewer_id) {
        query += `&interviewer_id=${interviewer_id}`;
      }

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/application?${query}`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.payload.login.token,
          },
        }
      );

      const resData = await res.json();

      if (resData) {
        dispatch(listRecordReceived(resData.count, resData.data));
      }
    } catch (error) {
      dispatch(failed("FETCH_LIST_APPLICATION_FAILED", error));
    } finally {
      dispatch(markListIsLoading(false));
    }
  };
}

export function fetchSingleRecord(applicationId: number) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      dispatch(markSingleIsLoading(true));
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/application/id/${applicationId}`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.payload.login.token,
          },
        }
      );
      const resData = await res.json();

      if (resData.isSuccess) {
        dispatch(singleRecordReceived(resData.count, resData.data[0]));
      } else if (resData.message === "Not found") {
        dispatch(failed("FETCH_SINGLE_APPLICATION_NOT_FOUND", resData.message));
      } else {
        dispatch(failed("FETCH_SINGLE_APPLICATION_FAILED", resData.message));
      }
    } catch (e) {
      dispatch(failed("FETCH_SINGLE_APPLICATION_FAILED", e));
    } finally {
      dispatch(markSingleIsLoading(false));
    }
  };
}

// Insert application
export function addApplication(data: ApplicationDataState, formType: string) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      // Mark page loading
      dispatch(markAddApplicationIsLoading(true));

      // get target application period
      const periodId = (data.application_period as any).value;

      // Create FormData
      const formData = new FormData();
      for (let singleData in data) {
        if (singleData === "parent" || singleData === "education" || singleData === "sibling") {
          data[singleData].forEach((singleRecord: EducationState | ParentState | SiblingState) => {
            const data = JSON.stringify(singleRecord);
            formData.append(`${singleData}[0]`, data);
          });
        }

        formData.append(`${singleData}`, `${(data as any)[singleData]}`);
      }
      formData.set("recent_photo", data.recent_photo[0]);
      formData.set("application_period_id", (data.application_period as any).value);
      if (data.interviewer) {
        formData.set("interviewer", (data.interviewer as any).value);
      }
      // group interview_date and interview_time as "interview_date_time"
      if (data.interview_date && data.interview_time) {
        formData.set("interview_date_time", `${data.interview_date} ${data.interview_time}`);
      }
      // set deposit slip
      formData.set("slips", "");
      for (const file of data.slips) {
        formData.append("slips", file, (file as any).name);
      }

      // fetch post api
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/application/periodId/${periodId}/role/dashboard`,

        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + getState().auth.payload.login.token,
          },
          body: formData,
        }
      );

      const result = await res.json();
      console.log("result: ", result);
      if (result.isSuccess) {
        dispatch(addApplicationSuccess());
        dispatch(push(`/application/${result.applicationId}`));
        dispatch(fetchSingleRecord(result.applicationId));
      } else if (result.message === "Missing Information") {
        dispatch(failed("ADD_APPLICATION_FAILED_MISSING_CONTENT", result.missingContent));
      } else if (result.message === "No Match Application Period") {
        dispatch(failed("ADD_APPLICATION_FAILED_EXPIRED_PERIOD", result.message));
      } else {
        dispatch(failed("ADD_APPLICATION_FAILED", result.message));
      }
    } catch (err) {
      dispatch(failed("ADD_APPLICATION_FAILED", err.message));
    } finally {
      // Mark page finish loading
      dispatch(markAddApplicationIsLoading(false));
    }
  };
}

// Update application
export function putApplication(data: any, applicationId: number, slipFromDbIsDeleted: boolean) {
  console.log("edit data: ", data);
  console.log("applicationId: ", applicationId);
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      // Mark page loading
      dispatch(markSingleIsLoading(true));

      // Create FormData
      const formData = new FormData();
      for (let singleData in data) {
        if (singleData === "parent" || singleData === "education" || singleData === "sibling") {
          data[singleData].forEach((singleRecord: EducationState | ParentState | SiblingState) => {
            const data = JSON.stringify(singleRecord);
            formData.append(`${singleData}[0]`, data);
          });
        }

        formData.append(`${singleData}`, `${(data as any)[singleData]}`);
      }
      formData.set("recent_photo", data.recent_photo[0]);
      formData.set("application_period_id", (data.application_period as any).value);
      if (data.interviewer) {
        formData.set("interviewer", (data.interviewer as any).value);
      }
      // group interview_date and interview_time as "interview_date_time"
      if (data.interview_date && data.interview_time) {
        formData.set("interview_date_time", `${data.interview_date} ${data.interview_time}`);
      }

      // set deposit slip
      formData.set("slipFromDbIsDeleted", slipFromDbIsDeleted ? "true" : "false"); // check if existing slips deleted and no new insert
      formData.set("slips", "");
      for (const file of data.slips) {
        formData.append("slips", file, file.name);
      }

      // fetch post api
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/application/id/${applicationId}/updateDepositSlipOnly/false`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + getState().auth.payload.login.token,
          },
          body: formData,
        }
      );

      const result = await res.json();

      if (result.isSuccess) {
        dispatch(putApplicationSuccess());
        dispatch(fetchSingleRecord(result.applicationId));
      } else if (result.message === "Missing Information") {
        dispatch(failed("PUT_APPLICATION_FAILED_MISSING_CONTENT", result.missingContent));
      } else {
        dispatch(failed("PUT_APPLICATION_FAILED", result.message));
      }
    } catch (err) {
      dispatch(failed("PUT_APPLICATION_FAILED", err.message));
    } finally {
      // Mark page finish loading
      dispatch(markSingleIsLoading(false));
    }
  };
}

/*******************Batch Actions/ Search*****************/

export interface batchUpdateInterface {
  status?: string;
  selected?: number[];
  interviewer_id?: number;
  interview_date_time?: string;
  application_period_id?: number;
  application_status?: string;
}

//For batch update applications
export function batchUpdate(data: batchUpdateInterface) {
  console.log("batch data: ", data);
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      dispatch(markBatchUpdateIsLoading(true));

      let res;

      //If update status
      //Else update interviewer and interview date
      if (data.status) {
        res = await fetch(
          `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/application/batch-update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + getState().auth.payload.login.token,
            },
            body: JSON.stringify({
              ...data,
            }),
          }
        );
      } else if (data.interviewer_id && data.interview_date_time) {
        res = await fetch(
          `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/application/batch-update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + getState().auth.payload.login.token,
            },
            body: JSON.stringify({
              ...data,
            }),
          }
        );
      } else if (data.application_period_id && data.application_status) {
        // send batch email
        res = await fetch(
          `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/application/batch-update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + getState().auth.payload.login.token,
            },
            body: JSON.stringify({
              ...data,
            }),
          }
        );
      }

      if (!res) {
        dispatch(failed("BATCH_UPDATE_APPLICATIONS_FAILED", "fetch failed"));
        return;
      }

      const resData = await res.json();

      if (resData.status === 200) {
        if (resData.isSendEmail) {
          dispatch(batchUpdateSuccess(data, resData.recordCount, resData.failRecordCount, resData.failEmailRecord));
          return;
        }
        dispatch(batchUpdateSuccess(data));
      } else if (resData.message === "update information not found") {
        dispatch(failed("BATCH_UPDATE_APPLICATIONS_FAILED_NO_FOUND", "update failed: info not found"));
      } else {
        dispatch(failed("BATCH_UPDATE_APPLICATIONS_FAILED", "update failed"));
      }
    } catch (e) {
      dispatch(failed("BATCH_UPDATE_APPLICATIONS_FAILED", e));
    } finally {
      dispatch(markBatchUpdateIsLoading(false));
    }
  };
}

// For searching application
export function searchApplication(data: form) {
  console.log("data: ", data);
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      dispatch(markSingleIsLoading(true));

      //Calculate offset
      let { currentPage, sortBy, limit } = getState().application.payload.record;

      const offset = limit * (currentPage - 1);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/application/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getState().auth.payload.login.token,
          },
          body: JSON.stringify({
            limit,
            offset,
            sortBy,
            data,
          }),
        }
      );

      const resData = await res.json();

      if (resData.status === 200) {
        dispatch(saveSearchData(data));
        dispatch(listRecordReceived(resData.count, resData.data));
      } else {
        dispatch(failed("SEARCH_APPLICATIONS_FAILED", "search failed"));
      }
    } catch (e) {
      dispatch(failed("SEARCH_APPLICATIONS_FAILED", e.message));
    } finally {
      dispatch(markSingleIsLoading(false));
    }
  };
}

// For export excel
export function fetchExcelData() {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      dispatch(markBatchUpdateIsLoading(true));
      const selected = getState().application.payload.record.selected;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/application/excel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getState().auth.payload.login.token,
          },
          body: JSON.stringify({
            selected,
          }),
        }
      );

      if (!res) {
        dispatch(failed("BATCH_UPDATE_APPLICATIONS_FAILED", "fetch failed"));
        return;
      }

      const resData = await res.json();
      if (resData.isSuccess) {
        dispatch(fetchExcelDataSuccess(resData.data));
      } else if (resData.message === "update information not found") {
        dispatch(failed("BATCH_UPDATE_APPLICATIONS_FAILED_NO_FOUND", "update failed: info not found"));
      } else {
        dispatch(failed("BATCH_UPDATE_APPLICATIONS_FAILED", "update failed"));
      }
    } catch (e) {
      dispatch(failed("BATCH_UPDATE_APPLICATIONS_FAILED", e));
    } finally {
      dispatch(markBatchUpdateIsLoading(false));
    }
  };
}
