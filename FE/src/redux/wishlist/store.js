import { createStore } from 'redux';
import wishlistReducer from './reducer';

const store = createStore(wishlistReducer);

export default store;
