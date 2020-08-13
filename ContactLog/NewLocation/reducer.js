const initialState = {
  enableSave: false,
  name: '',
  address: '',
  // start: 0,
  // end: 0,
  // label: '',
  // note: '',
};

const newLocationReducer = (state = initialState, action) => {
  const {payload, type} = action;
  switch (type) {
    case 'EDIT_LOCATION_DATA':
      Object.entries(payload).forEach(([key, val]) => {
        state = {
          ...state,
          [key]: val,
        };
      });
      return state;

    case 'RESET_LOCATION_DATA':
      return initialState;
    default:
      return state;
  }
};

export default newLocationReducer;
