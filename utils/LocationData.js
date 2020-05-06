import {GetStoreData, SetStoreData} from './asyncStorage';
import {DEFAULT_LOG_WINDOW} from './constants';
import {NativeModules} from 'react-native';

export class LocationData {
  constructor() {
    // Time (in milliseconds) between location information polls.
    // E.g. 10 minutes
    this.locationInterval = 10 * 60 * 1000;
  }

  /** 14 days in milliseconds. */
  static LOG_WINDOW = parseInt(DEFAULT_LOG_WINDOW, 10) * 24 * 60 * 60 * 1000;

  static getLocationData = async () => {
    const locationArrayString = await GetStoreData('LOCATION_DATA_ENCRYPT');
    let locationArray = [];
    if (locationArrayString) {
      try {
        let plainText = await NativeModules.EncryptionUtil.decryptWrapper(
          locationArrayString,
        );
        if (plainText) {
          locationArray = JSON.parse(plainText);
        }
      } catch (e) {
        console.log('error loading location data due to: ' + e);
      }
    }
    console.log(`[GPS] Loaded ${locationArray.length} location points`);
    return locationArray;
  };

  static getUTCUnixTime = () => {
    // Always work in UTC, not the local time in the locationData
    let nowUTC = new Date().toISOString();
    return Date.parse(nowUTC);
  };

  static getCuratedLocations = async () => {
    // Persist this location data in our local storage of time/lat/lon values
    let locationArray = await this.getLocationData();
    let unixtimeUTC = this.getUTCUnixTime();
    let unixtimeUTC_14daysAgo = unixtimeUTC - this.LOG_WINDOW;

    // Curate the list of points, only keep the last 14 days
    let curated = [];
    if (locationArray) {
      for (let i = 0; i < locationArray.length; i++) {
        if (locationArray[i].time > unixtimeUTC_14daysAgo) {
          curated.push(locationArray[i]);
        }
      }
    }
    return curated;
  };

  async appendCurrentLocation(location) {
    let curated = await this.constructor.getCuratedLocations();
    let unixtimeUTC = this.constructor.getUTCUnixTime();
    // Backfill the stationary points, if available
    if (curated.length >= 1) {
      let lastLocation = curated[curated.length - 1];
      let stopTS = unixtimeUTC - this.locationInterval;
      for (
        let lastTS = lastLocation.time;
        lastTS < stopTS;
        lastTS += this.locationInterval
      ) {
        curated.push(JSON.parse(JSON.stringify(lastLocation)));
      }
    }

    // Save the location using the current lat-lon and the
    // calculated UTC time (maybe a few milliseconds off from
    // when the GPS data was collected, but that's unimportant
    // for what we are doing.)
    let lat_lon_time = {
      latitude: location.latitude,
      longitude: location.longitude,
      time: unixtimeUTC,
    };
    curated.push(lat_lon_time);
    await this.constructor.saveCuratedLocations(curated);
  }

  static async saveCuratedLocations(curated) {
    console.log(`[GPS] Saving ${curated.length} location points`);
    let encryptedText = await NativeModules.EncryptionUtil.encryptWrapper(
      JSON.stringify(curated),
    );
    SetStoreData('LOCATION_DATA_ENCRYPT', encryptedText);
  }

  static mergeInLocations = async locations => {
    let curated = await this.getCuratedLocations();
    let combined = [...curated, ...locations].sort(
      (lhs, rhs) => lhs.time < rhs.time,
    );
    this.saveCuratedLocations(combined);
  };
}
