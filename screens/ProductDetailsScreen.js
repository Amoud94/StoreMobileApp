import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Image, View, Text, StyleSheet, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as cartActions from "../store/actions/Cart";
import Colors from "../constants/Colors";

const ProductDetailsScreen = (props) => {
  const { productId } = props.route.params;
  const availableProducts = useSelector(
    (state) => state.products.availableProducts
  );
  const product = availableProducts.find((product) => product.id === productId);
  const dispatch = useDispatch();
  return (
    <ScrollView>
      <View>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
        <Button
          color={Colors.primary}
          title="add to cart"
          onPress={() => {
            dispatch(cartActions.addToCart(product));
          }}
        />
        <Text style={styles.price}> ${product.price.toFixed(2)}</Text>
        <Text style={styles.description}> {product.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  actions: {
    marginVertical: 10,
    alignItems: "center",
  },
  price: {
    fontSize: 26,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default ProductDetailsScreen;
