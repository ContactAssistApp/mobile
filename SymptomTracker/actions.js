export function updateSymptom(payload) {
  return {
    type: 'UPDATE_SYMPTOM',
    payload,
  };
}

export function clearSymptoms() {
  return {
    type: 'CLEAR_SYMPTOMS',
  };
}

export function resetSymptoms() {
  return {
    type: 'RESET_SYMPTOMS',
  };
}
