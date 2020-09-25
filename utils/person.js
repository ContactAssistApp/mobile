import {NativeModules} from 'react-native';
import {getLocations} from '../realm/realmLocationTasks';
import { getContactsByDate } from '../realm/realmPersonTasks';

import { fetchContactsByDate, addPerson, updateContact, deleteContact} from '../realm/realmPersonTasks';

const Person = {
  fetchContactsByDate: async function(dateObj, dayRange = 0) {
    const persons = await getContactsByDate(dateObj, dayRange);
    return persons;
  },

  savePerson: async function(person) {
    // TODO: Add some filter check for the person here if possible
    addPerson(person);
  },

  updateContact: async function(contact) {
    updateContact(contact);
  },

  deleteContact: async function (contact) {
    deleteContact(contact);
  }
};

export default Person;
