import {combineReducers} from 'redux';
import navReducer from './Nav/reducer.js';
import symptomReducer from './SymptomTracker/reducer.js';
import interviewPrepReducer from './InterviewPrep/reducer.js';
import contactLogReducer from './ContactLog/reducer.js';
import healthReducer from './Health/reducer.js';
import contactLocationReducer from './ContactLog/Location/reducer.js';
import newLocationReducer from './ContactLog/NewLocation/reducer.js';

export default combineReducers({
  navReducer,
  symptomReducer,
  interviewPrepReducer,
  contactLogReducer,
  healthReducer,
  contactLocationReducer,
  newLocationReducer,
});
