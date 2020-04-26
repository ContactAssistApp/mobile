import {combineReducers} from 'redux';
import homeReducer from './Home/reducer.js';
import navReducer from './Nav/reducer.js';
import symptomReducer from './SymptomTracker/reducer.js';
import interviewPrepReducer from './InterviewPrep/reducer.js';
import contactLogReducer from './ContactLog/reducer.js';

export default combineReducers({
  homeReducer,
  navReducer,
  symptomReducer,
  interviewPrepReducer,
  contactLogReducer,
});
