import produce from "immer";
import { UserActions } from "./action";
import { UserState } from "./state";

const initialState: UserState = {
  payload: {
    edit: {
      userId: null,
      isEditShow: false,
    },
    record: {
      offset: 0,
      limit: 10,
      recordCount: null,
      users: [],
      currentPage: 1,
    },
    delete: {},
    add: {},
  },
};

export const userReducer = (state: UserState = initialState, action: UserActions): UserState => {
  switch (action.type) {
    case "@@user/recordIsLoading":
      return produce(state, (state) => {
        state.payload.record.isLoading = action.payload.record.isLoading;
      });
    case "@@user/setLimit":
      return produce(state, (state) => {
        state.payload.record = { ...state.payload.record, ...action.payload.record };
      });
    case "@@user/setCurrentPage":
      return produce(state, (state) => {
        state.payload.record.currentPage = action.payload.record.currentPage;
      });
    case "@@user/recordReceived":
      return produce(state, (state) => {
        state.payload.record = { ...state.payload.record, ...action.payload.record };
      });
    case "@@user/isEditShow":
      return produce(state, (state) => {
        state.payload.edit = { ...state.payload.edit, ...action.payload };
      });
    case "@@user/updateSuccess":
      return produce(state, (state) => {
        //Change the username of the user in the record
        if (action.data.username && state.payload.record.users.length > 0) {
          let user = state.payload.record.users.filter((user) => user.id === action.id)[0];
          user.username = action.data.username;
          user.updated_at = action.data.updated_at;
          //Set updated user
          user.updated_user = action.data.updated_user;
        }

        //Set update to true
        //For sending alert
        state.payload.edit.isUpdated = true;

        //If a teacher edit its profile, update current username
        if (state.payload.currentUser && action.data.username) {
          state.payload.currentUser.username = action.data.username;
          state.payload.currentUser.updated_user = action.data.updated_user;
        }
      });
    case "@@user/updateIsSuccess":
      return produce(state, (state) => {
        state.payload.edit.isUpdated = null;
      });
    case "@@user/updateFailed":
      return produce(state, (state) => {
        state.payload.edit.error = action.error;
      });
    case "@@user/deleteSuccess":
      return produce(state, (state) => {
        const index = state.payload.record.users.findIndex((user) => user.id === action.id);
        state.payload.record.users.splice(index, 1);
        state.payload.delete.isDeleted = true;
      });
    case "@@user/userIsDeleted":
      return produce(state, (state) => {
        state.payload.delete.isDeleted = action.isDeleted;
      });
    case "@@user/deleteFailed":
      return produce(state, (state) => {
        state.payload.delete.error = action.error;
      });
    case "@@user/addSuccess":
      return produce(state, (state) => {
        state.payload.record.users.unshift({ ...action.user, role: "teacher" });
        state.payload.add.isAdded = true;
      });
    case "@@user/userIsAdded":
      return produce(state, (state) => {
        state.payload.add.isAdded = action.isAdded;
      });
    case "@@user/addFailed":
      return produce(state, (state) => {
        state.payload.add.error = action.error;
      });
    case "@@user/addCurrentUser":
      console.log(action.user);

      return produce(state, (state) => {
        state.payload.currentUser = action.user;
      });
    case "@@user/getSingleUserFailed":
      return produce(state, (state) => {
        if (state.payload.currentUser) {
          state.payload.currentUser.error = action.error;
        }
      });
    default:
      return state;
  }
};
