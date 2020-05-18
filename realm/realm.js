'use strict';
import {NativeModules} from 'react-native';
import Realm from 'realm';
const base64js = require('base64-js');

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

const getKey = async () => {
  try {
    const keyString = await NativeModules.EncryptionUtil.getRealmKey();
    if (keyString) {
      const key = base64js.toByteArray(keyString);
      return key;
    }
  } catch (e) {
    console.log('get realm key error: ' + e);
  }
};

class RealmObj {
  static async init() {
    let key = await getKey();
    return new Realm({
      schema: [Location.schema, Symptoms.schema],
      encryptionKey: key,
    });
  }
}
export default RealmObj;
