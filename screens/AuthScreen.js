import React, { useState, useReducer, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Button,
  Alert,
  ActivityIndicator,
  Platform,
  Text,
} from "react-native";
import { useDispatch } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as authActions from "../store/actions/Auth";
import Card from "../components/Card";
import Input from "../components/Input";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const AuthScreen = (props) => {
  // date picker
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  console.log("date", date);

  const onChange = useCallback((event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  }, [setDate]);

  const showDatepicker = () => {
    setShow(true);
  };

  // ------------------------------------------//
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred,", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(action);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <Card style={styles.authContainer}>
        <ScrollView>
          {isSignup && (
            <View>
              <View>
                <Text style={{ marginVertical: 2 }}> Birth day : </Text>
                <TextInput
                  style={{
                    paddingHorizontal: 2,
                    paddingVertical: 5,
                    borderBottomColor: "#ccc",
                    borderBottomWidth: 1,
                  }}
                  id="birthday"
                  label="Birthday"
                  value={() => {
                    date.toISOString();
                  }}
                  onTouchStart={showDatepicker}
                />
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                  />
                )}
              </View>
              <Input
                id="firstName"
                label="First name"
                keyboardType="default"
                required
                autoCapitalize="none"
                errorText="Please enter a valid first name."
                onInputChange={inputChangeHandler}
                initialValue=""
              />
              <Input
                id="lastName"
                label="Last name"
                keyboardType="default"
                required
                autoCapitalize="none"
                errorText="Please enter a valid last name."
                onInputChange={inputChangeHandler}
                initialValue=""
              />
            </View>
          )}
          <Input
            id="email"
            label="Mail adress"
            keyboardType="email-address"
            required
            email
            autoCapitalize="none"
            errorText="Please enter a valid email address."
            onInputChange={inputChangeHandler}
            initialValue=""
          />
          <Input
            id="password"
            label="Password"
            keyboardType="default"
            secureTextEntry
            required
            minLength={5}
            autoCapitalize="none"
            errorText="Please enter a valid password."
            onInputChange={inputChangeHandler}
            initialValue=""
          />
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color="red" />
            ) : (
              <Button
                title={isSignup ? "Sign Up" : "Login"}
                color="green"
                onPress={authHandler}
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={`Switch to ${isSignup ? "Login" : "Sign Up"}`}
              color="orange"
              onPress={() => {
                setIsSignup((prevState) => !prevState);
              }}
            />
          </View>
        </ScrollView>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  authContainer: {
    width: "90%",
    maxWidth: 400,
    maxHeight: 700,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default AuthScreen;
