import {NativeModules} from 'react-native';
import {getLocations} from '../realm/realmLocationTasks';

//minimum accuracy of a location for us to care for
const MIN_ACCURACY = 100

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

    let candidates_dict = {}
    let possible_locs = []
    locations.forEach(loc => {
      //ignore unknown locations
      if(loc.name == 'Unknown')
        return;
      //ignore non-stationary locations 
      if(loc.speed > 1)
        return;
      //ignore low precision data points
      if(loc.accuracy > MIN_ACCURACY)
        return;
      if(!candidates_dict[loc.address])
      {  let g = {
          latitude: loc.latitude,
          longitude: loc.longitude,
          accuracy: loc.accuracy,
          name: loc.name,
          address: loc.address,
          count: 1,
          valid: true
        };
        candidates_dict[loc.address] = g;
        possible_locs.push(g);
      } else {
        let g = candidates_dict[loc.address];
        g.latitude += loc.latitude;
        g.longitude += loc.longitude;
        g.accuracy += loc.accuracy;
        g.count++;
      }
    });

    possible_locs.forEach(location => {
      location.latitude /= location.count;
      location.longitude /= location.count;
    })

    for (var i = 0; i < possible_locs.length; ++i) {
      var src = possible_locs[i];
      if(!src.valid)
        continue;
      for (var j = i + 1; j < possible_locs.length; ++j) {
        var dest = possible_locs[j]
        if(!dest.valid)
          continue;
        if(distance(src.latitude, src.longitude, dest.latitude, dest.longitude) < (src.accuracy + dest.accuracy) / 2) {
          if(src.count > dest.count) {
            dest.valid = false;
            src.count += dest.count;
          } else {
            src.valid = false;
            dest.count += src.count;
          }
        }
      }
    }

    return possible_locs.map(location => {
      return {
        name: location.name,
        address: location.address,
      }
    });
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
