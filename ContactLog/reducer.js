const initialState = {
  date: new Date(),
};

const contactLogReducer = (state = initialState, action) => {
  const {payload, type} = action;

  switch (type) {
    case 'UPDATE_DATE':
      const {field, value} = payload;
      return {
        ...state,
        [field]: value,
      };

    default:
      return state;
  }
};

export default contactLogReducer;
