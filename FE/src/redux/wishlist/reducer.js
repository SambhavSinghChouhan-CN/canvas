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
import { initialWishlistState } from './state';

const wishlistReducer = (state = initialWishlistState, action) => {
  switch (action.type) {
    case FETCH_WISHLIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_WISHLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        wishlist: action.payload,
        error: null
      };

    case FETCH_WISHLIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ADD_TO_WISHLIST_REQUEST:
      return {
        ...state,
        addingToWishlist: true,
        error: null
      };

    case ADD_TO_WISHLIST_SUCCESS:
      return {
        ...state,
        addingToWishlist: false,
        wishlist: [...state.wishlist, action.payload],
        error: null
      };

    case ADD_TO_WISHLIST_FAILURE:
      return {
        ...state,
        addingToWishlist: false,
        error: action.payload
      };

    case REMOVE_FROM_WISHLIST_REQUEST:
      return {
        ...state,
        removingFromWishlist: true,
        error: null
      };

    case REMOVE_FROM_WISHLIST_SUCCESS:
      return {
        ...state,
        removingFromWishlist: false,
        wishlist: state.wishlist.filter(item => item.product.id !== action.payload),
        error: null
      };

    case REMOVE_FROM_WISHLIST_FAILURE:
      return {
        ...state,
        removingFromWishlist: false,
        error: action.payload
      };

    case CLEAR_WISHLIST:
      return {
        ...state,
        wishlist: [],
        error: null
      };

    default:
      return state;
  }
};

export default wishlistReducer;
