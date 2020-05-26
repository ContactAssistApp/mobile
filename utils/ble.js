const Ble = {
  start: function() {
  },

  stop: function() {
  },

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

  deleteAllData: async function() {
    return true;
  },
};

export default Ble;
