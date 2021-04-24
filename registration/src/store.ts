// Redux
import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { authState } from "./redux/auth/state";
import { authReducer } from "./redux/auth/reducers";
// Window History
import { createBrowserHistory } from "history";
import {
  routerMiddleware,
  CallHistoryMethodAction,
  RouterState,
  connectRouter,
} from "connected-react-router";
// Redux logger
import logger from "redux-logger";
import { IAuthActions } from "./redux/auth/actions";
import { IApplicationState } from "./redux/application/state";
import { applicationReducer } from "./redux/application/reducers";
//redux-thunk
import thunk, { ThunkDispatch as OldThunkDispatch } from "redux-thunk";
import { IApplicationActions } from "./redux/application/actions";
import { IPeriodActions } from "./redux/period/actions";
import { periodReducer } from "./redux/period/reducers";
import { IPeriodState } from "./redux/period/state";

export const history = createBrowserHistory();

// Combining State by Composition
export interface IRootState {
  auth: authState;
  application: IApplicationState;
  period: IPeriodState;
  router: RouterState;
}

// Combining Actions by Union
type IRootAction =
  | IAuthActions
  | IApplicationActions
  | IPeriodActions
  | CallHistoryMethodAction;

// Combining Reducers by the function combineReducer()
const rootReducer = combineReducers<IRootState>({
  auth: authReducer,
  application: applicationReducer,
  period: periodReducer,
  router: connectRouter(history),
});

// for debugger
declare global {
  /* tslint:disable:interface-name */
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//ThunkDispatch
export type ThunkDispatch = OldThunkDispatch<IRootState, null, IRootAction>;

export const store = createStore<IRootState, IRootAction, {}, {}>(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, routerMiddleware(history), logger))
);
