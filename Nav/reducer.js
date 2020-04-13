const initialState = {
  enableFTUE: 'true',
};

const navReducer = (state = initialState, action) => {
  const {payload, type} = action;

  switch (action.type) {
    case 'UPDATE_FTUE':
      const {field, value} = payload;
      const newState = {
        ...state,
        [field]: value,
      };
      console.log("====REDUCCER===");
      console.log(newState);
      return {
        ...state,
        [field]: value,
      };

    default:
      return state;
  }
};

export default navReducer;
