import { push } from "connected-react-router";
import { ThunkDispatch } from "../../store";

// About page loading
export function markLoading(isLoading: boolean) {
  return {
    type: "@@AUTH/MARK_LOADING" as const,
    isLoading,
  };
}

// Fail case
export function failed(type: FAILED, message: string) {
  return {
    type,
    message,
  };
}

// success cases
export function sendLoginEmailSuccess(loginEmailSent: boolean) {
  return {
    type: "@@AUTH/SEND_LOGIN_EMAIL_SUCCESS" as const,
    loginEmailSent,
  };
}
export function sendLoginEmailSuccessFinished(loginEmailSent: boolean) {
  return {
    type: "@@AUTH/SEND_LOGIN_EMAIL_SUCCESS_FINISHED" as const,
    loginEmailSent,
  };
}

export function loginSuccess(token: string, applicationId: number) {
  return {
    type: "@@AUTH/LOGIN_SUCCESS" as const,
    token,
    applicationId,
  };
}

export function logoutSuccess() {
  return {
    type: "@@AUTH/LOGOUT_SUCCESS" as const,
  };
}

export function loginSuccessEffect(isLoginSuccess: boolean) {
  return {
    type: "@@AUTH/LOGIN_SUCCESS_EFFECT" as const,
    effect: {
      isLoginSuccess: isLoginSuccess,
    },
  };
}
export function logoutSuccessEffect(isLogoutSuccess: boolean) {
  return {
    type: "@@AUTH/LOGOUT_SUCCESS_EFFECT" as const,
    effect: {
      isLogoutSuccess: isLogoutSuccess,
    },
  };
}
/**********************************************Thunk Action ************************************************/
// check login info and send login email
export function login(applicationIdWithPrefix: string, email: string) {
  return async (dispatch: ThunkDispatch) => {
    try {
      // Mark page loading
      dispatch(markLoading(true));

      // fetch post api
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/public/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicationIdWithPrefix,
            email,
          }),
        }
      );
      const result = await res.json();

      if (result.isSuccess) {
        dispatch(sendLoginEmailSuccess(true));
      } else if (result.message === "Missing application id/ email") {
        dispatch(failed("LOGIN_FAILED_MISSING_CONTENT", result.message));
      } else if (result.message === "Application id/ email incorrect") {
        dispatch(failed("LOGIN_FAILED_UNAUTHORIZED", result.message));
      } else {
        dispatch(failed("LOGIN_FAILED", result.message));
      }
    } catch (err) {
      dispatch(failed("LOGIN_FAILED", err.message));
    } finally {
      // Mark page finish loading
      dispatch(markLoading(false));
    }
  };
}

// get login request token and login
export function loginFromEmail(token: string) {
  return async (dispatch: ThunkDispatch) => {
    try {
      // Mark page loading
      dispatch(markLoading(true));

      // fetch api
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/public/login/token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();

      if (result.isSuccess) {
        dispatch(loginSuccess(result.token, result.applicationId));
        localStorage.setItem("token", result.token);
        dispatch(push("/edit"));

        // about login effect
        dispatch(loginSuccessEffect(true));
        setTimeout(() => {
          dispatch(loginSuccessEffect(false));
        }, 3000);
      } else if (result.message === "Missing application id/ email") {
        dispatch(failed("LOGIN_FAILED_MISSING_CONTENT", result.message));
      } else if (result.message === "Application id/ email incorrect") {
        dispatch(failed("LOGIN_FAILED_UNAUTHORIZED", result.message));
      } else {
        dispatch(failed("LOGIN_FAILED", result.message));
      }
    } catch (err) {
      dispatch(failed("LOGIN_FAILED", err.message));
    } finally {
      // Mark page finish loading
      dispatch(markLoading(false));
    }
  };
}

export function checkLogin() {
  return async (dispatch: ThunkDispatch) => {
    //Get token from local storage (check if it has already logged in)
    const token = localStorage.getItem("token");

    if (token == null) {
      dispatch(logoutSuccess());
      return;
    }

    //Check if the token is our token
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/public/user/currentParentUser`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await res.json();

    //If auth, log the user in
    if (result.id) {
      dispatch(loginSuccess(token, result.id));
    } else {
      dispatch(logoutSuccess());
    }
  };
}

// logout
export function logout() {
  return (dispatch: ThunkDispatch) => {
    localStorage.removeItem("token");
    dispatch(logoutSuccess());

    // about logout effect
    dispatch(logoutSuccessEffect(true));
    setTimeout(() => {
      dispatch(logoutSuccessEffect(false));
    }, 3000);
  };
}

// Fail Cases
type FAILED =
  | "LOGIN_FAILED"
  | "LOGIN_FAILED_MISSING_CONTENT"
  | "LOGIN_FAILED_UNAUTHORIZED";
type AuthActionCreators =
  | typeof markLoading
  | typeof sendLoginEmailSuccess
  | typeof sendLoginEmailSuccessFinished
  | typeof loginSuccess
  | typeof loginSuccessEffect
  | typeof logoutSuccess
  | typeof logoutSuccessEffect
  | typeof failed;
export type IAuthActions = ReturnType<AuthActionCreators>;
