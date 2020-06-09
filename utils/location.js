import {Platform, NativeModules} from 'react-native';
import {getLocations} from '../realm/realmLocationTasks';

const Location = {
  convertToAddress: function(coordinate) {
    console.log("convertToAddress:: " + JSON.stringify(coordinate));
    return NativeModules.Locations.reverseGeoCode(coordinate)
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
};

export default Location;
