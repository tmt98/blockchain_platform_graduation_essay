import {createStore} from 'redux';
import myReducer from './tokenDeviceApp';
const store = createStore(myReducer);
export default store;
