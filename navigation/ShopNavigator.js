import React from "react";
import { Platform, SafeAreaView, Button, View } from "react-native";
import { useDispatch } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createDrawerNavigator,
  DrawerItemList,
} from "@react-navigation/drawer";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import CustomHeaderButton from "../components/CustomHeaderButton";
import ProductOverViewScreen from "../screens/ProductOverViewScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import ProductCartScreen from "../screens/ProductCartScreen";
import UserProductScreen from "../screens/UserProductScreen";
import EditProductScreen from "../screens/EditProductScreen";
import OrdersScreen from "../screens/OrdersScreen";
import AuthScreen from "../screens/AuthScreen";
import * as authActions from "../store/actions/Auth";
const ProductStackNavigator = createNativeStackNavigator();
const UserStackNavigator = createNativeStackNavigator();
const MainDrawerNavigator = createDrawerNavigator();
const AuthStackNavigator = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator>
      <AuthStackNavigator.Screen
        name="authentication"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
    </AuthStackNavigator.Navigator>
  );
};

const ProductsNavigator = () => {
  return (
    <ProductStackNavigator.Navigator
      screenOptions={{
        headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
        headerStyle: {
          backgroundColor: Platform.OS === "android" ? Colors.primary : "",
        },
      }}
    >
      <ProductStackNavigator.Screen
        name="productOverView"
        component={ProductOverViewScreen}
        options={({ navigation }) => ({
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
                title="cart"
                iconName="ios-cart-outline"
                onPress={() => {
                  navigation.navigate("cartScreen");
                }}
              />
            </HeaderButtons>
          ),
          title: "All Products",
        })}
      />
      <ProductStackNavigator.Screen
        name="productDetail"
        component={ProductDetailsScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <ProductStackNavigator.Screen
        name="cartScreen"
        component={ProductCartScreen}
        options={{ title: "My Cart" }}
      />
    </ProductStackNavigator.Navigator>
  );
};

const UserNavigator = () => {
  return (
    <UserStackNavigator.Navigator
      screenOptions={{
        headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
        headerStyle: {
          backgroundColor: Platform.OS === "android" ? Colors.primary : "",
        },
      }}
    >
      <UserStackNavigator.Screen
        name="productOverView"
        component={UserProductScreen}
      />
      <UserStackNavigator.Screen
        name="productDetail"
        component={ProductDetailsScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <UserStackNavigator.Screen
        name="editProduct"
        component={EditProductScreen}
      />
    </UserStackNavigator.Navigator>
  );
};

export const MainNavigator = () => {
  const dispatch = useDispatch();

  return (
    <MainDrawerNavigator.Navigator
      screenOptions={{
        headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
        headerStyle: {
          backgroundColor: Platform.OS === "android" ? Colors.primary : "",
        },
      }}
      drawerContent={(props) => {
        return (
          <View
            style={{
              flex: 1,
              paddingTop: 40,
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
              <DrawerItemList {...props} />
              <View style={{ width: "100%", paddingTop: 658 }}>
                <Button
                  title="Logout"
                  color={Colors.primary}
                  onPress={() => {
                    dispatch(authActions.logout());
                  }}
                />
              </View>
            </SafeAreaView>
          </View>
        );
      }}
    >
      <MainDrawerNavigator.Screen
        name="All Products"
        component={ProductsNavigator}
        options={{
          drawerIcon: () => (
            <Ionicons
              name={Platform.OS === "android" ? "md-list" : "ios-list"}
              size={23}
            />
          ),
          headerShown: false,
        }}
      />
      <MainDrawerNavigator.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          drawerIcon: () => (
            <Ionicons
              name={Platform.OS === "android" ? "md-cart-outline" : "ios-cart"}
              size={23}
            />
          ),
        }}
      />
      <MainDrawerNavigator.Screen
        name="userProduct"
        component={UserNavigator}
        options={{
          title: "My Products",
          drawerIcon: () => (
            <Ionicons
              name={
                Platform.OS === "android" ? "md-create-outline" : "ios-create"
              }
              size={23}
            />
          ),
          headerShown: false,
        }}
      />
    </MainDrawerNavigator.Navigator>
  );
};
