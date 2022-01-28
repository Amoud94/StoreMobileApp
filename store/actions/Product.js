import Product from "../../models/Product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const GET_PRODUCTS = "GET_PRODUCTS";

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.userToken;
    const response = await fetch(
      `https://rn-complete-guide-f0e96-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong !!");
    }
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    const token = getState().auth.userToken;
    const userID = getState().auth.userID;
    try {
      const response = await fetch(
        `https://rn-complete-guide-f0e96-default-rtdb.firebaseio.com/products.json?auth=${token}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            imageUrl,
            price,
            ownerID: userID
          }),
        }
      );
      const resData = await response.json();
      dispatch({
        type: CREATE_PRODUCT,
        productData: {
          id: resData.name,
          ownerID: userID,
          title,
          description,
          imageUrl,
          price,
        },
      });
    } catch (error) {
      throw error;
    }
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.userToken;
    try {
      const response = await fetch(
        `https://rn-complete-guide-f0e96-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            imageUrl,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong !!");
      }
      dispatch({
        type: UPDATE_PRODUCT,
        pid: id,
        productData: {
          title,
          description,
          imageUrl,
        },
      });
    } catch (error) {
      throw error;
    }
  };
};

export const getProducts = () => {
  return async (dispatch, getState) => {
    const userID = getState().auth.userID
    try {
      const response = await fetch(
        "https://rn-complete-guide-f0e96-default-rtdb.firebaseio.com/products.json",
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error("Something went wrong !!");
      }
      const responseData = await response.json();
      const loadedProducts = [];
      for (const key in responseData) {
        loadedProducts.push(
          new Product(
            key,
            responseData[key].ownerID,
            responseData[key].title,
            responseData[key].imageUrl,
            responseData[key].description,
            responseData[key].price
          )
        );
      }
      dispatch({
        type: GET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter( product => product.ownerId === userID)
      });
    } catch (error) {
      throw error;
    }
  };
};
