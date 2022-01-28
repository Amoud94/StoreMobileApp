import { ADD_ORDER, FETCH_ORDERS } from "../actions/Order";
import Order from "../../models/Order";

const initialState = {
  orders: [],
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDERS: 
      return {
        orders : action.orders
      }
    case ADD_ORDER:
      const newOrder = new Order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.amount,
        action.orderData.date
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder),
      };
  }
  return state;
};
export default orderReducer;
