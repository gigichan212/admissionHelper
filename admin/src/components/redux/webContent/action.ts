import { RootState, ThunkDispatch } from "../../../store";

export function editWebContent(applicationType: string, webContent: string, webContentType: string) {
  return {
    type: "@@webContent/editWebContent",
    data: {
      [applicationType]: {
        [webContentType]: webContent,
      },
    },
  };
}

export function updateWebContent(data: any) {
  return {
    type: "@@webContent/updateWebContent",
    data: data,
  };
}

//thunk action

export function getWebContent() {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/webContent/`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getState().auth.payload.login.token,
        },
      }
    );
    const response = await res.json();
    if (response) {
      console.log(response);
      const toBeDispatched = response.data.map((element: any) => {
        return {
          [element.type]: {
            application_procedure: element.application_procedure,
            application_note: element.application_note,
            confirmation_letter: element.confirmation_letter,
            updated_at: element.updated_at,
          },
        };
      });
      toBeDispatched.forEach((element: any) => {
        dispatch(updateWebContent(element));
      });
    } else {
      console.log(response);
    }
  };
}

export function putWebContent(applicationType: string, webContent: string, webContentType: string) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_VERSION}/dashboard/webContent/studentType/${applicationType}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getState().auth.payload.login.token,
        },
        body: JSON.stringify({
          text: webContent,
          letter: webContentType,
        }),
      }
    );
    const response = await res.json();
    if (response) {
      alert("Update content success");
      dispatch(getWebContent());
    } else {
      alert("Update content failed");
    }
  };
}

export type webContentActions = ReturnType<typeof editWebContent>;
