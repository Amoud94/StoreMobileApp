import React, {
  useLayoutEffect,
  useCallback,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch, connect } from "react-redux";

import HeaderButton from "../components/CustomHeaderButton";
import * as productsActions from "../store/actions/Product";

const EditProductScreen = (props) => {
  const { navigation, route } = props;
  const prodId = route.params ? route.params.productId : null;
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === prodId)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [title, setTitle] = useState(editedProduct ? editedProduct.title : "");
  const [imageUrl, setImageUrl] = useState(
    editedProduct ? editedProduct.imageUrl : ""
  );
  const [price, setPrice] = useState(editedProduct ? editedProduct.price : "");
  const [description, setDescription] = useState(
    editedProduct ? editedProduct.description : ""
  );

  useEffect(() => {
    if (error) {
      Alert.alert("Error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const dispatch = useDispatch();

  const submitHandler = useCallback(() => {
    setError(null);
    setIsLoading(true);
    try {
      if (editedProduct) {
        console.log("on update product handler");
        dispatch(
          productsActions.updateProduct(prodId, title, description, imageUrl)
        );
      } else {
        console.log("on create new product handler");
        dispatch(
          productsActions.createProduct(title, description, imageUrl, +price)
        );
      }
      navigation.goBack();
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, [dispatch, prodId, title, description, imageUrl, price]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: editedProduct ? "Edit Product" : "Add Product",
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Save"
            iconName={
              Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
            }
            onPress={submitHandler}
          />
        </HeaderButtons>
      ),
    });
  }, [submitHandler]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => setTitle(text)}
            keyboardType="default"
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
          />
        </View>
        {editedProduct ? null : (
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={(text) => setPrice(text)}
              keyboardType="decimal-pad"
            />
          </View>
        )}
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={(text) => setDescription(text)}
            numberOfLines={3}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  formControl: {
    width: "100%",
  },
  label: {
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});

export default EditProductScreen;

{
  /*
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
    console.log("form is valid :", updatedFormIsValid);
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};
  // const [formState, dispatchFormState] = useReducer(formReducer, {
  //   // my initial state
  //   inputValues: {
  //     title: editedProduct ? editedProduct.title : "",
  //     imageUrl: editedProduct ? editedProduct.imageUrl : "",
  //     description: editedProduct ? editedProduct.description : "",
  //     price: "",
  //   },
  //   inputValidities: {
  //     title: editedProduct ? true : false,
  //     imageUrl: editedProduct ? true : false,
  //     description: editedProduct ? true : false,
  //     price: editedProduct ? true : false,
  //   },
  //   formIsValid: editedProduct ? true : false,
  // });

  // const submitHandler = useCallback(() => {
  //   console.log(formState);
  //   if (!formState.formIsValid) {
  //     Alert.alert("Wrong input!", "Please check the errors in the form.", [
  //       { text: "Okay" },
  //     ]);
  //     return;
  //   }
  //   console.log("form validation ", formState.formIsValid);

  //   if (editedProduct) {
  //     dispatch(
  //       productsActions.updateProduct(
  //         prdId,
  //         formState.inputValues.title,
  //         formState.inputValues.description,
  //         formState.inputValues.imageUrl
  //       )
  //     );
  //   } else {
  //     dispatch(
  //       productsActions.createProduct(
  //         formState.inputValues.title,
  //         formState.inputValues.description,
  //         formState.inputValues.imageUrl,
  //         +formState.inputValues.price
  //       )
  //     );
  //   }
  //   navigation.goBack();
  // }, [dispatch, prdId, formState]);

  // const inputChangeHandler = useCallback(
  //   (inputIdentifier, inputValue) => {
  //     dispatchFormState({
  //       type: FORM_INPUT_UPDATE,
  //       value: inputValue,
  //       input: inputIdentifier,
  //     });
  //   },
  //   [dispatchFormState]
  // );  
  
<View style={styles.form}>
<Input
  id="title"
  label="Title"
  errorText="Please enter a valid title!"
  keyboardType="default"
  autoCapitalize="sentences"
  autoCorrect
  returnKeyType="next"
  onInputChange={inputChangeHandler}
  initialValue={editedProduct ? editedProduct.title : ""}
  initiallyValid={!!editedProduct}
  required={true}
/>
<Input
  id="imageUrl"
  label="Image Url"
  errorText="Please enter a valid image url!"
  keyboardType="default"
  returnKeyType="next"
  onInputChange={inputChangeHandler}
  initialValue={editedProduct ? editedProduct.imageUrl : ""}
  initiallyValid={!!editedProduct}
  required={true}
/>
{editedProduct ? null : (
  <Input
    id="price"
    label="Price"
    errorText="Please enter a valid price!"
    keyboardType="decimal-pad"
    returnKeyType="next"
    onInputChange={inputChangeHandler}
    required={true}
    min={0}
  />
)}
<Input
  id="description"
  label="Description"
  errorText="Please enter a valid description!"
  keyboardType="default"
  autoCapitalize="sentences"
  autoCorrect
  multiline
  numberOfLines={3}
  onInputChange={inputChangeHandler}
  initialValue={editedProduct ? editedProduct.description : ""}
  initiallyValid={!!editedProduct}
  required={true}
  minLength={5}
/>
</View> */
}
