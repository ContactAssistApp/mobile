const initialState = {
  BLEList: [], //An Array of Discovered Devices
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_BLE':
      const newBLE = [
        ...state.BLEList,
        action.device
      ];
      return {
        BLEList: newBLE,
      };
    default:
      return state;
  }
};

export default homeReducer;
