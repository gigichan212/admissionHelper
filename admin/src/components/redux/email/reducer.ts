import { EmailActions } from "./action";
import produce from "immer";

export interface EmailState {
  payload: {
    record: {
      offset: number | null | undefined;
      limit: number;
      isLoading?: boolean | null;
      recordCount: number | null;
      record: any[];
      currentPage: number;
      searchQuery: any;
      error?: string;
    };
    edit: {
      id: number | null;
      isDivShow: boolean;
    };
  };
}

const initialState: EmailState = {
  payload: {
    record: {
      offset: 0,
      limit: 50,
      recordCount: null,
      record: [],
      currentPage: 1,
      isLoading: null,
      searchQuery: {},
    },
    edit: {
      id: null,
      isDivShow: false,
    },
  },
};

export const emailReducer = (state: EmailState = initialState, action: EmailActions): EmailState => {
  switch (action.type) {
    case "@@email/recordIsLoading":
      return produce(state, (state) => {
        state.payload.record.isLoading = action.payload.record.isLoading;
      });
    case "@@email/setLimit":
      return produce(state, (state) => {
        state.payload.record = { ...state.payload.record, ...action.payload.record };
      });
    case "@@email/setCurrentPage":
      return produce(state, (state) => {
        state.payload.record.currentPage = action.payload.record.currentPage;
      });
    case "@@email/recordReceived":
      return produce(state, (state) => {
        state.payload.record = { ...state.payload.record, ...action.payload.record };
      });
    case "@@email/saveSearchData":
      return produce(state, (state) => {
        state.payload.record.searchQuery = action.data;
      });
    case "@@email/showEditDiv":
      return produce(state, (state) => {
        state.payload.edit = { ...state.payload.edit, ...action.payload.edit };
      });
    case "@@email/fetchFailed":
      return produce(state, (state) => {
        state.payload.record.error = action.error;
      });
    default:
      return state;
  }
};
