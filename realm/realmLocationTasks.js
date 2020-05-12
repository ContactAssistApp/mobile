import realm from './realm';
import DateConverter from '../utils/date';

export function addLocation(location) {
  try {
    realm.write(() => {
      realm.create('Location', location, true);
    });
  } catch (err) {
    console.log('add location to realm error: ', err);
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
