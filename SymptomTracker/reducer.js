const initialState = {
  fever: false,
  feverOnsetDate: '',
  feverTemperature: '',
  feverDays: '',
  abdominalPain: false,
  chills: false,
  cough: false,
  diarrhea: false,
  difficultyBreathing: false,
  headache: false,
  muscleAches: false,
  soreThroat: false,
  vomiting: false,
  other: false,
};

const symptomReducer = (state = initialState, action) => {
  const {payload, type} = action;

  switch (type) {
    case 'UPDATE_SYMPTOM':
      const {field, value} = payload;
      return {
        ...state,
        [field]: value,
      };

    default:
      return state;
  }
};

export default symptomReducer;
