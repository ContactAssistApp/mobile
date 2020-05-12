import realm from './realm';

export function addLocation(lat, lon, time) {
  try {
    realm.write(() => {
      realm.create(
        'Location',
        {
          latitude: lat,
          longitude: lon,
          time: time,
        },
        true,
      );
    });
  } catch (err) {
    console.log('add location to realm error: ', err);
  }
}
