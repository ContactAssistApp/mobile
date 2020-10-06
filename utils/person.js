import {getContactsByDate} from 'realm/realmPersonTasks';
import {addPerson, updateContact, deleteContact} from 'realm/realmPersonTasks';

const Person = {
  fetchContactsByDate: async function(dateObj, dayRange = 0) {
    const persons = await getContactsByDate(dateObj, dayRange);
    return persons;
  },

  savePerson: async function(person) {
    addPerson(person);
  },

  updateContact: async function(contact) {
    updateContact(contact);
  },

  deleteContact: async function(contact) {
    deleteContact(contact);
  },
};

export default Person;
