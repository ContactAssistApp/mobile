'use strict';
import {Platform, NativeModules} from 'react-native';
import Realm from 'realm';
import {generateSecureRandom} from 'react-native-securerandom';
import * as Keychain from 'react-native-keychain';
const base64js = require('base64-js');

class NarrowcastLocation extends Realm.Object {}
NarrowcastLocation.schema = {
  name: 'NarrowcastLocation',
  properties: {
    latitude: 'double',
    longitude: 'double',
  },
};

class Area extends Realm.Object {}
Area.schema = {
  name: 'Area',
  properties: {
    location: 'NarrowcastLocation',
    radiusMeters: 'double',
    beginTime: 'int',
    endTime: 'int',
  },
};

class AreaMatches extends Realm.Object {}
AreaMatches.schema = {
  name: 'AreaMatches',
  properties: {
    userMessage: 'string',
    area: 'Area',
    isChecked: 'bool',
  },
};

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

const REALM_PW_KEY = 'REALM_PW_KEY';
const REALM_KEY_SIZE = 64;

const createKey = async () => {
  const tmpString = base64js.fromByteArray(
    await generateSecureRandom(REALM_KEY_SIZE),
  );
  if (await Keychain.setGenericPassword(REALM_PW_KEY, tmpString)) {
    return tmpString;
  }
  return null;
};

let createKeyInstance = null;
const getKey = async () => {
  try {
    let keyString = null;
    if (Platform.OS === 'ios') {
      keyString = await NativeModules.EncryptionUtil.getRealmKey();
    } else {
      //this strings won't show up since they are only used if biometric auth is used (which isn't here)
      let credentials = await Keychain.getGenericPassword({
        authenticationPrompt: {
          title: 'CovidSafe Backend storage',
          subtitle: 'CovidSafe uses this password to protect your personal data',
          description: 'locally stored location data',
        },
      });

      if (credentials && credentials.username !== REALM_PW_KEY) {
        credentials = null;
        Keychain.resetGenericPassword();
      }
      if (credentials) {
        keyString = credentials.password;
      } else {
        //since this is async, it could race with multiple attempts at open
        if (!createKeyInstance) {
          createKeyInstance = createKey();
        }
        keyString = await createKeyInstance;
      }
    }
    if (keyString) {
      const key = base64js.toByteArray(keyString);
      return key;
    }
  } catch (e) {
    console.log('get realm key error: ' + JSON.stringify(e));
  }
};

let realmDbInstance = null;
class RealmObj {
  static async init() {
    if (realmDbInstance) {
      return realmDbInstance;
    }
    let key = await getKey();
    if (realmDbInstance == null) {
      realmDbInstance = Realm.open({
        schema: [
          Location.schema,
          Symptoms.schema,
          NarrowcastLocation.schema,
          Area.schema,
          AreaMatches.schema,
        ],
        encryptionKey: key,
      });
    }
    return await realmDbInstance;
  }
}
export default RealmObj;
