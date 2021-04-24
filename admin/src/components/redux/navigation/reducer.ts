import { navBarActions } from "./action";
import { NavBarState } from "./state";

const initialState: NavBarState = {
  isOpen: true,
};

export const navBarReducer = (state: NavBarState = initialState, action: navBarActions): NavBarState => {
  switch (action.type) {
    case "@@navBar/updateNavBarStatus":
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case "@@navBar/setNavBar":
      return {
        ...state,
        isOpen: action.isOpen,
      };
    default:
      return state;
  }
};
