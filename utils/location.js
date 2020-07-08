import {NativeModules} from 'react-native';
import {getLocations} from '../realm/realmLocationTasks';

function distance(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344 * 1000; //distance in meter
    return dist;
  }
}

const Location = {
  convertToAddress: function(coordinate) {
    console.log('convertToAddress: ' + JSON.stringify(coordinate));
    return NativeModules.Locations.reverseGeoCode(coordinate);
  },
  fetchAddresses: async function(dateObj, dayRange = 0) {
    const locations = await getLocations(dateObj, dayRange);

    const addresses = locations.filter((location, index, self) => {
      return index === self.findIndex(t => t.address === location.address);
    })
    .map(location => {
      return {
        name: location.name,
        address: location.address,
      }
    });

    return addresses;
  },
  isAreaMatch: async function(area) {
    const {
      location: {latitude: targetLat, longitude: targetLon},
      radiusMeters,
      beginTime,
      endTime,
    } = area;

    const locations = await getLocations(new Date(), 14);
    if (locations && locations.length > 0) {
      locations.find(location => {
        const {latitude: lat, longitude: lon, time} = location;
        if (distance(lat, lon, targetLat, targetLon) <= radiusMeters &&
          beginTime <= time &&
          time <= endTime) {
          return true;
        }
      });
    }
    return false;
  },
};

export default Location;
