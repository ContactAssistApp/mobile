const initialState = {
  diagnosisPageIdx: 0,
};

const healthReducer = (state = initialState, action) => {
  const {payload, type} = action;

  switch (type) {
    case 'UPDATE_PAGE_INDEX':
      const {field, value} = payload;
      return {
        ...state,
        [field]: value,
      };

    default:
      return state;
  }
};

export default healthReducer;
