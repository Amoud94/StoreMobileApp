import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FlatList,
  Button,
  SafeAreaView,
  ActivityIndicator,
  View,
  Alert,
  Text,
} from "react-native";
import ProductCard from "../components/ProductCard";
import * as cartActions from "../store/actions/Cart";
import * as productActions from "../store/actions/Product";

function ProductOverViewScreen(props) {
  const { navigation } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState();

  const availableProducts = useSelector(
    (state) => state.products.availableProducts
  );

  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    console.log("loading products");
    setError(null);
    setIsRefreshing(true)
    try {
      await dispatch(productActions.getProducts());
    } catch (error) {
      setError(error.message);
    }
    setIsRefreshing(false)
  }, [dispatch, setIsRefreshing, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => setIsLoading(false));
  }, [loadProducts]);

  const onSelectHandler = (title, id) => {
    navigation.navigate("productDetail", {
      title: title,
      productId: id,
    });
  };

  const renderProducts = (itemData) => {
    return (
      <ProductCard
        title={itemData.item.title}
        imageUrl={itemData.item.imageUrl}
        price={itemData.item.price}
        onSelect={() => {
          onSelectHandler(itemData.item.title, itemData.item.id);
        }}
      >
        <Button
          title="more details"
          onPress={() => onSelectHandler(itemData.item.title, itemData.item.id)}
        />
        <Button
          title="add to cart"
          onPress={() => dispatch(cartActions.addToCart(itemData.item))}
        />
      </ProductCard>
    );
  };
  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>An error occurred !</Text>
        <Button title="Try again" onPress={loadProducts} />
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }
  if (!isLoading && availableProducts.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No products found, Maybe start adding some !</Text>
      </View>
    );
  }
  return (
    <SafeAreaView>
      <FlatList
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={availableProducts}
        keyExtractor={(item, index) => item.id}
        renderItem={renderProducts}
      />
    </SafeAreaView>
  );
}
export default ProductOverViewScreen;
