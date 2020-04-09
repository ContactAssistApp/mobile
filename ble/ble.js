import {
    NativeModules,
    NativeEventEmitter,
} from 'react-native';


const Ble = {
    bleInit: function() {
        if (NativeModules.BLE.logSub === undefined) {
            const bleEmitter = new NativeEventEmitter(NativeModules.BLE);
            NativeModules.BLE.logSub = bleEmitter.addListener(
                'onLifecycleEvent',
                (data) => console.log("log:" + data)
            );
        }

        NativeModules.BLE.init_module(
            '8cf0282e-d80f-4eb7-a197-e3e0f965848d', //service ID
            'd945590b-5b09-4144-ace7-4063f95bd0bb', //characteristic ID
            {
                "DebugLog": "yes",
                "FastDevScan": "yes"
            }
        );
    },

    start: function() {
        bleInit();
        NativeModules.BLE.start_ble();
    },

    
    stop: function() {
        bleInit();
        NativeModules.BLE.stop_ble();
    },

    getDeviceSeedAndRotate: function(interval) {
        bleInit();
        return NativeModules.BLE.getDeviceSeedAndRotate(interval);
    },

    runBleQuery: function(args) {
        bleInit();
        return NativeModules.BLE.runBleQuery(args);
    }
}

export default Ble;