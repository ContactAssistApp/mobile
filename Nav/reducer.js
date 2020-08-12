const initialState = {
  enableFTUE: 'true',
};

const navReducer = (state = initialState, action) => {
  const {payload, type} = action;

  switch (type) {
    case 'UPDATE_FTUE':
      const {field, value} = payload;
      return {
        ...state,
        [field]: value,
      };

    default:
      return state;
  }
};

export default navReducer;
