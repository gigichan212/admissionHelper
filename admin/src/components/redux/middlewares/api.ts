import { checkLogin } from "../auth/action";

const apiMiddleware = ({ dispatch, getState }: any) => (next: any) => async (action: any) => {
  //Only handle api request action
  if (action.type !== "apiRequest") {
    return next(action);
  }

  // Find the request URL and compose request options from meta
  const { url, onLoad, onSuccess, onFail, onEnd, failType, fetchType, successType, onSuccess2 } = action.meta;
  const { payload } = action;

  try {
    // This is an api request
    dispatch(onLoad());

    // Make the request
    let res;

    //Add method if have fetch type (PUT, DELETE, POST)
    //Else, just add header
    if (fetchType) {
      res = await fetch(`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}${url}`, {
        method: fetchType,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getState().auth.payload.login.token,
        },
        body: JSON.stringify({
          ...payload,
        }),
      });
    } else {
      res = await fetch(`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}${url}`, {
        headers: {
          Authorization: "Bearer " + getState().auth.payload.login.token,
        },
      });
    }

    const resData = await res.json();

    //If have correct response, dispatch success action
    //Check fetch type and success type for success action parameter
    if (resData.status === 200) {
      if (successType === "UPDATE_USER" && payload.username) {
        dispatch(
          onSuccess(action.id, {
            username: payload.username,
            updated_at: resData.updated_at,
            updated_user: resData.updated_user,
          })
        );
      }

      switch (successType) {
        case "UPDATE_USER":
          dispatch(onSuccess2(action.id, { updated_at: resData.updated_at, updated_user: resData.updated_user }));
          break;
        case "DELETE_USER":
          dispatch(onSuccess(action.id));
          break;
        case "UPDATE_PERIOD":
          dispatch(onSuccess({ ...payload, updated_at: resData.updated_at }));
          break;
        case "GET_ALL_DATA_WITH_COUNT":
          dispatch(onSuccess(resData.count, resData.data));
          break;
        case "HAVE_RECORD":
          dispatch(onSuccess(resData.haveRecord, resData.count));
          break;
        case "SEARCH_EMAIL":
          dispatch(onSuccess2(payload));
          dispatch(onSuccess(resData.count, resData.data));
          break;
        default:
          dispatch(onSuccess(resData.data));
          break;
      }
    } else {
      dispatch(onFail(failType, resData.message));
    }
  } catch (e) {
    dispatch(checkLogin());
    dispatch(onFail(failType, e));
  } finally {
    dispatch(onEnd());
  }
};

export default apiMiddleware;
