const initialState = {
  date: '',
  amHasLog: false,
  pmHasLog: false,
  amTs: '',
  pmTs: '',
  timeOfDay: '',
  fever: 0,
  feverOnsetDate: '',
  feverTemperature: '',
  feverDays: '',
  abdominalPain: 0,
  chills: 0,
  cough: 0,
  coughOnsetDate: '',
  coughDays: '',
  coughSeverity: 0,
  diarrhea: 0,
  difficultyBreathing: 0,
  headache: 0,
  muscleAches: 0,
  soreThroat: 0,
  vomiting: 0,
  other: 0,
};

const symptomReducer = (state = initialState, action) => {
  const {payload, type} = action;

  switch (type) {
    case 'UPDATE_SYMPTOM':
      Object.entries(payload).forEach(([key, val]) => {
        state = {
          ...state,
          [key]: val,
        };
      });
      return state;

    case 'CLEAR_SYMPTOMS':
      Object.entries(state).forEach(([key, val]) => {
        if (!['date','amHasLog', 'pmHasLog', 'amTs', 'pmTs'].includes(key)) {
          state = {
            ...state,
            [key]: initialState[key],
          };
        }
      });
      return state;

    default:
      return state;
  }
};

export default symptomReducer;
