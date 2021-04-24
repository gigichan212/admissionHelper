import produce from "immer";
import { ApplicationPeriodActions } from "./action";

export interface recordType {
  id: number;
  type: string;
  application_year: number;
  round: number;
  start_date: any;
  end_date: any;
  end_deadline: any;
  updated_at?: any;
  is_active: boolean;
}

export interface ApplicationPeriodState {
  payload: {
    record: {
      offset: number | null;
      limit: number;
      isLoading?: boolean;
      recordCount: number | null;
      record: recordType[];
      currentPage: number;
    };
    edit: {
      id: number | null;
      isDivShow: boolean;
      isLoading?: boolean;
      haveRecord?: boolean;
      numOfApplicant?: number;
      isUpdated?: boolean | null;
      error?: string;
    };
    add: {
      isLoading?: boolean;
      isAdded?: boolean | null;
      error?: string;
    };
  };
}

const initialState: ApplicationPeriodState = {
  payload: {
    record: {
      offset: 0,
      limit: 20,
      recordCount: null,
      record: [],
      currentPage: 1,
    },
    edit: {
      id: null,
      isDivShow: false,
    },
    add: {},
  },
};

export const applicationPeriodReducer = (
  state: ApplicationPeriodState = initialState,
  action: ApplicationPeriodActions
): ApplicationPeriodState => {
  switch (action.type) {
    case "@@applicationPeriod/recordReceived":
      return produce(state, (state) => {
        state.payload.record = { ...state.payload.record, ...action.payload.record };
      });
    case "@@applicationPeriod/setCurrentPage":
      return produce(state, (state) => {
        state.payload.record.currentPage = action.payload.record.currentPage;
      });
    case "@@applicationPeriod/haveRecordReceived":
      return produce(state, (state) => {
        state.payload.edit.haveRecord = action.payload.edit.haveRecord;
        state.payload.edit.numOfApplicant = parseInt(action.payload.edit.count);
      });
    //Edit action
    case "@@applicationPeriod/showEditDiv":
      return produce(state, (state) => {
        state.payload.edit = { ...state.payload.edit, ...action.payload.edit };
      });

    case "@@applicationPeriod/editSuccess":
      return produce(state, (state) => {
        const index = state.payload.record.record.findIndex((period) => period.id === action.data.id);
        const period = state.payload.record.record[index];
        state.payload.record.record[index] = { ...period, ...action.data };

        state.payload.edit.isUpdated = true;
      });
    case "@@applicationPeriod/editIsSuccess":
      return produce(state, (state) => {
        state.payload.edit.isUpdated = null;
      });
    //Add request
    case "@@applicationPeriod/addSuccess":
      return produce(state, (state) => {
        state.payload.record.record.push(action.data);

        state.payload.add.isAdded = true;
      });
    case "@@applicationPeriod/addIsSuccess":
      return produce(state, (state) => {
        state.payload.add.isAdded = null;
      });
    //Loading case
    case "@@applicationPeriod/addRequested":
      return produce(state, (state) => {
        state.payload.add.isLoading = true;
      });
    case "@@applicationPeriod/addRequestEnded":
      return produce(state, (state) => {
        state.payload.add.isLoading = false;
      });
    case "@@applicationPeriod/editRequested":
      return produce(state, (state) => {
        state.payload.edit.isLoading = true;
      });
    case "@@applicationPeriod/editRequestEnded":
      return produce(state, (state) => {
        state.payload.edit.isLoading = false;
      });
    case "@@applicationPeriod/recordIsLoading":
      return produce(state, (state) => {
        state.payload.record.isLoading = true;
      });
    case "@@applicationPeriod/requestEnded":
      return produce(state, (state) => {
        state.payload.record.isLoading = false;
      });
    //Fail cases
    case "@@applicationPeriod/editFailed":
      return produce(state, (state) => {
        state.payload.edit.error = action.error;
      });
    case "@@applicationPeriod/addFailed":
      return produce(state, (state) => {
        state.payload.add.error = action.error;
      });
    default:
      return state;
  }
};
