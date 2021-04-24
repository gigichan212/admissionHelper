import { IRootState, ThunkDispatch } from "../../store";
import { failed, fetchRecordSuccess, markPageLoading } from "./actions";

/************************************Thunk Actions********************************/

// Fetch period
export function fetchPeriod() {
  return async function (dispatch: ThunkDispatch, getState: () => IRootState) {
    try {
      dispatch(markPageLoading(true));
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/application-period`
      );
      const result = await res.json();
      if (result.isSuccess) {
        dispatch(fetchRecordSuccess(result.data));
      } else {
        dispatch(failed("FETCH_RECORD_FAILED", result.message));
      }
    } catch (err) {
      dispatch(failed("FETCH_RECORD_FAILED", err.message));
    } finally {
      dispatch(markPageLoading(false));
    }
  };
}
