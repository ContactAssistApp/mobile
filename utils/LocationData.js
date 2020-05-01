import {GetStoreData, SetStoreData} from './asyncStorage';
import {DEFAULT_LOG_WINDOW} from './constants';

export class LocationData {
  constructor() {
    // Time (in milliseconds) between location information polls.
    // E.g. 10 minutes
    this.locationInterval = 10 * 60 * 1000;
    // 14 days in milliseconds.
    this.logWindow = parseInt(DEFAULT_LOG_WINDOW, 10) * 24 * 60 * 60 * 1000;
  }

  static getLocationData = async () => {
    const locationArrayString = await GetStoreData('LOCATION_DATA');
    let locationArray = [];
    if (locationArrayString) {
      locationArray = JSON.parse(locationArrayString);
    }
    return locationArray;
  };

  /*
    async getPointStats() {
      const locationData = await this.getLocationData();

      let lastPoint = null;
      let firstPoint = null;
      let pointCount = 0;

      if (locationData.length) {
        lastPoint = locationData.slice(-1)[0];
        firstPoint = locationData[0];
        pointCount = locationData.length;
      }

      return {
        lastPoint,
        firstPoint,
        pointCount,
      };
    }
  */

  async saveLocation(location) {
    // Persist this location data in our local storage of time/lat/lon values
    let locationArray = await this.getLocationData();
    // Always work in UTC, not the local time in the locationData
    let nowUTC = new Date().toISOString();
    let unixtimeUTC = Date.parse(nowUTC);
    let unixtimeUTC_14daysAgo = unixtimeUTC - this.logWindow;

    // Curate the list of points, only keep the last 14 days
    let curated = [];
    for (let i = 0; i < locationArray.length; i++) {
      if (locationArray[i]['time'] > unixtimeUTC_14daysAgo) {
        curated.push(locationArray[i]);
      }
    }

    // Backfill the stationary points, if available
    if (curated.length >= 1) {
      let lastLocationArray = curated[curated.length - 1];
      let lastTS = lastLocationArray['time'];
      for (
        ;
        lastTS < unixtimeUTC - this.locationInterval;
        lastTS += this.locationInterval
      ) {
        curated.push(JSON.parse(JSON.stringify(lastLocationArray)));
      }
    }

    // Save the location using the current lat-lon and the
    // calculated UTC time (maybe a few milliseconds off from
    // when the GPS data was collected, but that's unimportant
    // for what we are doing.)
    console.log('[GPS] Saving point:', locationArray.length);
    let lat_lon_time = {
      latitude: location['latitude'],
      longitude: location['longitude'],
      time: unixtimeUTC,
    };
    curated.push(lat_lon_time);
    console.log(curated);
    SetStoreData('LOCATION_DATA', curated);
  }
}
