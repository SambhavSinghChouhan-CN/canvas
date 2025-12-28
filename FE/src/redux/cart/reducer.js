import { initialState } from './state';
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

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Cart
    case FETCH_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
        totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
    case FETCH_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Add to Cart
    case ADD_TO_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ADD_TO_CART_SUCCESS:
      const existingItem = state.items.find(item => item.id === action.payload.id);
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      return {
        ...state,
        loading: false,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
    case ADD_TO_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Update Cart Item
    case UPDATE_CART_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case UPDATE_CART_ITEM_SUCCESS:
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id ? action.payload.cartItem : item
      );
      return {
        ...state,
        loading: false,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
    case UPDATE_CART_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Remove Cart Item
    case REMOVE_CART_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case REMOVE_CART_ITEM_SUCCESS:
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        loading: false,
        items: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
    case REMOVE_CART_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Clear Cart
    case CLEAR_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case CLEAR_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    case CLEAR_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Local Actions (for immediate UI updates)
    case ADD_TO_CART_LOCAL:
      const existingLocal = state.items.find(item => item.id === action.payload.id);
      let localItems;
      if (existingLocal) {
        localItems = state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        localItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      return {
        ...state,
        items: localItems,
        totalItems: localItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: localItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };

    case REMOVE_FROM_CART_LOCAL:
      const filteredLocal = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredLocal,
        totalItems: filteredLocal.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: filteredLocal.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };

    case UPDATE_QUANTITY_LOCAL:
      if (action.payload.quantity <= 0) {
        const filteredUpdate = state.items.filter(item => item.id !== action.payload.id);
        return {
          ...state,
          items: filteredUpdate,
          totalItems: filteredUpdate.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: filteredUpdate.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
      }
      const updatedLocal = state.items.map(item =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      return {
        ...state,
        items: updatedLocal,
        totalItems: updatedLocal.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedLocal.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };

    case CLEAR_CART_LOCAL:
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0
      };

    default:
      return state;
  }
};

export default cartReducer;
