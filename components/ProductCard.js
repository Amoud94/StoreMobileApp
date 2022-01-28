import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  ImageBackground,
  Button,
} from "react-native";
function productCard(props) {
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <View style={styles.productCard}>
      <TouchableCmp onPress={props.onSelect} useForeground>
        <View>
          <View style={styles.productHeader}>
            <ImageBackground
              source={{ uri: props.imageUrl }}
              style={styles.bgImage}
            >
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {props.title}
                </Text>
                <Text style={styles.title}>${props.price}</Text>
              </View>
            </ImageBackground>
          </View>
        </View>
      </TouchableCmp>

      <View style={styles.productDetail}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    height: 250,
    backgroundColor: "#f4f5f9",
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  bgImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  productHeader: {
    flexDirection: "row",
    height: 190,
  },
  productDetail: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.13)",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
  },
  titleContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 5,
  },
  title: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
});
export default productCard;
