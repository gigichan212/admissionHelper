export interface AuthState {
  payload: {
    login: {
      isLoading?: boolean;
      isAuth: boolean | null;
      userId: number | null;
      token: string;
      role: string;
      error?: string;
    };
  };
}
