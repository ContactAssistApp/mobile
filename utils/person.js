import {NativeModules} from 'react-native';
import {getLocations} from '../realm/realmLocationTasks';
import { getContactsByDate } from '../realm/realmPersonTasks';

import { fetchContactsByDate, addPerson } from '../realm/realmPersonTasks';

const Person = {
  fetchContactsByDate: async function(dateObj, dayRange = 0) {
    const persons = await getContactsByDate(dateObj, dayRange);
    return persons;
  },

  savePerson: async function(person) {
    // TODO: Add some filter check for the person here if possible
    addPerson(person);
  }
};

export default Person;
