import { RootState, ThunkDispatch } from "../../../store";
import { form } from "../../application/SearchBar";

//action creator
export function isLoading(isLoading: boolean) {
  return {
    type: "@@email/recordIsLoading" as const,
    payload: {
      record: {
        isLoading,
      },
    },
  };
}

export function setRecordLimit(limit: number, offset?: number) {
  return {
    type: "@@email/setLimit" as const,
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
    type: "@@email/setCurrentPage" as const,
    payload: {
      record: {
        currentPage: page,
      },
    },
  };
}

export function recordReceived(recordCount: number, record: []) {
  return {
    type: "@@email/recordReceived" as const,
    payload: {
      record: {
        record,
        recordCount,
      },
    },
  };
}
//Save search data in store
export function saveSearchData(data?: any) {
  return {
    type: "@@email/saveSearchData" as const,
    data,
  };
}

export function fetchFailed(error?: string) {
  return {
    type: "@@email/fetchFailed" as const,
    error,
  };
}

export function setShowEdit(id: number | null, isDivShow: boolean) {
  return {
    type: "@@email/showEditDiv" as const,
    payload: {
      edit: {
        id,
        isDivShow,
      },
    },
  };
}

export type EmailActions =
  | ReturnType<typeof isLoading>
  | ReturnType<typeof setRecordLimit>
  | ReturnType<typeof setCurrentPage>
  | ReturnType<typeof recordReceived>
  | ReturnType<typeof saveSearchData>
  | ReturnType<typeof setShowEdit>
  | ReturnType<typeof fetchFailed>;

//thunk action
export const fetchRecord = (limit: number, offset: number) => ({
  type: "apiRequest",
  payload: { limit, offset },
  meta: {
    url: `/dashboard/email/isWithSearch/false`,
    fetchType: "POST",
    successType: "GET_ALL_DATA_WITH_COUNT",
    onLoad: () => isLoading(true),
    onSuccess: (count: number, data: []) => recordReceived(count, data),
    onFail: (error: string) => fetchFailed(error),
    onEnd: () => isLoading(false),
  },
});

// For searching
export const searchEmail = (limit: number, offset: number, data: form) => ({
  type: "apiRequest",
  payload: { limit, offset, data },
  meta: {
    url: `/dashboard/email/isWithSearch/true`,
    fetchType: "POST",
    successType: "SEARCH_EMAIL",
    onLoad: () => isLoading(true),
    onSuccess: (count: number, data: []) => recordReceived(count, data),
    onSuccess2: (data: form) => saveSearchData(data),
    onFail: (error: string) => fetchFailed(error),
    onEnd: () => isLoading(false),
  },
});
