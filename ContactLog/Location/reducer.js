const initialState = {
  date: '',
  addresses: [],
  openImportModal: false,
  imported: false,
  isImporting: false,
};

const contactLocationReducer = (state = initialState, action) => {
  const {payload, type} = action;
  switch (type) {
    case 'UPDATE_CONTACT_LOCATION_DATA':
      Object.entries(payload).forEach(([key, val]) => {
        state = {
          ...state,
          [key]: val,
        };
      });
      return state;

    default:
      return state;
  }
};

export default contactLocationReducer;
