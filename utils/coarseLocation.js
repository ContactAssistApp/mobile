import {GET_MESSAGE_LIST_URL} from './endpoints';
import {QUERY_SIZE_LIMIT, PRECISION_LIMIT} from './constants';
import {LocationData} from './LocationData';

export function getLatestCoarseLocation(isReporting = false) {
  return getLatestLocation().then(location => {
    if (location) {
      const {latitude: lat, longitude: lon} = location;
      const coarsLocation = getCoarseLocation(lat, lon, isReporting);
      return coarsLocation;
    }
    return null;
  });
}

async function getLatestLocation() {
  const locations = await LocationData.getLocationData();
  if (locations && locations.length > 0) {
    return locations[locations.length - 1];
  }
  return null;
}

function getCoarseLocation(lat, lon, isReporting) {
  const bestPrecision = PRECISION_LIMIT; //corresponds to 1 / 16 degree ~ 7 km
  const initialPrecision = isReporting ? bestPrecision : 0; // 0corresponds to 1 degrees ~ 111 km

  let precision = initialPrecision;
  let coarseLat = roundNew(lat, precision);
  let coarseLon = roundNew(lon, precision);

  for (; precision < bestPrecision; ++precision) {
    if (canWeAfford(coarseLat, coarseLon, precision)) {
      break;
    }
    coarseLat = roundNew(lat, precision);
    coarseLon = roundNew(lon, precision);
  }

  return {
    latitudePrefix: coarseLat,
    longitudePrefix: coarseLon,
    precision,
  };
}

async function canWeAfford(lat, lon, precision) {
  let querySize = await fetchQuerySize(lat, lon, precision);
  return querySize <= QUERY_SIZE_LIMIT ? true : false;
}

function fetchQuerySize(lat, lon, precision) {
  const url = `${GET_MESSAGE_LIST_URL}?lat=${lat}&lon=${lon}&precision=${precision}&lastTimestamp=0`;

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

function roundNew(d, precision) {
  let shift = 1 << 16; //16 is some number that 1 << 32 > 180 and bigger than maximum precision value that we are using
  return round(d + shift, precision) - shift;
}

function round(d, precision) {
  return (
    parseFloat(parseInt(d * Math.pow(2, precision))) / Math.pow(2, precision)
  );
}
