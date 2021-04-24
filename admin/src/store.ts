import { connectRouter, routerMiddleware, RouterState } from "connected-react-router";
import { createBrowserHistory } from "history";
import { AnyAction, applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk, { ThunkDispatch as OldThunkDispatch } from "redux-thunk";
// Redux logger
// import logger from "redux-logger";
import { AuthState } from "./components/redux/auth/state";
// Reducer/ State
import { applicationReducer } from "./components/redux/application/reducer";
import { navBarReducer } from "./components/redux/navigation/reducer";
import { NavBarState } from "./components/redux/navigation/state";
import { applicationPeriodReducer, ApplicationPeriodState } from "./components/redux/applicationPeriod/reducer";
import { authReducer } from "./components/redux/auth/reducer";
import { UserState } from "./components/redux/user/state";
import { userReducer } from "./components/redux/user/reducer";
import { WebContentState } from "./components/redux/webContent/state";
import { webContentReducer } from "./components/redux/webContent/reducer";
import { emailReducer, EmailState } from "./components/redux/email/reducer";
import { ApplicationState } from "./components/redux/application/state";
import apiMiddleware from "./components/redux/middlewares/api";

export type ThunkDispatch = OldThunkDispatch<RootState, null, AnyAction>;

export const history = createBrowserHistory();

export interface RootState {
  application: ApplicationState;
  email: EmailState;
  navBar: NavBarState;
  applicationPeriod: ApplicationPeriodState;
  user: UserState;
  auth: AuthState;
  webContent: WebContentState;
  router: RouterState;
}

const reducer = combineReducers({
  application: applicationReducer,
  email: emailReducer,
  navBar: navBarReducer,
  applicationPeriod: applicationPeriodReducer,
  user: userReducer,
  auth: authReducer,
  webContent: webContentReducer,
  router: connectRouter(history),
});

//For redux devtool Trace
// window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//   trace: true, // (action) => { return ‘trace as string’; }
//   traceLimit: 25,
// });

// for debugger
declare global {
  /* tslint:disable:interface-name */
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//Without dev tool
// const composeEnhancers = compose;

export default createStore(
  reducer,
  composeEnhancers(
    // applyMiddleware(logger),
    applyMiddleware(apiMiddleware),
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(history))
  )
);
