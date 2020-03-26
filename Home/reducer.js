const initialState = {
  BLEList: [], //An Array of Discovered Devices
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_BLE':
      if (
        state.BLEList.some(device => device.id === action.device.id) ||
        !action.device.isConnectable ||
        action.device.name === null
      ) {
        return state;
      } else {
        const newBLE = [...state.BLEList, action.device];
        console.log(newBLE);
        return {
          BLEList: newBLE,
        };
      }
    default:
      return state;
  }
};

export default homeReducer;
