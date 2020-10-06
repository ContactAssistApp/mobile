const initialState = {
  enableSave: false,
  name: '',
  phone: '',
  label: '',
  notes: '',
};

const newContactReducer = (state = initialState, action) => {
  const {payload, type} = action;
  switch (type) {
    case 'EDIT_CONTACT_DATA':
      Object.entries(payload).forEach(([key, val]) => {
        state = {
          ...state,
          [key]: val,
        };
      });
      return state;

    case 'RESET_CONTACT_DATA':
      return initialState;
    default:
      return state;
  }
};

export default newContactReducer;
