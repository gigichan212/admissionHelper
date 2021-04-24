import { IApplicationActions } from "./actions";
import { IApplicationState } from "./state";
import produce from "immer";

const initialState: IApplicationState = {
  payload: {
    application: {
      // data: {
      //   idWithPrefix: null,
      //   created_at: null,
      //   depositSlips: [],
      //   level: "1",
      //   chinese_name: "test",
      //   english_name: "test",
      //   sex: "M",
      //   religion: "test",
      //   nationality: "test",
      //   birth_cert_num: "test",
      //   date_of_birth: "",
      //   place_of_birth: "test",
      //   email: "gigi@test.com",
      //   email2: "gigi@test.com",
      //   phone: 12345678,
      //   address: "test",
      //   have_sibling: "false",
      //   remarks: "test",
      //   recent_photo: "",
      //   slips: "",
      //   education: [
      //     {
      //       name: "test",
      //       duration: "test",
      //       grade: "test",
      //       conduct_grade: "test",
      //     },
      //   ],
      //   parent: [
      //     {
      //       parent_type: "father",
      //       chinese_name: "test",
      //       english_name: "test",
      //       occupation: "test",
      //       office_address: "test",
      //       office_phone: 12345567,
      //       mobile: 12345567,
      //     },
      //   ],
      //   sibling: [{ name: "", sex: "", school_name: "", grade: "" }],
      // },
      data: {
        idWithPrefix: null,
        created_at: null,
        depositSlips: [],
        level: "",
        chinese_name: "",
        english_name: "",
        sex: "",
        religion: "",
        nationality: "",
        birth_cert_num: "",
        date_of_birth: "",
        place_of_birth: "",
        email: "",
        email2: "",
        phone: null,
        address: "",
        have_sibling: "false",
        remarks: "",
        recent_photo: "",
        slips: "",
        education: [{ name: "", duration: "", grade: "", conduct_grade: "" }],
        parent: [
          {
            parent_type: "",
            chinese_name: "",
            english_name: "",
            occupation: "",
            office_address: "",
            office_phone: null,
            mobile: null,
          },
        ],
        sibling: [{ name: "", sex: "", school_name: "", grade: "" }],
      },
      recentPhoto: {
        selectedImage: null,
      },
      showModalImage: {
        isShow: false,
        modalImage: null,
      },
      isLoading: false,
      resetForm: false,
      fromStep1: false,
      fromStep2: false,
      isUpdated: false,

      error: {
        isError: false,
        ErrorType: null,
        ErrorMessage: null,
      },
    },
  },
};

export const applicationReducer = (
  previousState: IApplicationState = initialState,
  action: IApplicationActions
): IApplicationState => {
  switch (action.type) {
    // Loading
    case "@@APPLICATION/MARK_APPLICATION_LOADING":
      return {
        ...previousState,
        payload: {
          ...previousState.payload,
          application: {
            ...previousState.payload.application,
            isLoading: action.payload.application.isLoading,
          },
        },
      };

    // Success
    case "@@APPLICATION/ADD_PREVIEW_APPLICATION":
    case "@@APPLICATION/FETCH_APPLICATION_SUCCESS":
      return produce(previousState, (state) => {
        state.payload.application.data = { ...action.payload.application.data };

        state.payload.application.error = {
          ...action.payload.application.error,
        };
        state.payload.application.fromStep1 = true;
      });

    // add recent photo image value from App.tsx input
    case "@@APPLICATION/ADD_RECENT_PHOTO_PREVIEW":
      return produce(previousState, (state) => {
        state.payload.application.recentPhoto.selectedImage =
          action.payload.application.recentPhoto.selectedImage;
      });

    // from form step 2 back to step 1
    case "@@APPLICATION/BACK_TO_STEP1_SUCCESS":
      return produce(previousState, (state) => {
        state.payload.application.fromStep2 = true;
      });

    // add application
    case "@@APPLICATION/ADD_APPLICATION_SUCCESS":
      return {
        ...previousState,
        payload: {
          ...previousState.payload,
          application: {
            ...previousState.payload.application,
            resetForm: action.payload.application.resetForm,
            error: action.payload.application.error,
            data: {
              ...previousState.payload.application.data,
              recent_photo: initialState.payload.application.data.recent_photo,
              idWithPrefix:
                action.payload.application.data.applicationIdWithPrefix,
              created_at: action.payload.application.data.createdAt,
            },
          },
        },
      };

    case "@@APPLICATION/ADD_APPLICATION_SUCCESS_FINISHED":
      return {
        ...previousState,
        payload: {
          ...previousState.payload,
          application: {
            ...previousState.payload.application,
            fromStep1: false,
            fromStep2: false,
          },
        },
      };
    case "@@APPLICATION/GET_APPLICATION_INITIAL_STATE":
      return initialState;

    // update application
    case "@@APPLICATION/PUT_APPLICATION_SUCCESS":
      return {
        ...previousState,
        payload: {
          ...previousState.payload,
          application: {
            ...previousState.payload.application,
            // when user edited the form, reset the input value at App.tsx
            recentPhoto: {
              selectedImage: null,
            },
            isUpdated: true,
          },
        },
      };
    case "@@APPLICATION/PUT_APPLICATION_SUCCESS_FINISHED":
      return {
        ...previousState,
        payload: {
          ...previousState.payload,
          application: {
            ...previousState.payload.application,
            isUpdated: false,
          },
        },
      };

    case "@@APPLICATION/SHOW_MODAL_IMAGE":
      return produce(previousState, (state) => {
        state.payload.application.showModalImage =
          action.payload.application.showModalImage;
      });

    // Fail cases
    case "ADD_APPLICATION_FAILED_MISSING_CONTENT":
    case "PUT_APPLICATION_FAILED_MISSING_CONTENT":
      return {
        ...previousState,
        payload: {
          ...previousState.payload,
          application: {
            ...previousState.payload.application,
            error: {
              isError: true,
              ErrorType: action.type,
              ErrorMessage: action.message,
            },
            isUpdated: false,
          },
        },
      };
    case "ADD_APPLICATION_FAILED_EXPIRED_PERIOD":
    case "ADD_APPLICATION_FAILED":
    case "PUT_APPLICATION_FAILED_EXPIRED_PERIOD":
    case "PUT_APPLICATION_FAILED":
    case "FETCH_APPLICATION_FAILED":
      return {
        ...previousState,
        payload: {
          ...previousState.payload,
          application: {
            ...previousState.payload.application,
            error: {
              isError: true,
              ErrorType: action.type,
              ErrorMessage: null,
            },
            isUpdated: false,
          },
        },
      };
    default:
      return previousState;
  }
};
