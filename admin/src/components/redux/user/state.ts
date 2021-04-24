export interface User {
  id: number | null;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
  updated_user?: string;
}

export interface UserState {
  payload: {
    currentUser?: {
      id: number | null;
      username: string;
      role: string;
      created_at: string;
      updated_at: string;
      updated_user?: string;
      error?: string;
    };
    edit: {
      userId: number | null;
      isEditShow: boolean;
      isUpdated?: boolean | null;
      error?: string;
    };
    record: {
      offset: number | null;
      limit: number;
      isLoading?: boolean;
      recordCount: number | null;
      users: User[];
      currentPage: number;
    };
    delete: {
      isDeleted?: boolean;
      error?: string;
    };
    add: {
      isAdded?: boolean;
      error?: string;
    };
  };
}
