export function editContact(payload) {
  return {
    type: 'EDIT_CONTACT_DATA',
    payload,
  };
}

export function resetContact() {
  return {
    type: 'RESET_CONTACT_DATA',
  };
}
