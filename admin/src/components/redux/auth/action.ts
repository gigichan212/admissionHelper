import { ThunkDispatch } from "../../../store";

//Actions
export function loginRequested() {
  return {
    type: "@@auth/loginRequested" as const,
  };
}

export function loginSuccess(token: string, userId: number, role: string) {
  return {
    type: "@@auth/loginSuccess" as const,
    payload: {
      login: {
        token,
        userId,
        role,
      },
    },
  };
}

export function loginFailed(error?: string) {
  return {
    type: "@@auth/loginFailed" as const,
    error,
  };
}

export function loginEnded() {
  return {
    type: "@@auth/loginEnded" as const,
  };
}

export function logoutSuccess() {
  return {
    type: "@@auth/logoutSuccess" as const,
  };
}

export type userRoleActions = ReturnType<
  typeof loginRequested | typeof loginSuccess | typeof loginFailed | typeof loginEnded | typeof logoutSuccess
>;

//Thunk action
export function login(username: string, password: string) {
  return async (dispatch: ThunkDispatch) => {
    try {
      //Start loading
      dispatch(loginRequested());

      //Check if the user exist and return a jwt
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const resData = await res.json();

      //If have token, store the information in our store and local storage
      if (resData.token) {
        dispatch(loginSuccess(resData.token, resData.userId, resData.role));
        localStorage.setItem("token", resData.token);
      } else {
        dispatch(loginFailed(resData.message));
      }
    } catch (error) {
      dispatch(loginFailed(error.message));
    } finally {
      dispatch(loginEnded());
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
      `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/user/currentUser`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const resData = await res.json();

    //If auth, log the user in
    if (resData.id) {
      dispatch(loginSuccess(token, resData.id, resData.role));
    } else {
      dispatch(logoutSuccess());
    }
  };
}

export function logout() {
  return (dispatch: ThunkDispatch) => {
    localStorage.removeItem("token");
    dispatch(logoutSuccess());
  };
}
