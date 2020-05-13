const initialState = {
  symptomsDate: new Date(),
  tabIdx: 0,
  symptomsMarkedDays: {},
  reportMarkedDays: {},
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
