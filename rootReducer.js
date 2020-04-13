import {combineReducers} from 'redux';
import homeReducer from './Home/reducer.js';
import navReducer from './Nav/reducer.js';

export default combineReducers({
  homeReducer,
  navReducer,
});
