import { initialState } from './state';
import {
  FETCH_ADDRESSES_REQUEST,
  FETCH_ADDRESSES_SUCCESS,
  FETCH_ADDRESSES_FAILURE,
  ADD_ADDRESS_REQUEST,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAILURE,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAILURE,
  DELETE_ADDRESS_REQUEST,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_FAILURE
} from './actiontype';

const addressReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Addresses
    case FETCH_ADDRESSES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_ADDRESSES_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: action.payload
      };
    case FETCH_ADDRESSES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Add Address
    case ADD_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ADD_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: [...state.addresses, action.payload]
      };
    case ADD_ADDRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Update Address
    case UPDATE_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case UPDATE_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: state.addresses.map(address =>
          address.id === action.payload.id ? action.payload.address : address
        )
      };
    case UPDATE_ADDRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Delete Address
    case DELETE_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case DELETE_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: state.addresses.filter(address => address.id !== action.payload)
      };
    case DELETE_ADDRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default addressReducer;
