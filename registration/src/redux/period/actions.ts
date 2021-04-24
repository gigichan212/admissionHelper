// About page loading
export function markPageLoading(isLoading: boolean) {
  return {
    type: "@@PERIOD/MARK_PAGE_LOADING" as const,
    payload: {
      period: {
        isLoading,
      },
    },
  };
}

/********Success**************/
export function fetchRecordSuccess(data: any) {
  return {
    type: "@@PERIOD/FETCH_RECORD_SUCCESS" as const,
    payload: {
      period: {
        data,
        error: {
          isError: false,
          ErrorType: null,
          ErrorMessage: null,
        },
      },
    },
  };
}

/********Fail Case**************/
export function failed(type: FAILED, message: string) {
  return {
    type,
    message,
  };
}

// Fail Cases
type FAILED = "FETCH_RECORD_FAILED";

type periodActionCreator =
  | typeof markPageLoading
  | typeof fetchRecordSuccess
  | typeof failed;
export type IPeriodActions = ReturnType<periodActionCreator>;
