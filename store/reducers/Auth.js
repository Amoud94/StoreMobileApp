import {
  LOGOUT,
  AUTO_LOGGIN,
  AUTHENTICATE,
} from "../actions/Auth";

const initialState = {
  userToken: null,
  userID: null,
  isSignedIn: false,
  isAutoLoggedIn: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        userToken: action.token,
        userID: action.userId,
        isSignedIn: action.isSignedIn,
        isAutoLoggedIn: true,
      };
    case AUTO_LOGGIN:
      return {
        ...state,
        isAutoLoggedIn: true,
      };
    case LOGOUT:
      return {
        userToken: null,
        userID: null,
        isSignedIn: false,
      };
    default:
      return state;
  }
};
export default authReducer;
