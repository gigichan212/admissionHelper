import { IPeriodActions } from "./actions";
import { IPeriodState } from "./state";

const initialState: IPeriodState = {
  payload: {
    period: {
      data: [],
      isLoading: false,
      error: {
        isError: false,
        ErrorType: null,
        ErrorMessage: null,
      },
    },
  },
};

export const periodReducer = (
  previousState: IPeriodState = initialState,
  action: IPeriodActions
): IPeriodState => {
  switch (action.type) {
    // Loading
    case "@@PERIOD/MARK_PAGE_LOADING":
      return {
        ...previousState,
        payload: {
          ...previousState.payload,
          period: {
            ...previousState.payload.period,
            isLoading: action.payload.period.isLoading,
          },
        },
      };
    // Success
    case "@@PERIOD/FETCH_RECORD_SUCCESS":
      return {
        ...previousState,
        payload: {
          ...previousState.payload,
          period: {
            ...previousState.payload.period,
            data: action.payload.period.data,
          },
        },
      };

    case "FETCH_RECORD_FAILED":
      return {
        ...previousState,
        payload: {
          ...previousState.payload,
          period: {
            ...previousState.payload.period,
            error: {
              isError: true,
              ErrorType: action.type,
              ErrorMessage: null,
            },
          },
        },
      };
    default:
      return previousState;
  }
};
