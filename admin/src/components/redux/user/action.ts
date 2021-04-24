import { RootState, ThunkDispatch } from "../../../store";
import { addUserForm } from "../../account/AccountAdmin";
import { User } from "./state";

export function getSingleUserFailed(error?: string) {
  return {
    type: "@@user/getSingleUserFailed" as const,
    error,
  };
}

export function addCurrentUser(user: User) {
  return {
    type: "@@user/addCurrentUser" as const,
    user,
  };
}

export function userIsAdded(isAdded?: boolean) {
  return {
    type: "@@user/userIsAdded" as const,
    isAdded,
  };
}

export function addFailed(error?: string) {
  return {
    type: "@@user/addFailed" as const,
    error,
  };
}

export function addSuccess(user: User) {
  return {
    type: "@@user/addSuccess" as const,
    user,
  };
}

export function userIsDeleted(isDeleted?: boolean) {
  return {
    type: "@@user/userIsDeleted" as const,
    isDeleted,
  };
}

export function deleteFailed(error?: string) {
  return {
    type: "@@user/deleteFailed" as const,
    error,
  };
}

export function deleteSuccess(id: number) {
  return {
    type: "@@user/deleteSuccess" as const,
    id,
  };
}

export function updateFailed(error?: string) {
  return {
    type: "@@user/updateFailed" as const,
    error,
  };
}

export function updateIsSuccess() {
  return {
    type: "@@user/updateIsSuccess" as const,
  };
}

export function updateSuccess(id: number, data: { username?: string; updated_at: string; updated_user: string }) {
  return {
    type: "@@user/updateSuccess" as const,
    id,
    data,
  };
}

export function isEditShow(userId: number | null, isEditShow: boolean) {
  return {
    type: "@@user/isEditShow" as const,
    payload: {
      userId,
      isEditShow,
    },
  };
}

export function isLoading(isLoading: boolean) {
  return {
    type: "@@user/recordIsLoading" as const,
    payload: {
      record: {
        isLoading,
      },
    },
  };
}

export function setRecordLimit(limit: number, offset: number) {
  return {
    type: "@@user/setLimit" as const,
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
    type: "@@user/setCurrentPage" as const,
    payload: {
      record: {
        currentPage: page,
      },
    },
  };
}

export function recordReceived(recordCount: number, users: []) {
  return {
    type: "@@user/recordReceived" as const,
    payload: {
      record: {
        users,
        recordCount,
      },
    },
  };
}

export function fetchFailed(error: string) {
  return {
    type: "@@user/fetchFailed" as const,
    error,
  };
}

export type UserActions =
  | ReturnType<typeof isEditShow>
  | ReturnType<typeof isLoading>
  | ReturnType<typeof setRecordLimit>
  | ReturnType<typeof setCurrentPage>
  | ReturnType<typeof recordReceived>
  | ReturnType<typeof updateSuccess>
  | ReturnType<typeof updateIsSuccess>
  | ReturnType<typeof updateFailed>
  | ReturnType<typeof deleteFailed>
  | ReturnType<typeof deleteSuccess>
  | ReturnType<typeof userIsDeleted>
  | ReturnType<typeof userIsAdded>
  | ReturnType<typeof addFailed>
  | ReturnType<typeof addSuccess>
  | ReturnType<typeof addCurrentUser>
  | ReturnType<typeof getSingleUserFailed>;

//thunk action
export const fetchRecord = (limit: number, offset: number) => ({
  type: "apiRequest",
  meta: {
    url: `/dashboard/user/allUsers?limit=${limit}&offset=${offset}`,
    successType: "GET_ALL_DATA_WITH_COUNT",
    onLoad: () => isLoading(true),
    onSuccess: (count: number, data: []) => recordReceived(count, data),
    onFail: (error: string) => fetchFailed(error),
    onEnd: () => isLoading(false),
  },
});

export const fetchSingleUser = (id: number) => ({
  type: "apiRequest",
  meta: {
    url: `/dashboard/user/${id}`,
    onLoad: () => isLoading(true),
    onSuccess: (data: any) => addCurrentUser(data),
    onFail: (error: string) => getSingleUserFailed(error),
    onEnd: () => isLoading(false),
  },
});

export const editUser = (
  id: number,
  info: { username?: string; password?: string; old_password?: string; updated_user_id: number }
) => ({
  type: "apiRequest",
  payload: info,
  id: id,
  meta: {
    url: `/dashboard/user/${id}`,
    fetchType: "PUT",
    successType: "UPDATE_USER",
    onLoad: () => isLoading(true),
    onSuccess: (id: any, data: { username: string; updated_at: string; updated_user: string }) =>
      updateSuccess(id, data),
    onSuccess2: (id: any, data: any) =>
      updateSuccess(id, { updated_at: data.updated_at, updated_user: data.updated_user }),
    onFail: (error: string) => updateFailed(error),
    onEnd: () => isLoading(false),
  },
});

export const deleteUser = (id: number) => ({
  type: "apiRequest",
  id: id,
  meta: {
    url: `/dashboard/user/${id}`,
    fetchType: "DELETE",
    successType: "DELETE_USER",
    onLoad: () => isLoading(true),
    onSuccess: (id: number) => deleteSuccess(id),
    onFail: (error: string) => deleteFailed(error),
    onEnd: () => isLoading(false),
  },
});

export const addUser = (userInfo: addUserForm, updated_user_id: number) => ({
  type: "apiRequest",
  payload: { updated_user_id, ...userInfo },
  meta: {
    url: `/dashboard/user/newUser`,
    fetchType: "POST",
    onLoad: () => isLoading(true),
    onSuccess: (data: any) => addSuccess(data),
    onFail: (error: string) => addFailed(error),
    onEnd: () => isLoading(false),
  },
});
