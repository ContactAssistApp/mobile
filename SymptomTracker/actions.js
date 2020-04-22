export function updateSymptom(payload) {
  console.log(payload);
  return {
    type: 'UPDATE_SYMPTOM',
    payload,
  };
}
