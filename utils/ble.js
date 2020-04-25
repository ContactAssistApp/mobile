import {NativeModules, NativeEventEmitter} from 'react-native';
import {BLE_SERVICE_ID, CHARACTERISTIC_ID} from './constants';

const Ble = {
  bleInit: function() {
    if (NativeModules.BLE.logSub === undefined) {
      const bleEmitter = new NativeEventEmitter(NativeModules.BLE);
      NativeModules.BLE.logSub = bleEmitter.addListener(
        'onLifecycleEvent',
        (data) => console.log('log:' + data)
      );
    }

    let config_opts = {};
    if (__DEV__) {
      config_opts = {
        "DebugLog": "yes",
        "FastDevScan": "yes"
      };
    }

    NativeModules.BLE.init_module(
      BLE_SERVICE_ID,
      CHARACTERISTIC_ID,
      config_opts
    );
  },

  start: function() {
    Ble.bleInit();
    NativeModules.BLE.start_ble();
  },

  stop: function() {
    Ble.bleInit();
    NativeModules.BLE.stop_ble();
  },

  getDeviceSeedAndRotate: function(interval) {
    Ble.bleInit();
    return NativeModules.BLE.getDeviceSeedAndRotate(interval);
  },

  runBleQuery: function(args) {
    Ble.bleInit();
    return NativeModules.BLE.runBleQuery(args);
  },

  updateLogWindow: function(logWindow) {
    //TODO: write logWindow value to native side storage
    // here logWindow is a string, e.g. '15'
  },
};

export default Ble;
