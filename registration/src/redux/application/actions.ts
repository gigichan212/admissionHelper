import { IApplicationDataState } from "./state";

// About page loading
export function markApplicationLoading(isLoading: boolean) {
  return {
    type: "@@APPLICATION/MARK_APPLICATION_LOADING" as const,
    payload: {
      application: {
        isLoading,
      },
    },
  };
}

/********Success**************/
// About preview application form
export function addPreviewApplication(data: IApplicationDataState) {
  console.log(data.recent_photo);
  return {
    type: "@@APPLICATION/ADD_PREVIEW_APPLICATION" as const,
    payload: {
      application: {
        data,
        error: {
          isError: false,
          ErrorType: null,
          ErrorMessage: null,
        },
      },
    },
  };
}

// Insert Application record
export function addApplicationSuccess(
  applicationIdWithPrefix: number,
  createdAt: string
) {
  return {
    type: "@@APPLICATION/ADD_APPLICATION_SUCCESS" as const,
    payload: {
      application: {
        data: {
          applicationIdWithPrefix,
          createdAt,
        },
        resetForm: true,
        error: {
          isError: false,
          ErrorType: null,
          ErrorMessage: null,
        },
      },
    },
  };
}

// about App.tsx input file
export function addRecentPhotoPreview(selectedImage: FileList | null) {
  console.log("selectedImage: ", selectedImage);
  return {
    type: "@@APPLICATION/ADD_RECENT_PHOTO_PREVIEW" as const,
    payload: {
      application: {
        recentPhoto: {
          selectedImage,
        },
      },
    },
  };
}

// handle from step 2 back to step 1
export function backToStep1Success() {
  return {
    type: "@@APPLICATION/BACK_TO_STEP1_SUCCESS" as const,
  };
}

// set "fromstep1" to false (finished whole process of filling form)
export function addApplicationSuccessFinished() {
  return {
    type: "@@APPLICATION/ADD_APPLICATION_SUCCESS_FINISHED" as const,
  };
}

export function fetchApplicationSuccess(data: any) {
  return {
    type: "@@APPLICATION/FETCH_APPLICATION_SUCCESS" as const,
    payload: {
      application: {
        data,
        error: {
          isError: false,
          ErrorType: null,
          ErrorMessage: null,
        },
      },
    },
  };
}

export function getApplicationInitialState() {
  return {
    type: "@@APPLICATION/GET_APPLICATION_INITIAL_STATE" as const,
  };
}

// put Application
export function putApplicationSuccess() {
  return {
    type: "@@APPLICATION/PUT_APPLICATION_SUCCESS" as const,
  };
}
export function putApplicationSuccessFinished() {
  return {
    type: "@@APPLICATION/PUT_APPLICATION_SUCCESS_FINISHED" as const,
  };
}

export function showModalImage(isShow: boolean, modalImage: string | null) {
  return {
    type: "@@APPLICATION/SHOW_MODAL_IMAGE" as const,
    payload: {
      application: {
        showModalImage: {
          isShow: isShow,
          modalImage: modalImage,
        },
      },
    },
  };
}

/********Fail Case**************/
export function failed(type: FAILED, message: string) {
  return {
    type,
    message,
  };
}

// Fail Cases
type FAILED =
  | "ADD_APPLICATION_FAILED"
  | "ADD_APPLICATION_FAILED_MISSING_CONTENT"
  | "ADD_APPLICATION_FAILED_EXPIRED_PERIOD"
  | "FETCH_APPLICATION_FAILED"
  | "PUT_APPLICATION_FAILED"
  | "PUT_APPLICATION_FAILED_MISSING_CONTENT"
  | "PUT_APPLICATION_FAILED_EXPIRED_PERIOD";

type applicationActionCreator =
  | typeof markApplicationLoading
  | typeof addPreviewApplication
  | typeof addApplicationSuccess
  | typeof backToStep1Success
  | typeof addApplicationSuccessFinished
  | typeof putApplicationSuccess
  | typeof putApplicationSuccessFinished
  | typeof showModalImage
  | typeof fetchApplicationSuccess
  | typeof getApplicationInitialState
  | typeof failed
  | typeof addRecentPhotoPreview;

export type IApplicationActions = ReturnType<applicationActionCreator>;
