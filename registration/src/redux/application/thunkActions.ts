import { push } from "connected-react-router";
import { IRootState, ThunkDispatch } from "../../store";
import {
  addApplicationSuccess,
  addRecentPhotoPreview,
  failed,
  fetchApplicationSuccess,
  markApplicationLoading,
  putApplicationSuccess,
} from "./actions";
import {
  IApplicationDataState,
  IEducationState,
  IParentState,
  ISiblingState,
} from "./state";

/************************************Thunk Actions********************************/
// Insert application
export function addApplication(data: IApplicationDataState, formType: string) {
  return async (dispatch: ThunkDispatch) => {
    try {
      // Mark page loading
      dispatch(markApplicationLoading(true));

      // Create FormData
      const formData = new FormData();
      for (let singleData in data) {
        if (
          singleData === "parent" ||
          singleData === "education" ||
          singleData === "sibling"
        ) {
          data[singleData].forEach(
            (singleRecord: IEducationState | IParentState | ISiblingState) => {
              const data = JSON.stringify(singleRecord);
              formData.append(`${singleData}[0]`, data);
            }
          );
        }

        formData.append(`${singleData}`, `${(data as any)[singleData]}`);
      }
      formData.set("recent_photo", data.recent_photo[0]);
      formData.set("application_status", "pending");

      // fetch post api
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/public/application/type/${formType}/role/parent`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (result.isSuccess) {
        dispatch(
          addApplicationSuccess(
            result.applicationIdWithPrefix,
            result.createdAt
          )
        );
        dispatch(addRecentPhotoPreview(null)); // reset input value of App.tsx for recent_photo
        dispatch(push(`/form/${formType}/step3`));

        // send confirmation email
        await fetch(
          `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/public/email`,

          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + result.token,
            },
          }
        );
      } else if (result.message === "Missing Information") {
        dispatch(
          failed(
            "ADD_APPLICATION_FAILED_MISSING_CONTENT",
            result.missingContent
          )
        );
      } else if (result.message === "No Match Application Period") {
        dispatch(
          failed("ADD_APPLICATION_FAILED_EXPIRED_PERIOD", result.message)
        );
      } else {
        dispatch(failed("ADD_APPLICATION_FAILED", result.message));
      }
    } catch (err) {
      dispatch(failed("ADD_APPLICATION_FAILED", err.message));
    } finally {
      // Mark page finish loading
      dispatch(markApplicationLoading(false));
    }
  };
}

// Fetch application
export function fetchApplication() {
  return async function (dispatch: ThunkDispatch, getState: () => IRootState) {
    try {
      dispatch(markApplicationLoading(true));
      const applicationId = getState().auth.applicationId;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/application/id/${applicationId}`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.token,
          },
        }
      );
      const result = await res.json();
      if (result.isSuccess) {
        dispatch(fetchApplicationSuccess(result.data[0]));
      } else {
        dispatch(failed("FETCH_APPLICATION_FAILED", result.message));
      }
    } catch (err) {
      dispatch(failed("FETCH_APPLICATION_FAILED", err.message));
    } finally {
      dispatch(markApplicationLoading(false));
    }
  };
}

// Update application
export function putApplication(
  data: any,
  applicationId: number,
  slipFromDbIsDeleted?: boolean
) {
  console.log("data: ", data);
  console.log("slipFromDbIsDeleted: ", slipFromDbIsDeleted);
  return async (dispatch: ThunkDispatch, getState: () => IRootState) => {
    try {
      // Mark page loading
      dispatch(markApplicationLoading(true));

      // Create FormData
      const formData = new FormData();
      let updateDepositSlipOnly: boolean = false;
      if (data.slips) {
        // update deposit only

        updateDepositSlipOnly = true;
        // set deposit slip
        formData.set(
          "slipFromDbIsDeleted",
          slipFromDbIsDeleted ? "true" : "false"
        ); // check if existing slips deleted and no new insert
        formData.set("slips", "");
        for (const file of data.slips) {
          formData.append("slips", file, file.name);
        }
      } else {
        // update info other than deposit
        for (let singleData in data) {
          if (
            singleData === "parent" ||
            singleData === "education" ||
            singleData === "sibling"
          ) {
            data[singleData].forEach(
              (
                singleRecord: IEducationState | IParentState | ISiblingState
              ) => {
                const data = JSON.stringify(singleRecord);
                formData.append(`${singleData}[0]`, data);
              }
            );
          }

          formData.append(`${singleData}`, `${(data as any)[singleData]}`);
        }
        //return if there is no updated recent_photo
        if (data.recent_photo !== null) {
          formData.set("recent_photo", data.recent_photo[0]);
        }
      }

      // fetch post api
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/application/id/${applicationId}/updateDepositSlipOnly/${updateDepositSlipOnly}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + getState().auth.token,
          },
          body: formData,
        }
      );

      const result = await res.json();

      if (result.isSuccess) {
        dispatch(putApplicationSuccess());
        dispatch(addRecentPhotoPreview(null)); // reset input value of App.tsx for recent_photo
        dispatch(fetchApplication());
      } else if (result.message === "Missing Information") {
        dispatch(
          failed(
            "PUT_APPLICATION_FAILED_MISSING_CONTENT",
            result.missingContent
          )
        );
      } else if (result.message === "Edit period is expired") {
        dispatch(
          failed("PUT_APPLICATION_FAILED_EXPIRED_PERIOD", result.message)
        );
      } else {
        dispatch(failed("PUT_APPLICATION_FAILED", result.message));
      }
    } catch (err) {
      dispatch(failed("PUT_APPLICATION_FAILED", err.message));
    } finally {
      // Mark page finish loading
      dispatch(markApplicationLoading(false));
    }
  };
}
