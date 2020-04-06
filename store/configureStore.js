import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../rootReducer.js';

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState
  );
}
