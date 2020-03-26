import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../rootReducer.js';
import {
  BleManager,
  BleError
} from 'react-native-ble-plx';

const DeviceManager = new BleManager();

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk.withExtraArgument(DeviceManager)),
  );
}
