import {NativeModules} from 'react-native';
import {getLocations} from '../realm/realmLocationTasks';
import {fmt_date} from 'locales/i18n';

//minimum accuracy of a location for us to care for
const MIN_ACCURACY = 100;

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
    let final_locs = []
    let appendLoc = function(loc) {
      let cand = final_locs[final_locs.length - 1]
      let cand_lat = cand.latitude / cand.count
      let cand_lon = cand.longitude / cand.count

      let cross_addr_dist = distance(loc.latitude, loc.longitude, cand_lat, cand_lon)
      let acc = (loc.accuracy + (cand.accuracy / cand.count)) / 2
      if (cross_addr_dist > acc)
        return false;
      cand.latitude += loc.latitude
      cand.longitude += loc.longitude
      cand.count += 1
      cand.endTime = loc.time
      for(var addr in cand.locs) {
        if(addr[0] == loc.address) {
          addr[2]++
          return true;
        }
      }
      cand.locs.push([loc.address, loc.name, 1])
      return true;
    }

    locations.forEach(loc => {
      //ignore unknown locations
      if(loc.name == 'Unknown')
        return;
      //ignore non-stationary locations when moving beyond walking
      if(loc.speed > 1)
        return;
      //ignore low precision non stationary data points
      if(loc.accuracy > MIN_ACCURACY && loc.kind != 'stationary')
        return;
      if(final_locs.length == 0 || !appendLoc(loc))
      {
        final_locs.push({
          latitude: loc.latitude,
          longitude: loc.longitude,
          accuracy: loc.accuracy,
          count: 1,
          name: loc.name,
          address: loc.address,
          startTime: loc.time,
          endTime: loc.time,
          locs: [ [loc.address, loc.name, 1] ],
          timespan: loc.timespan,
          source: loc.source,
          time: loc.time,
        });
      }
    });

    return final_locs.map(location => {
      const {locs, startTime, endTime, timespan, source, time} = location;

      //find address
      let addr = null;
      locs.forEach(l => {
        if(addr == null || addr[3] < l[3])
          addr = l
      });

      let range = '';
      if (source === 'google' && timespan) {
        const timespans = timespan.split(',');
        const googleStart = fmt_date(new Date(timespans[0]), 'HH:mm');
        const googleEnd = fmt_date(new Date(timespans[1]), 'HH:mm');
        range = `${googleStart} - ${googleEnd}`;
      } else {
        range = fmt_date(new Date(startTime), 'HH:mm');
        if (startTime < endTime) {
          range += ' - ' + fmt_date(new Date(endTime), 'HH:mm');
        }
      }

      return {
        address: addr[0],
        name: addr[1],
        timerange: range,
        time,
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
