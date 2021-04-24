import { batchUpdateInterface } from "./thunkAction";

// 1. Loading
export function markListIsLoading(isLoading: boolean) {
  return {
    type: "@@application/markListIsLoading" as const,
    payload: {
      record: {
        isLoading,
      },
    },
  };
}
export function markSingleIsLoading(isLoading: boolean) {
  return {
    type: "@@application/markSingleIsLoading" as const,
    payload: {
      singleRecord: {
        isLoading,
      },
    },
  };
}
export function markImageIsLoading(imageIsLoading: boolean) {
  return {
    type: "@@application/markImageIsLoading" as const,
    payload: {
      singleRecord: {
        imageIsLoading,
      },
    },
  };
}
export function markAddApplicationIsLoading(isAddApplicationLoading: boolean) {
  return {
    type: "@@application/markAddApplicationIsLoading" as const,
    payload: {
      singleRecord: {
        isAddApplicationLoading,
      },
    },
  };
}
export function markBatchUpdateIsLoading(isLoading: boolean) {
  return {
    type: "@@application/markBatchUpdateIsLoading" as const,
    payload: {
      container: {
        batchUpdate: {
          isLoading,
        },
      },
    },
  };
}

// 2. Success
// Application list
export function setSelectedApp(selected: number[] | number) {
  return {
    type: "@@application/setSelectedApp" as const,
    payload: {
      record: {
        selected,
      },
    },
  };
}

export function setRecordSortBy(sortBy: string) {
  return {
    type: "@@application/setSortBy" as const,
    payload: {
      record: {
        sortBy,
      },
    },
  };
}

export function setRecordLimit(limit: number, offset?: number) {
  return {
    type: "@@application/setLimit" as const,
    payload: {
      record: {
        limit,
        offset,
      },
    },
  };
}

export function setCurrentPage(page: number) {
  return {
    type: "@@application/setCurrentPage" as const,
    payload: {
      record: {
        currentPage: page,
      },
    },
  };
}

export function listRecordReceived(recordCount: number, record: any[]) {
  return {
    type: "@@application/listRecordReceived" as const,
    payload: {
      record: {
        record,
        recordCount,
      },
    },
  };
}

//Save search data in store
export function saveSearchData(data?: {}) {
  return {
    type: "@@application/saveSearchData" as const,
    data,
  };
}

//Batch update
export function batchUpdateSuccess(
  data: batchUpdateInterface,
  recordCount?: number,
  failRecordCount?: number,
  failEmailRecord?: string[]
) {
  return {
    type: "@@application/batchUpdateSuccess" as const,
    data,
    recordCount,
    failRecordCount,
    failEmailRecord,
  };
}

export function setIsUpdated(isUpdated?: boolean) {
  return {
    type: "@@application/setIsUpdated" as const,
    isUpdated,
  };
}

//received excel record
export function fetchExcelDataSuccess(excelRecord: any) {
  return {
    type: "@@application/fetchExcelDataSuccess" as const,
    payload: {
      record: {
        excelRecord,
      },
    },
  };
}

//Control if container is show
export function setIsShow(container: string, isShow: boolean) {
  return {
    type: "@@application/setIsShow" as const,
    payload: {
      container,
      isShow,
    },
  };
}

// Single record
export function singleRecordReceived(recordCount: number, record: any) {
  return {
    type: "@@application/singleRecordReceived" as const,
    payload: {
      singleRecord: {
        record,
        recordCount,
      },
    },
  };
}
export function addApplicationSuccess() {
  return {
    type: "@@application/addApplicationSuccess" as const,
  };
}
export function addApplicationSuccessFinished() {
  return {
    type: "@@application/addApplicationSuccessFinished" as const,
  };
}
export function putApplicationSuccess() {
  return {
    type: "@@application/putApplicationSuccess" as const,
  };
}
export function putApplicationSuccessFinished() {
  return {
    type: "@@application/putApplicationSuccessFinished" as const,
  };
}
export function getSingleRecordInitialState() {
  return {
    type: "@@application/getSingleRecordInitialState" as const,
  };
}

export function showModalImage(isShow: boolean, modalImage: string | null) {
  return {
    type: "@@application/showModalImage" as const,
    payload: {
      singleRecord: {
        showModalImage: {
          isShow: isShow,
          modalImage: modalImage,
        },
      },
    },
  };
}

// 3. Fail
export function failed(type: FAILED, message: string) {
  return {
    type,
    message,
  };
}

export function resetError(errorType: FAILED) {
  return {
    type: "@@application/resetError" as const,
    errorType,
  };
}

export type FAILED =
  | "FETCH_LIST_APPLICATION_FAILED"
  | "FETCH_SINGLE_APPLICATION_NOT_FOUND"
  | "FETCH_SINGLE_APPLICATION_FAILED"
  | "ADD_APPLICATION_FAILED_MISSING_CONTENT"
  | "ADD_APPLICATION_FAILED_EXPIRED_PERIOD"
  | "ADD_APPLICATION_FAILED"
  | "PUT_APPLICATION_FAILED_MISSING_CONTENT"
  | "PUT_APPLICATION_FAILED_EXPIRED_PERIOD" // remove this later
  | "PUT_APPLICATION_FAILED"
  | "BATCH_UPDATE_APPLICATIONS_FAILED"
  | "BATCH_UPDATE_APPLICATIONS_FAILED_NO_FOUND"
  | "SEARCH_APPLICATIONS_FAILED";

type applicationActionCreator =
  | typeof markListIsLoading
  | typeof setRecordLimit
  | typeof setCurrentPage
  | typeof listRecordReceived
  | typeof markSingleIsLoading
  | typeof markImageIsLoading
  | typeof markAddApplicationIsLoading
  | typeof singleRecordReceived
  | typeof showModalImage
  | typeof getSingleRecordInitialState
  | typeof addApplicationSuccess
  | typeof addApplicationSuccessFinished
  | typeof putApplicationSuccess
  | typeof putApplicationSuccessFinished
  | typeof failed
  | typeof setRecordSortBy
  | typeof setSelectedApp
  | typeof batchUpdateSuccess
  | typeof fetchExcelDataSuccess
  | typeof markBatchUpdateIsLoading
  | typeof setIsUpdated
  | typeof setIsShow
  | typeof saveSearchData
  | typeof resetError;

export type ApplicationActions = ReturnType<applicationActionCreator>;
