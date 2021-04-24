import { AuthState } from "./state";
import { userRoleActions } from "./action";
import produce from "immer";

const initialState: AuthState = {
  payload: {
    login: {
      isAuth: null,
      userId: null,
      token: "",
      role: "",
    },
  },
};

export function authReducer(state: AuthState = initialState, action: userRoleActions): AuthState {
  switch (action.type) {
    case "@@auth/loginRequested":
      return produce(state, (state) => {
        state.payload.login.isLoading = true;
      });
    case "@@auth/loginSuccess":
      return produce(state, (state) => {
        state.payload.login.isAuth = true;
        state.payload.login = { ...state.payload.login, ...action.payload.login };
      });
    case "@@auth/loginEnded":
      return produce(state, (state) => {
        state.payload.login.isLoading = false;
      });
    case "@@auth/loginFailed":
      return produce(state, (state) => {
        state.payload.login.isAuth = false;
        state.payload.login.userId = null;
        state.payload.login.role = "";
        state.payload.login.token = "";
        state.payload.login.error = action.error;
      });
    case "@@auth/logoutSuccess":
      return produce(state, (state) => {
        state.payload.login.isAuth = false;
        state.payload.login.userId = null;
        state.payload.login.role = "";
        state.payload.login.token = "";
      });
    default:
      return state;
  }
}
