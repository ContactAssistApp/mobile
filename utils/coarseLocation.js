import {GetStoreData, SetStoreData} from '../utils/asyncStorage';

export function getLatestCoarseLocation() {
  return getLatestLocation().then(location => {
    const {latitude: lat, longitude: lon} = location;
    const coarsLocation = getCoarseLocation(lat, lon);
    return coarsLocation;
  });
}

function getLatestLocation() {
  return GetStoreData('LOCATION_DATA').then(data => {
    const locations = JSON.parse(data);
    return locations[locations.length - 1];
  });
}

function getCoarseLocation(lat, lon) {
  const initialPrecision = 0; //corresponds to 1 degrees ~ 111 km
  const bestPrecision = 4; //corresponds to 1 / 16 degree ~ 7 km

  for (let precision = initialPrecision; precision < bestPrecision; ++precision) {
    const coarseLat = round(lat, precision);
    const coarseLon = round(lon, precision);

    if (canWeAfford(coarseLat, coarseLon, precision)) {
      return {
        latitudePrefix: coarseLat,
        longitudePrefix: coarseLon,
        precision,
      };
    }
  }

  return {
    latitudePrefix: round(lat, bestPrecision),
    longitudePrefix: round(lat, bestPrecision),
    precision: bestPrecision,
  };
}

function canWeAfford(coarseLat, coarseLon, precision) {
  return true;
}

function round(d, precision) {
  return (
    parseFloat(parseInt(d * Math.pow(2, precision))) / Math.pow(2, precision)
  );
}
