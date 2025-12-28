import { createStore } from 'redux';
import addressReducer from './reducer';

const store = createStore(addressReducer);

export default store;
