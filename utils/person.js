import {NativeModules} from 'react-native';
import {getLocations} from '../realm/realmLocationTasks';
import { getContactsByDate } from '../realm/realmPersonTasks';

import { fetchContactsByDate, addPerson } from '../realm/realmPersonTasks';

//minimum accuracy of a location for us to care for
const MIN_ACCURACY = 100

const Person = {
  fetchContactsByDate: async function(dateObj, dayRange = 0) {
    console.log('fetchContactsByDate()', dateObj);
    const persons = await getContactsByDate(dateObj, dayRange);
    console.log('Persons fetched from database: ', persons);
    return persons;
  },

  savePerson: async function(person) {
    console.log('savePerson util()', person);
    // TODO: Add some filter check for the person here if possible
    addPerson(person);
  }
};

export default Person;
