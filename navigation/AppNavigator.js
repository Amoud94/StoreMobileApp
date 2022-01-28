import React from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { MainNavigator, AuthNavigator } from "./ShopNavigator";
import StartUpScreen from "../screens/StartUpScreen";

const AppNavigator = () => {
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const autoLoggedIn = useSelector((state) => state.auth.isAutoLoggedIn);

  console.log("User is sign in : ", isSignedIn);
  console.log("User auto loggin : ", autoLoggedIn);

  return (
    <NavigationContainer>
      {isSignedIn && <MainNavigator />}
      {!isSignedIn && autoLoggedIn && <AuthNavigator />}
      {!isSignedIn && !autoLoggedIn && <StartUpScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
