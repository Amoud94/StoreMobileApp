import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import * as authActions from "../store/actions/Auth";

function StartUpScreen(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("userData");
      if (!value) {
        dispatch(authActions.autoLoggin());
        return;
      }
      const Data = JSON.parse(value);
      const expiryDate = new Date(Data.expirationDate);

      if (
        expiryDate <= new Date() ||
        !Data.userID ||
        !Data.userToken ||
        !Data.isSignedIn
      ) {
        dispatch(authActions.autoLoggin());
        return;
      }


      dispatch(
        authActions.authenticate(Data.userID, Data.userToken, Data.isSignedIn )
      );
    } catch (error) {
      throw error;
    }
  };
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StartUpScreen;
