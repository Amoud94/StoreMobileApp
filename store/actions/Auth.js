import AsyncStorage from "@react-native-async-storage/async-storage";

// export const SIGNUP = "SIGNUP";
// export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const AUTO_LOGGIN = "AUTO_LOGGIN";
let Timer;

const storeData = async (userID, userToken, isSignedIn, expirationDate) => {
  try {
    await AsyncStorage.setItem(
      "userData",
      JSON.stringify({
        userID: userID,
        userToken: userToken,
        isSignedIn: isSignedIn,
        expirationDate: expirationDate.toISOString(),
      })
    );
  } catch (error) {
    throw error;
  }
};

export const autoLoggin = () => {
  return {
    type: AUTO_LOGGIN,
  };
};

export const authenticate = (userId, token, isSignedIn) => {
  return (dispatch) => {
    // dispatch(setLogoutTimer(expiryTime));
    dispatch({
      type: AUTHENTICATE,
      userID: userId,
      token: token,
      isSignedIn: isSignedIn,
    });
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDk4cFx6-N0_pW3zjzuk194vLDdHl0UgxE",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );
      if (!response.ok) {
        const errorRespData = await response.json();
        const errorId = errorRespData.error.message;
        let message = "Something went wrong !";
        if (errorId === "EMAIL_EXISTS") {
          message = "This email exists already";
        }
        throw new Error(message);
      }
      const resData = await response.json();
      dispatch(
        authenticate(
          resData.localId,
          resData.idToken,
          false
          // parseInt(resData.expiresIn) * 1000
        )
      );
    } catch (error) {
      throw error;
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDk4cFx6-N0_pW3zjzuk194vLDdHl0UgxE",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );
      if (!response.ok) {
        const errorRespData = await response.json();
        const errorId = errorRespData.error.message;
        let message = "Something went wrong !";
        if (errorId === "EMAIL_NOT_FOUND") {
          message = "This email could not be found";
        } else if (errorId === "INVALID_PASSWORD") {
          message = "This password is not valid";
        }
        throw new Error(message);
      }
      const resData = await response.json();
      dispatch(
        authenticate(
          resData.localId,
          resData.idToken,
          true
          // parseInt(resData.expiresIn) * 1000
        )
      );
      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000
      );
      await storeData(resData.localId, resData.idToken, true, expirationDate);
    } catch (error) {
      throw error;
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    try {
      clearTimeout();
      await AsyncStorage.removeItem("userData");
    } catch (error) {
      throw error;
    }
    dispatch({ type: LOGOUT });
  };
};

const clearTimeout = () => {
  if (Timer) {
    clearTimeout(Timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    Timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};
