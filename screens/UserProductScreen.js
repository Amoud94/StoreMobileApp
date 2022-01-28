import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  Platform,
  FlatList,
  Button,
  Text,
  Alert,
  View,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import * as productsActions from "../store/actions/Product";

import ProductCard from "../components/ProductCard";
import CustomHeaderButton from "../components/CustomHeaderButton";

function userProductScreen({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Products",
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="menu"
            iconName="ios-menu"
            onPress={() => {
              navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      ),
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Add"
            iconName={
              Platform.OS === "android" ? "md-create-outline" : "ios-create"
            }
            onPress={() => {
              navigation.navigate("editProduct");
            }}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation, route]);

  const dispatch = useDispatch();
  
  const deleteHandler = async (itemData) => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(productsActions.deleteProduct(itemData.item.id));
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const onDeleteHandler = (itemData) => {
    Alert.alert("Are you sure ?", "Do you really want to delete this item ?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => { deleteHandler(itemData) },
      },
    ]);
  };

  const onSelectHandler = (id) => {
    navigation.navigate("editProduct", {
      productId: id,
    });
  };
  const userProducts = useSelector((state) => state.products.userProducts);

  const renderProducts = (itemData) => {
    return (
      <ProductCard
        title={itemData.item.title}
        imageUrl={itemData.item.imageUrl}
        price={itemData.item.price}
        onSelect={() => onSelectHandler(itemData.item.id)}
      >
        <Button
          title="Update"
          color="orange"
          onPress={() => onSelectHandler(itemData.item.id)}
        />
        <Button
          title="Delete"
          color="red"
          onPress={() => onDeleteHandler(itemData)}
        />
      </ProductCard>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  if (!isLoading && userProducts.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No products found, Maybe start adding some !</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item, index) => item.id}
      renderItem={(itemData) => renderProducts(itemData)}
    />
  );
}

export default userProductScreen;
