export interface authState {
  isLoading: boolean;
  isAuth: boolean;
  applicationId: number | null;
  token: string;
  loginEmailSent: boolean;
  effect?: {
    isLoginSuccess?: boolean;
    isLogoutSuccess?: boolean;
  };
  error: {
    isError: boolean;
    ErrorType: string | null;
    ErrorMessage: string | null;
  };
}
