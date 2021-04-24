import { ApplicationActions } from "./action";
import produce from "immer";
import { ApplicationState } from "./state";

const initialState: ApplicationState = {
  payload: {
    record: {
      selected: [],
      sortBy: "created_at",
      offset: 0,
      limit: 50,
      recordCount: null,
      record: [],
      excelRecord: [],
      currentPage: 1,
      error: {
        isError: false,
        ErrorType: null,
        ErrorMessage: null,
      },
    },
    singleRecord: {
      // record: {
      //   id: null,
      //   idWithPrefix: null,
      //   created_at: null,
      //   updated_at: null,
      //   updated_user_role: null,
      //   updated_user: null,
      //   application_period: { value: "", label: "" },
      //   application_status: "pending",
      //   depositSlips: [],
      //   level: "1",
      //   chinese_name: "香港人",
      //   english_name: "gigi",
      //   sex: "F",
      //   religion: "none",
      //   nationality: "hk",
      //   birth_cert_num: "q000001",
      //   date_of_birth: "2017-12-01",
      //   place_of_birth: "hk",
      //   email: "test@test.com",
      //   phone: 12345678,
      //   address: "香港",
      //   have_sibling: false,
      //   remarks: "remarks",
      //   recent_photo: "",
      //   slips: "",
      //   education: [
      //     { id: "", name: "name", duration: "duration", grade: "grade", conduct_grade: "conduct grade" },
      //     { id: "", name: "name2", duration: "duration2", grade: "grade2", conduct_grade: "conduct grade2" },
      //     { id: "", name: "name3", duration: "duration3", grade: "grade3", conduct_grade: "conduct grade3" },
      //   ],
      //   parent: [
      //     {
      //       id: "",
      //       parent_type: "father",
      //       chinese_name: "father",
      //       english_name: "father",
      //       occupation: "teacher",
      //       office_address: "address",
      //       office_phone: 69876543,
      //       mobile: 56789533,
      //     },
      //   ],

      //   interviewer: { value: "", label: "" },
      //   interview_date_time: "2021-04-20 11:00",
      //   first_round_score: 50,
      //   first_round_remarks: "first_round_remarks",
      //   second_round_score: 50,
      //   second_round_remarks: "second_round_remarks",
      //   school_remarks: "school_remarks",
      // },
      isAdded: false,
      isAddApplicationLoading: false,
      showModalImage: {
        isShow: false,
        modalImage: null,
      },
      isLoading: false,
      imageIsLoading: false,
      isUpdated: false,
      error: {
        isError: false,
        ErrorType: null,
        ErrorMessage: null,
      },
      record: {
        idWithPrefix: null,
        created_at: null,
        updated_at: null,
        updated_user_role: null,
        updated_user: null,
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
        have_sibling: false,
        remarks: "",
        recent_photo: "",
        education: [
          { name: "", duration: "", grade: "", conduct_grade: "" },
          { name: "", duration: "", grade: "", conduct_grade: "" },
          { name: "", duration: "", grade: "", conduct_grade: "" },
        ],
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
          {
            parent_type: "",
            chinese_name: "",
            english_name: "",
            occupation: "",
            office_address: "",
            office_phone: null,
            mobile: null,
          },
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
        sibling: [
          {
            name: "",
            sex: "",
            school_name: "",
            grade: "",
          },
          {
            name: "",
            sex: "",
            school_name: "",
            grade: "",
          },
        ],
      },
    },

    container: {
      searchBar: {
        isShow: false,
      },
      interviewerModal: {
        isShow: false,
      },
      batchUpdate: {
        isShow: false,
      },
      email: {
        isShow: false,
      },
      excel: {
        isShow: false,
      },
    },
  },
};

export const applicationReducer = (
  state: ApplicationState = initialState,
  action: ApplicationActions
): ApplicationState => {
  switch (action.type) {
    // Loading
    case "@@application/markListIsLoading":
      return produce(state, (state) => {
        state.payload.record.isLoading = action.payload.record.isLoading;
      });
    case "@@application/markSingleIsLoading":
      return produce(state, (state) => {
        state.payload.singleRecord.isLoading = action.payload.singleRecord.isLoading;
      });
    case "@@application/markAddApplicationIsLoading":
      return produce(state, (state) => {
        state.payload.singleRecord.isAddApplicationLoading = action.payload.singleRecord.isAddApplicationLoading;
      });
    case "@@application/markImageIsLoading":
      return produce(state, (state) => {
        state.payload.singleRecord.imageIsLoading = action.payload.singleRecord.imageIsLoading;
      });
    case "@@application/markBatchUpdateIsLoading":
      return produce(state, (state) => {
        state.payload.container.batchUpdate.isLoading = action.payload.container.batchUpdate.isLoading;
      });

    // Application List
    case "@@application/batchUpdateSuccess":
      return produce(state, (state) => {
        //If have selected applications
        if (action.data.selected) {
          action.data.selected.forEach((selected: number) => {
            //If have status to update
            //Else update interviewer and interview date
            if (action.data.status) {
              state.payload.record.record.find((rec) => rec.id === selected).application_status = action.data.status;
              //Hide container
              state.payload.container.batchUpdate.isShow = false;
            } else if (action.data.interviewer_id && action.data.interview_date_time) {
              const application = state.payload.record.record.find((rec) => rec.id === selected);
              application.interviewer_id = action.data.interviewer_id;
              application.interview_date_time = new Date(action.data.interview_date_time);
              //Hide container
              state.payload.container.interviewerModal.isShow = false;
              state.payload.container.batchUpdate.isShow = false;
            }
          });
          //For alerting user
          state.payload.record.isUpdated = true;
          //Clear selected checkbox
          state.payload.record.selected = [];
        } else if (action.data.application_period_id && action.data.application_status) {
          //For alerting user
          state.payload.record.emailRecordCount = action.recordCount;
          state.payload.record.failEmailRecordCount = action.failRecordCount;
          state.payload.record.failEmailRecord = action.failEmailRecord;
          state.payload.record.isUpdatedEmail = true;
          //Hide container
          state.payload.container.email.isShow = false;
          //Clearing error field
          state.payload.record.error.isError = false;
        }
      });
    case "@@application/setIsUpdated":
      return produce(state, (state) => {
        state.payload.record.isUpdated = action.isUpdated;
        state.payload.record.isUpdatedEmail = action.isUpdated;
      });
    case "@@application/setSelectedApp":
      return produce(state, (state) => {
        const selected = action.payload.record.selected;

        //If an array is provided, replace the selected array with ours
        //If a number is provided, push it to our selected array
        if (Array.isArray(selected)) {
          state.payload.record.selected = selected;
        } else {
          state.payload.record.selected.push(selected);
        }
      });
    case "@@application/setSortBy":
      return produce(state, (state) => {
        state.payload.record.sortBy = action.payload.record.sortBy;
      });
    case "@@application/setLimit":
      return produce(state, (state) => {
        state.payload.record = { ...state.payload.record, ...action.payload.record };
      });
    case "@@application/setCurrentPage":
      return produce(state, (state) => {
        state.payload.record.currentPage = action.payload.record.currentPage;
      });
    case "@@application/listRecordReceived":
      return produce(state, (state) => {
        state.payload.record = { ...state.payload.record, ...action.payload.record };
      });
    //Excel
    case "@@application/fetchExcelDataSuccess":
      return produce(state, (state) => {
        state.payload.record.excelRecord = action.payload.record.excelRecord;
      });
    //Search
    case "@@application/saveSearchData":
      return produce(state, (state) => {
        state.payload.record.searchQuery = action.data;
      });
    //Container
    case "@@application/setIsShow":
      return produce(state, (state) => {
        const containerName = action.payload.container;
        switch (containerName) {
          case "interviewer":
            state.payload.container.interviewerModal.isShow = action.payload.isShow;
            break;
          case "batch":
            state.payload.container.batchUpdate.isShow = action.payload.isShow;
            break;
          case "searchBar":
            state.payload.container.searchBar.isShow = action.payload.isShow;
            break;
          case "email":
            state.payload.container.email.isShow = action.payload.isShow;
            break;
          case "excel":
            state.payload.container.excel.isShow = action.payload.isShow;
            break;
        }
      });
    // Single application
    case "@@application/singleRecordReceived":
      return produce(state, (state) => {
        state.payload.singleRecord = { ...state.payload.singleRecord, ...action.payload.singleRecord };
        state.payload.singleRecord.error = {
          ...state.payload.record.error,
          ...initialState.payload.singleRecord.error,
        };
      });
    case "@@application/getSingleRecordInitialState":
      return produce(state, (state) => {
        state.payload.singleRecord = initialState.payload.singleRecord;
      });
    case "@@application/addApplicationSuccess":
      return produce(state, (state) => {
        state.payload.singleRecord.isAdded = true;
      });
    case "@@application/addApplicationSuccessFinished":
      return produce(state, (state) => {
        state.payload.singleRecord.isAdded = false;
      });
    case "@@application/putApplicationSuccess":
      return produce(state, (state) => {
        state.payload.singleRecord.isUpdated = true;
      });
    case "@@application/putApplicationSuccessFinished":
      return produce(state, (state) => {
        state.payload.singleRecord.isUpdated = false;
      });
    case "@@application/showModalImage":
      return produce(state, (state) => {
        state.payload.singleRecord.showModalImage = action.payload.singleRecord.showModalImage;
      });
    // Fail cases
    case "ADD_APPLICATION_FAILED_MISSING_CONTENT":
    case "PUT_APPLICATION_FAILED_MISSING_CONTENT":
      return produce(state, (state) => {
        state.payload.singleRecord.error.isError = true;
        state.payload.singleRecord.error.ErrorType = action.type;
        state.payload.singleRecord.error.ErrorMessage = action.message;
      });
    case "ADD_APPLICATION_FAILED_EXPIRED_PERIOD":
    case "ADD_APPLICATION_FAILED":
    case "FETCH_SINGLE_APPLICATION_FAILED":
    case "FETCH_SINGLE_APPLICATION_NOT_FOUND":
    case "PUT_APPLICATION_FAILED":
      return produce(state, (state) => {
        state.payload.singleRecord.error.isError = true;
        state.payload.singleRecord.error.ErrorType = action.type;
        state.payload.singleRecord.error.ErrorMessage = null;
      });
    case "FETCH_LIST_APPLICATION_FAILED":
      return produce(state, (state) => {
        state.payload.record.error.isError = true;
        state.payload.record.error.ErrorType = action.type;
        state.payload.record.error.ErrorMessage = null;
      });
    case "BATCH_UPDATE_APPLICATIONS_FAILED":
    case "BATCH_UPDATE_APPLICATIONS_FAILED_NO_FOUND":
      return produce(state, (state) => {
        state.payload.record.error.isError = true;
        state.payload.record.error.ErrorType = action.type;
        state.payload.record.error.ErrorMessage = action.message;
      });
    case "@@application/resetError":
      return produce(state, (state) => {
        switch (action.errorType) {
          case "BATCH_UPDATE_APPLICATIONS_FAILED":
          case "BATCH_UPDATE_APPLICATIONS_FAILED_NO_FOUND":
            state.payload.record.error.isError = false;
            state.payload.record.error.ErrorType = "";
            state.payload.record.error.ErrorMessage = "";
            break;
        }
      });
    default:
      return state;
  }
};
