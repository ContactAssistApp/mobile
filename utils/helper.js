import {GetStoreData, SetStoreData} from '../utils/asyncStorage';

export const DEFAULT_NOTIFICATION = 'Based on your location history, we believe you might have been in the same place as people infected with COVID-19.';

export function getLatestCoarseLocation() {
  return getLatestLocation().then(location => {
    const coarsLocation = getCoarseLocation(location);
    return coarsLocation;
  });
}

function getLatestLocation() {
  return GetStoreData('LOCATION_DATA').then(data => {
    const locations = JSON.parse(data);
    return locations[locations.length - 1];
  });
}

function getCoarseLocation(location) {
  return {
    latitudePrefix: location.latitude.toFixed(2),
    longitudePrefix: location.longitude.toFixed(2),
  };
}
