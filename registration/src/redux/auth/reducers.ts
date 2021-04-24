import { IAuthActions } from "./actions";
import { authState } from "./state";

const initialState: authState = {
  isLoading: false,
  isAuth: false,
  applicationId: null,
  token: "",
  loginEmailSent: false,
  effect: {
    isLoginSuccess: false,
    isLogoutSuccess: false,
  },
  error: {
    isError: false,
    ErrorType: null,
    ErrorMessage: null,
  },
};

export const authReducer = (
  previousState: authState = initialState,
  action: IAuthActions
): authState => {
  switch (action.type) {
    // loading
    case "@@AUTH/MARK_LOADING":
      return {
        ...previousState,
        isLoading: action.isLoading,
      };

    // Success
    case "@@AUTH/SEND_LOGIN_EMAIL_SUCCESS":
    case "@@AUTH/SEND_LOGIN_EMAIL_SUCCESS_FINISHED":
      return {
        ...previousState,
        loginEmailSent: action.loginEmailSent,
        error: {
          isError: false,
          ErrorType: null,
          ErrorMessage: null,
        },
      };
    case "@@AUTH/LOGIN_SUCCESS":
      return {
        ...previousState,
        isAuth: true,
        applicationId: action.applicationId,
        token: action.token,
        loginEmailSent: false,
        error: {
          isError: false,
          ErrorType: null,
          ErrorMessage: null,
        },
      };
    case "@@AUTH/LOGIN_SUCCESS_EFFECT":
      return {
        ...previousState,
        effect: {
          isLoginSuccess: action.effect.isLoginSuccess,
        },
      };

    case "@@AUTH/LOGOUT_SUCCESS":
      return {
        ...previousState,
        isAuth: false,
        applicationId: null,
        token: "",
        loginEmailSent: false,
        error: {
          isError: false,
          ErrorType: null,
          ErrorMessage: null,
        },
      };
    case "@@AUTH/LOGOUT_SUCCESS_EFFECT":
      return {
        ...previousState,
        effect: {
          isLogoutSuccess: action.effect.isLogoutSuccess,
        },
      };

    // Fail cases
    case "LOGIN_FAILED_MISSING_CONTENT":
      return {
        ...previousState,
        error: {
          isError: true,
          ErrorType: action.type,
          ErrorMessage: action.message,
        },
      };
    case "LOGIN_FAILED_UNAUTHORIZED":
    case "LOGIN_FAILED":
      return {
        ...previousState,
        isAuth: false,
        applicationId: null,
        token: "",
        loginEmailSent: false,
        error: {
          isError: true,
          ErrorType: action.type,
          ErrorMessage: null,
        },
      };
    default:
      return previousState;
  }
};
