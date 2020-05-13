'use strict';

import Realm from 'realm';

class Location extends Realm.Object {}
Location.schema = {
  name: 'Location',
  primaryKey: 'time',
  properties: {
    latitude: 'double',
    longitude: 'double',
    time: 'int',
    address: 'string',
    name: 'string',
    source: 'string',
    timespan: 'string',
  },
};

class Symptoms extends Realm.Object {}
Symptoms.schema = {
  name: 'Symptoms',
  primaryKey: 'dateTime',
  properties: {
    dateTime: 'string',
    date: 'date',
    timeOfDay: 'string',
    ts: 'int',
    fever: 'int',
    feverOnsetDate: 'string',
    feverTemperature: 'float',
    feverDays: 'int',
    abdominalPain: 'int',
    chills: 'int',
    cough: 'int',
    coughOnsetDate: 'string',
    coughDays: 'int',
    coughSeverity: 'int',
    diarrhea: 'int',
    difficultyBreathing: 'int',
    headache: 'int',
    muscleAches: 'int',
    soreThroat: 'int',
    vomiting: 'int',
    other: 'int',
  },
};

export default new Realm({schema: [Location.schema, Symptoms.schema]});
