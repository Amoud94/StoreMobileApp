import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../constants/Colors";
import CartItem from "../components/CartItem";
import * as cartActions from "../store/actions/Cart";
import * as ordersActions from "../store/actions/Order";

const CartScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });
  
  useEffect(() => {
    if (error) {
      Alert.alert("Error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const orderHandler = async () => {
    setIsLoading(true);
    try {
      await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
        </Text>
        {isLoading ? (
          <View style={{flex:1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="small" color="red" />
          </View>
        ) : (
          <Button
            color={Colors.accent}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={orderHandler}
          />
        )}
      </View>
      <FlatList
        style={styles.list}
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
  list: {
    marginBottom: 20,
    shadowColor: "black",
    shadowOpacity: 0.56,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 6,
    borderRadius: 10,
    backgroundColor: "white",
  },
  summaryText: {
    fontSize: 18,
    flex:3
  },
  amount: {
    color: Colors.primary,
  },
});

export default CartScreen;
