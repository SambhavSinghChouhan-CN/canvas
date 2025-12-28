import axios from 'axios';
import {
  FETCH_WISHLIST_REQUEST,
  FETCH_WISHLIST_SUCCESS,
  FETCH_WISHLIST_FAILURE,
  ADD_TO_WISHLIST_REQUEST,
  ADD_TO_WISHLIST_SUCCESS,
  ADD_TO_WISHLIST_FAILURE,
  REMOVE_FROM_WISHLIST_REQUEST,
  REMOVE_FROM_WISHLIST_SUCCESS,
  REMOVE_FROM_WISHLIST_FAILURE,
  CLEAR_WISHLIST
} from './actiontype';

// Action Creators
export const fetchWishlistRequest = () => ({
  type: FETCH_WISHLIST_REQUEST
});

export const fetchWishlistSuccess = (wishlist) => ({
  type: FETCH_WISHLIST_SUCCESS,
  payload: wishlist
});

export const fetchWishlistFailure = (error) => ({
  type: FETCH_WISHLIST_FAILURE,
  payload: error
});

export const addToWishlistRequest = () => ({
  type: ADD_TO_WISHLIST_REQUEST
});

export const addToWishlistSuccess = (wishlistItem) => ({
  type: ADD_TO_WISHLIST_SUCCESS,
  payload: wishlistItem
});

export const addToWishlistFailure = (error) => ({
  type: ADD_TO_WISHLIST_FAILURE,
  payload: error
});

export const removeFromWishlistRequest = () => ({
  type: REMOVE_FROM_WISHLIST_REQUEST
});

export const removeFromWishlistSuccess = (productId) => ({
  type: REMOVE_FROM_WISHLIST_SUCCESS,
  payload: productId
});

export const removeFromWishlistFailure = (error) => ({
  type: REMOVE_FROM_WISHLIST_FAILURE,
  payload: error
});

export const clearWishlist = () => ({
  type: CLEAR_WISHLIST
});

// Thunk Actions
export const fetchWishlist = () => {
  return async (dispatch) => {
    dispatch(fetchWishlistRequest());
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      dispatch(fetchWishlistSuccess(response.data));
    } catch (error) {
      dispatch(fetchWishlistFailure(error.response?.data?.message || error.message));
    }
  };
};

export const addToWishlist = (productId) => {
  return async (dispatch) => {
    dispatch(addToWishlistRequest());
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:8080/api/wishlist/${productId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      dispatch(addToWishlistSuccess(response.data));
    } catch (error) {
      dispatch(addToWishlistFailure(error.response?.data?.message || error.message));
    }
  };
};

export const removeFromWishlist = (productId) => {
  return async (dispatch) => {
    dispatch(removeFromWishlistRequest());
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/wishlist/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      dispatch(removeFromWishlistSuccess(productId));
    } catch (error) {
      dispatch(removeFromWishlistFailure(error.response?.data?.message || error.message));
    }
  };
};
