import axios from 'axios';
import {
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  CLEAR_CART_REQUEST,
  CLEAR_CART_SUCCESS,
  CLEAR_CART_FAILURE,
  ADD_TO_CART_LOCAL,
  REMOVE_FROM_CART_LOCAL,
  UPDATE_QUANTITY_LOCAL,
  CLEAR_CART_LOCAL
} from './actiontype';

// API base URL - adjust as needed
const API_BASE_URL = 'http://localhost:8080/api/cart';

// Helper to get auth token - adjust based on your auth implementation
const getAuthToken = () => {
  return localStorage.getItem('token'); // or however you store the token
};

// Helper to get user ID - adjust based on your auth implementation
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.id;
};

// Async Actions
export const fetchCart = () => async (dispatch) => {
  dispatch({ type: FETCH_CART_REQUEST });
  try {
    const userId = getUserId();
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const cartItems = response.data.map(item => ({
      id: item.id.toString(),
      name: item.product.name,
      price: item.product.price - (item.product.discount || 0),
      originalPrice: item.product.discount ? item.product.price : undefined,
      image: item.product.imageUrl,
      quantity: item.quantity,
      category: item.product.category || 'General' // Assuming category is available
    }));
    dispatch({ type: FETCH_CART_SUCCESS, payload: cartItems });
  } catch (error) {
    dispatch({ type: FETCH_CART_FAILURE, payload: error.message });
  }
};

export const addToCart = (productId, quantity = 1) => async (dispatch) => {
  dispatch({ type: ADD_TO_CART_REQUEST });
  try {
    const userId = getUserId();
    const token = getAuthToken();
    const response = await axios.post(`${API_BASE_URL}/${userId}`, {
      productId,
      quantity
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const item = response.data;
    const cartItem = {
      id: item.id.toString(),
      name: item.product.name,
      price: item.product.price - (item.product.discount || 0),
      originalPrice: item.product.discount ? item.product.price : undefined,
      image: item.product.imageUrl,
      quantity: item.quantity,
      category: item.product.category || 'General'
    };
    dispatch({ type: ADD_TO_CART_SUCCESS, payload: cartItem });
  } catch (error) {
    dispatch({ type: ADD_TO_CART_FAILURE, payload: error.message });
  }
};

export const updateCartItem = (cartItemId, quantity) => async (dispatch) => {
  dispatch({ type: UPDATE_CART_ITEM_REQUEST });
  try {
    const userId = getUserId();
    const token = getAuthToken();
    const response = await axios.put(`${API_BASE_URL}/${userId}/${cartItemId}`, {
      quantity
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const item = response.data;
    const cartItem = {
      id: item.id.toString(),
      name: item.product.name,
      price: item.product.price - (item.product.discount || 0),
      originalPrice: item.product.discount ? item.product.price : undefined,
      image: item.product.imageUrl,
      quantity: item.quantity,
      category: item.product.category || 'General'
    };
    dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: { id: cartItemId.toString(), cartItem } });
  } catch (error) {
    dispatch({ type: UPDATE_CART_ITEM_FAILURE, payload: error.message });
  }
};

export const removeCartItem = (cartItemId) => async (dispatch) => {
  dispatch({ type: REMOVE_CART_ITEM_REQUEST });
  try {
    const userId = getUserId();
    const token = getAuthToken();
    await axios.delete(`${API_BASE_URL}/${userId}/${cartItemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: cartItemId.toString() });
  } catch (error) {
    dispatch({ type: REMOVE_CART_ITEM_FAILURE, payload: error.message });
  }
};

export const clearCart = () => async (dispatch) => {
  dispatch({ type: CLEAR_CART_REQUEST });
  try {
    const userId = getUserId();
    const token = getAuthToken();
    await axios.delete(`${API_BASE_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: CLEAR_CART_SUCCESS });
  } catch (error) {
    dispatch({ type: CLEAR_CART_FAILURE, payload: error.message });
  }
};

// Local Actions (for immediate UI updates)
export const addToCartLocal = (item) => ({
  type: ADD_TO_CART_LOCAL,
  payload: item
});

export const removeFromCartLocal = (id) => ({
  type: REMOVE_FROM_CART_LOCAL,
  payload: id
});

export const updateQuantityLocal = (id, quantity) => ({
  type: UPDATE_QUANTITY_LOCAL,
  payload: { id, quantity }
});

export const clearCartLocal = () => ({
  type: CLEAR_CART_LOCAL
});
