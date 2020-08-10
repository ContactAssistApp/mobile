const initialState = {
  symptomsDate: new Date(),
  symptomsMarkedDays: {},
};

const healthReducer = (state = initialState, action) => {
  const {payload, type} = action;
  switch (type) {
    case 'UPDATE_HEALTH_DATA':
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

export default healthReducer;
