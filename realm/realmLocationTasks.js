import DateConverter from '../utils/date';
import RealmObj from './realm';

export async function addLocation(location) {
  try {
    const realm = await RealmObj.init();
    realm.write(() => {
      realm.create('Location',
        {...location, timespan: ''},
        true,
      );
    });
  } catch (err) {
    console.log('add location to realm error: ', err);
  }
}

export async function addGoogleLocations(locations) {
  try {
    const realm = await RealmObj.init();
    realm.write(() => {
      locations.forEach(location => {
        const {time} = location;
        let start = new Date(time.valueOf());
        let end = new Date(time.valueOf());

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        let locationsOfDay = realm.objects('Location')
          .filtered(
            'time >= $0 && time <= $1 LIMIT(1)',
            start.getTime(),
            end.getTime(),
          );

        if (locationsOfDay.length === 0) {
          realm.create('Location', location, true);
        }
      });
    });
  } catch (err) {
    console.log('add google locations to realm error: ', err);
  }
}

export async function getDaysWithLocations() {
  const realm = await RealmObj.init();
  const locations = realm.objects('Location');
  let dates = [];
  locations.forEach(location => {
    const date = DateConverter.calendarFormat(new Date(location.time));
    if (!dates.includes(date)) {
      dates.push(date);
    }
  });
  return dates;
}

export async function getLocations(endDateTime, timeRange) {
  const realm = await RealmObj.init();
  const allLocations = realm.objects('Location');
  let startDateTime = new Date(endDateTime.valueOf());

  startDateTime.setDate(startDateTime.getDate() - timeRange);
  startDateTime.setHours(0, 0, 0, 0);
  endDateTime.setHours(23, 59, 59, 999);

  let locations = allLocations.filtered(
    'time >= $0 && time <= $1 SORT(time ASC)',
    startDateTime.getTime(),
    endDateTime.getTime(),
  );

  return locations;
}

export async function getLocationsWithTs(start, end) {
  const realm = await RealmObj.init();
  const allLocations = realm.objects('Location');
  let locations = allLocations.filtered(
    'time >= $0 && time <= $1 SORT(time ASC)',
    start,
    end,
  );

  return locations;
}

export async function deleteLocation(address) {
  try {
    const realm = await RealmObj.init();
    const locations = realm
      .objects('Location')
      .filtered('address == $0', address);
    realm.write(() => {
      realm.delete(locations);
    });
  } catch (err) {
    console.log('delete location error: ', err);
  }
}

export async function deleteLocationLog(callback) {
  try {
    const realm = await RealmObj.init();
    const locations = realm.objects('Location');
    realm.write(() => {
      realm.delete(locations);
      callback('success');
    });
  } catch (err) {
    console.log('delete location log error: ', err);
    callback(err);
  }
}
