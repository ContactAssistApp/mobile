export function editLocation(payload) {
  return {
    type: 'EDIT_LOCATION_DATA',
    payload,
  };
}

export function resetLocation() {
  return {
    type: 'RESET_LOCATION_DATA',
  };
}
