import {NativeModules} from 'react-native';
import {getLocations} from '../realm/realmLocationTasks';

const Location = {
  convertToAddress: function(coordinate) {
    return new Promise((resolve, reject) => {
      NativeModules.Locations.reverseGeoCode([coordinate], addresses => {
        resolve(addresses);
      });
    });
  },
  fetchAddresses: function(dateObj, dayRange = 0) {
    const locations = getLocations(dateObj, dayRange);

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
};

export default Location;
