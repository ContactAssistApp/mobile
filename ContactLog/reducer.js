const initialState = {
  date: new Date(),
  allContacts: [],
  selectedContacts: [],
};

const contactLogReducer = (state = initialState, action) => {
  const {payload, type} = action;
  switch (type) {
    case 'UPDATE_CONTACT_LOG':
      const {field, value} = payload;
      const newState = {
        ...state,
        [field]: value,
      };
      return newState;

    default:
      return state;
  }
};

export default contactLogReducer;
