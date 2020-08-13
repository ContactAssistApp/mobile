const initialState = {
  date: '',
  addresses: [],
  openImportModal: false,
  openLocationModal: false,
  imported: false,
  isImporting: false,
  selectedTime: 0,
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
