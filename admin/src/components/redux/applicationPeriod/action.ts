import { RootState, ThunkDispatch } from "../../../store";
import { recordType } from "./reducer";

//action creator
export function requestPeriodsRecord() {
  return {
    type: "@@applicationPeriod/recordIsLoading" as const,
  };
}

export function appPeriodsReceived(recordCount: number, record: []) {
  return {
    type: "@@applicationPeriod/recordReceived" as const,
    payload: {
      record: {
        record,
        recordCount,
      },
    },
  };
}

export function requestEnded() {
  return {
    type: "@@applicationPeriod/requestEnded" as const,
  };
}

export function setCurrentPage(page: number) {
  return {
    type: "@@applicationPeriod/setCurrentPage" as const,
    payload: {
      record: {
        currentPage: page,
      },
    },
  };
}

//Edit action creator
export function setShowEdit(id: number | null, isDivShow: boolean) {
  return {
    type: "@@applicationPeriod/showEditDiv" as const,
    payload: {
      edit: {
        id,
        isDivShow,
      },
    },
  };
}

export function editRequested() {
  return {
    type: "@@applicationPeriod/editRequested" as const,
  };
}

export function editRequestEnded() {
  return {
    type: "@@applicationPeriod/editRequestEnded" as const,
  };
}

export function editSuccess(data: recordType) {
  return {
    type: "@@applicationPeriod/editSuccess" as const,
    data,
  };
}

export function editIsSuccess() {
  return {
    type: "@@applicationPeriod/editIsSuccess" as const,
  };
}

//Add request action creator
export function addRequested() {
  return {
    type: "@@applicationPeriod/addRequested" as const,
  };
}

export function addRequestEnded() {
  return {
    type: "@@applicationPeriod/addRequestEnded" as const,
  };
}

export function addSuccess(data: recordType) {
  return {
    type: "@@applicationPeriod/addSuccess" as const,
    data,
  };
}

export function addIsSuccess() {
  return {
    type: "@@applicationPeriod/addIsSuccess" as const,
  };
}

//Have application record action creator
export function haveRecordRequested() {
  return {
    type: "@@applicationPeriod/haveRecordIsLoading" as const,
  };
}

export function haveRequestEnded() {
  return {
    type: "@@applicationPeriod/haveRequestEnded" as const,
  };
}

export function haveRequestReceived(haveRecord: boolean, count: string) {
  return {
    type: "@@applicationPeriod/haveRecordReceived" as const,
    payload: {
      edit: {
        haveRecord,
        count,
      },
    },
  };
}

// 3. Fail
export function requestFailed(type: FAILED, error?: string) {
  return {
    type,
    error,
  };
}

type FAILED = "@@applicationPeriod/addFailed" | "@@applicationPeriod/editFailed" | "@@applicationPeriod/requestFailed";

export type ApplicationPeriodActions =
  | ReturnType<typeof requestPeriodsRecord>
  | ReturnType<typeof appPeriodsReceived>
  | ReturnType<typeof requestEnded>
  | ReturnType<typeof setCurrentPage>
  | ReturnType<typeof setShowEdit>
  | ReturnType<typeof haveRecordRequested>
  | ReturnType<typeof haveRequestEnded>
  | ReturnType<typeof haveRequestReceived>
  | ReturnType<typeof editRequested>
  | ReturnType<typeof editRequestEnded>
  | ReturnType<typeof editSuccess>
  | ReturnType<typeof editIsSuccess>
  | ReturnType<typeof addRequested>
  | ReturnType<typeof addRequestEnded>
  | ReturnType<typeof addSuccess>
  | ReturnType<typeof addIsSuccess>
  | ReturnType<typeof requestFailed>;

//thunk action
export const loadApplicationPeriod = (limit = 50, offset = 0) => ({
  type: "apiRequest",
  meta: {
    url: `/dashboard/application-period?limit=${limit}&offset=${offset}`,
    failType: "@@applicationPeriod/requestFailed",
    successType: "GET_ALL_DATA_WITH_COUNT",
    onLoad: () => requestPeriodsRecord(),
    onSuccess: (count: number, data: []) => appPeriodsReceived(count, data),
    onFail: (type: FAILED, error: string) => requestFailed(type, error),
    onEnd: () => requestEnded(),
  },
});

export const checkHaveRecord = (periodId: number) => ({
  type: "apiRequest",
  meta: {
    url: `/dashboard/application-period/have-app-record/${periodId}`,
    failType: "@@applicationPeriod/requestFailed",
    successType: "HAVE_RECORD",
    onLoad: () => haveRecordRequested(),
    onSuccess: (haveRecord: boolean, count: string) => haveRequestReceived(haveRecord, count),
    onFail: (type: FAILED, error: string) => requestFailed(type, error),
    onEnd: () => haveRequestEnded(),
  },
});

//Send edit application period request
export const editPeriod = (data: any) => ({
  type: "apiRequest",
  payload: data,
  meta: {
    url: `/dashboard/application-period/${data.id}`,
    fetchType: "PUT",
    failType: "@@applicationPeriod/editFailed",
    successType: "UPDATE_PERIOD",
    onLoad: () => editRequested(),
    onSuccess: (res: recordType) => editSuccess(res),
    onFail: (type: FAILED, error: string) => requestFailed(type, error),
    onEnd: () => editRequestEnded(),
  },
});

//Send add application period request
export const addPeriod = (data: any) => ({
  type: "apiRequest",
  payload: data,
  meta: {
    url: `/dashboard/application-period`,
    fetchType: "POST",
    failType: "@@applicationPeriod/addFailed",
    onLoad: () => addRequested(),
    onSuccess: (res: recordType) => addSuccess(res),
    onFail: (type: FAILED, error: string) => requestFailed(type, error),
    onEnd: () => addRequestEnded(),
  },
});
