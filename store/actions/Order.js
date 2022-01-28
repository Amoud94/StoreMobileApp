import Order from "../../models/Order";

export const ADD_ORDER = "ADD_ORDER";
export const FETCH_ORDERS = "FETCH_ORDERS";

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const userID = getState().auth.userID
    try {
      const loadedOrders = [];
      const response = await fetch(
        `https://rn-complete-guide-f0e96-default-rtdb.firebaseio.com/orders/${userID}.json`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error("Something went wrong !!");
      }
      const resData = await response.json();

      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            resData[key].date
          )
        );
      }
      dispatch({
        type: FETCH_ORDERS,
        orders: loadedOrders,
      });
    } catch (error) {
      throw error;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch , getState) => {
    const token = getState().auth.userToken
    const userID = getState().auth.userID
    const date = new Date();
    try {
      const response = await fetch(
        `https://rn-complete-guide-f0e96-default-rtdb.firebaseio.com/orders/${userID}.json?auth=${token}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            cartItems,
            totalAmount,
            date: date.toISOString(),
          }),
        }
      );
      const resData = await response.json();
      dispatch({
        type: ADD_ORDER,
        orderData: {
          id: resData.name,
          items: cartItems,
          amount: totalAmount,
          date: date,
        },
      });
    } catch (error) {
      throw error
    }
  };
};
