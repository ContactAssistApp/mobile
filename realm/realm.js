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

class BackgroundTaskLog extends Realm.Object {}
BackgroundTaskLog.schema = {
  name: 'BackgroundTaskLog',
  properties: {
    taskId: 'string',
    localeTime: 'string',
    ts: 'int',
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

class Location0 extends Realm.Object {}
Location0.schema = {
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

class Location1 extends Realm.Object {}
Location1.schema = {
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

    //new fields
    accuracy: 'double',
    speed: 'double',
    altitude: 'double?',
    kind: 'string', //moving or stationary
  },
};

class Location2 extends Realm.Object {}
Location2.schema = {
  name: 'Location',
  primaryKey: 'time',
  properties: {
    latitude: 'double?',
    longitude: 'double?',
    time: 'int',
    logTime: 'int',
    address: 'string',
    name: 'string',
    source: 'string',
    timespan: 'string',

    //new fields
    accuracy: 'double',
    speed: 'double',
    altitude: 'double?',
    kind: 'string', //moving or stationary
  },
};

class Person extends Realm.Object {}
Person.schema = {
  name: 'Person',
  primaryKey: 'id',
  properties: {
    time: 'int',
    id: 'string',
    name: 'string',
    phone: 'string',
    notes: 'string',
    label: 'string',
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

class InterviewSummary extends Realm.Object {}
InterviewSummary.schema = {
  name: 'InterviewSummary',
  properties: {
    time: 'int',
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
          title: 'ContactAssist Backend storage',
          subtitle: 'ContactAssist uses this password to protect your personal data',
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

//migrate from schema0 to schema1
function addLocation1Fields(oldRealm, newRealm)
{
  if (oldRealm.schemaVersion >= 1)
    return;
  const newObjects = newRealm.objects('Location');
  for (let i = 0; i < newRealm.length; i++) {
    //use safe defaults
    newObjects[i].accuracy = 1;
    newObjects[i].speed = 0;
    newObjects[i].altitude = null;
    newObjects[i].kind = 'stationary';
  }
}

//migrate from schema0 to schema1
function addLogTimeField(oldRealm, newRealm)
{
  if (oldRealm.schemaVersion >= 1)
    return;
  const newObjects = newRealm.objects('Location');
  for (let i = 0; i < newRealm.length; i++) {
    //use safe defaults
    newObjects[i].logTime = newObjects[i].time;
  }
}

const schema0 = [
  Location0.schema,
  Symptoms.schema,
  NarrowcastLocation.schema,
  Area.schema,
  AreaMatches.schema,
];

const schema1 = [
  Location1.schema,
  Symptoms.schema,
  NarrowcastLocation.schema,
  Area.schema,
  AreaMatches.schema,
  BackgroundTaskLog.schema,
];

const schema2 = [
  Location2.schema,
  Symptoms.schema,
  NarrowcastLocation.schema,
  Area.schema,
  AreaMatches.schema,
  BackgroundTaskLog.schema,
  InterviewSummary.schema,
  Person.schema,
];

const schemas = [
  { schema: schema0, schemaVersion: 0 },
  { schema: schema1, schemaVersion: 1, migration: addLocation1Fields },
  { schema: schema2, schemaVersion: 2, migration: addLogTimeField },
];

let realmDbInstance = null;

class RealmObj {
  static async openRealm(key) {
    let nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath, key);
    console.log('current schema: ' + nextSchemaIndex + " latest schema " + schemas[schemas.length - 1].schemaVersion);

    if(nextSchemaIndex !== -1) {
      ++nextSchemaIndex; // our schemas are zero indexed
      while (nextSchemaIndex < schemas.length - 1) {
        console.log('opening')
        let migratedRealm = new Realm({
          ...schemas[nextSchemaIndex++],
          encryptionKey: key
        });
        migratedRealm.close();
      }
    }

    var obj = Realm.open({
      ...schemas[schemas.length - 1],
      encryptionKey: key,
    });
    return obj;
  }
  static async init() {
    if (realmDbInstance) {
      return realmDbInstance;
    }
    let key = await getKey();
    if (realmDbInstance == null) {
      realmDbInstance = RealmObj.openRealm(key);

    }
    return await realmDbInstance;
  }
}
export default RealmObj;
