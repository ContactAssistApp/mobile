import {combineReducers} from 'redux';
import homeReducer from './Home/reducer.js';
import navReducer from './Nav/reducer.js';
import symptomReducer from './SymptomTracker/reducer.js';

export default combineReducers({
  homeReducer,
  navReducer,
  symptomReducer,
});
