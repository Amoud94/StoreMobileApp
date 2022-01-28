import React, { useEffect, useCallback, useState } from "react";
import { FlatList,View, Text, Button, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as orderActions from "../store/actions/Order";
import OrderItem from "../components/OrderItem";

const OrdersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();


  const dispatch = useDispatch();

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('loading orders')
      await dispatch(orderActions.fetchOrders());
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    loadOrders();
  }, [dispatch, loadOrders]);

  const orders = useSelector((state) => state.order.orders);

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>An error occurred !</Text>
        <Button title="Try again" onPress={loadOrders} />
      </View>
    )
  }
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }
  if (!isLoading && orders.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No orders found, Maybe start making some !</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={orders}
      keyExtractor={(item, index) => index}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

export default OrdersScreen;
