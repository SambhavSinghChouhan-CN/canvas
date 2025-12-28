import axios from 'axios';
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

// API base URL - adjust as needed
const API_BASE_URL = 'http://localhost:8080/api/addresses';

// Helper to get auth token - adjust based on your auth implementation
const getAuthToken = () => {
  return localStorage.getItem('token'); // or however you store the token
};

// Async Actions
export const fetchAddresses = () => async (dispatch) => {
  dispatch({ type: FETCH_ADDRESSES_REQUEST });
  try {
    const token = getAuthToken();
    const response = await axios.get(API_BASE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: FETCH_ADDRESSES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_ADDRESSES_FAILURE, payload: error.message });
  }
};

export const addAddress = (addressData) => async (dispatch) => {
  dispatch({ type: ADD_ADDRESS_REQUEST });
  try {
    const token = getAuthToken();
    const response = await axios.post(API_BASE_URL, addressData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: ADD_ADDRESS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: ADD_ADDRESS_FAILURE, payload: error.message });
  }
};

export const updateAddress = (id, addressData) => async (dispatch) => {
  dispatch({ type: UPDATE_ADDRESS_REQUEST });
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API_BASE_URL}/${id}`, addressData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: UPDATE_ADDRESS_SUCCESS, payload: { id, address: response.data } });
  } catch (error) {
    dispatch({ type: UPDATE_ADDRESS_FAILURE, payload: error.message });
  }
};

export const deleteAddress = (id) => async (dispatch) => {
  dispatch({ type: DELETE_ADDRESS_REQUEST });
  try {
    const token = getAuthToken();
    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: DELETE_ADDRESS_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_ADDRESS_FAILURE, payload: error.message });
  }
};
