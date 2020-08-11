import {GET_MESSAGE_LIST_URL} from './endpoints';
import {QUERY_SIZE_LIMIT, PRECISION_LIMIT} from './constants';
import {getLocations} from 'realm/realmLocationTasks';

export async function getLatestCoarseLocation(ts) {
  const location = await getLatestLocation();
  if (location) {
    const {latitude: lat, longitude: lon} = location;
    const coarseLocation = await getCoarseLocation(lat, lon, ts);
    return coarseLocation;
  }
  return null;
}

async function getLatestLocation() {
  const locations = await getLocations(new Date(), 0);
  if (locations && locations.length > 0) {
    return locations[locations.length - 1];
  }
  return null;
}

async function getCoarseLocation(lat, lon, ts) {
  const bestPrecision = PRECISION_LIMIT; // from -180degree to 180 degree
  const initialPrecision = 0; // 0 corresponds to entire globe, 8 corresponds to 1 degree.

  let precision = initialPrecision;
  let coarseLat = round(lat, precision);
  let coarseLon = round(lon, precision);

  for (; precision < bestPrecision; ++precision) {
    if (await canWeAfford(coarseLat, coarseLon, precision, ts)) {
      break;
    }
    coarseLat = round(lat, precision);
    coarseLon = round(lon, precision);
  }

  return {
    latitudePrefix: coarseLat,
    longitudePrefix: coarseLon,
    precision,
  };
}

async function canWeAfford(lat, lon, precision, ts) {
  let querySize = await fetchQuerySize(lat, lon, precision, ts);
  return querySize <= QUERY_SIZE_LIMIT ? true : false;
}

function fetchQuerySize(lat, lon, precision, ts) {
  const url = `${GET_MESSAGE_LIST_URL}&lat=${lat}&lon=${lon}&precision=${precision}&lastTimestamp=${ts}`;
  return fetch(url, {
    method: 'HEAD',
  })
    .then(response => {
      return response.headers.get('content-length');
    })
    .catch(err => {
      console.error(err);
    });
}

function round(x, precision) {
  const bits = Math.max(8 - precision, 0);
  return x >= 0
    ? (Math.round(x) >> bits) << bits
    : -((-Math.round(x)) >> bits << bits);
}
