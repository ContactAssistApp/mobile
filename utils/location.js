import {NativeModules} from 'react-native';

const Location = {
  convertToAddress: function(coordinate) {
    return new Promise((resolve, reject) => {
      NativeModules.Locations.reverseGeoCode([coordinate], addresses => {
        resolve(addresses);
      });
    });
  },
};

export default Location;
