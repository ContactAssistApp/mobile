const Ble = {

  getDeviceSeedAndRotate: function(interval) {
    throw new Error("seed rotation not supported")
  },

  runBleQuery: function(args) {
    throw new Error("query not supported")
  },

  updateLogWindow: function(logWindow) {
  },

  purgeOldRecords: function() {
  },
};

export default Ble;
