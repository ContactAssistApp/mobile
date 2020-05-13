import realm from './realm';
import DateConverter from '../utils/date';

export function addLocation(location) {
  try {
    realm.write(() => {
      realm.create('Location',
        {...location, source: 'device', timespan: ''},
        true,
      );
    });
  } catch (err) {
    console.log('add location to realm error: ', err);
  }
}

export function addGoogleLocations(locations) {
  try {
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

export function getDaysWithLocations() {
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

export function getLocations(endDateTime, timeRange) {
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
