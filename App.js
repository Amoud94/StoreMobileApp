// import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-gesture-handler";
import { createStore, combineReducers, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import { Provider } from "react-redux";
import { enableScreens } from "react-native-screens";

import AppNavigator from "./navigation/AppNavigator";

import productReducer from "./store/reducers/Product";
import cartReducer from "./store/reducers/Cart";
import orderReducer from "./store/reducers/Order";
import authReducer from "./store/reducers/Auth";

enableScreens();

const mainReducer = combineReducers({
  products: productReducer,
  cart: cartReducer,
  order: orderReducer,
  auth: authReducer,
});

const store = createStore(mainReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store} >
      <AppNavigator />
    </Provider>
  );
}
