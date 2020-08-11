import DateConverter from 'utils/date';
import RealmObj from './realm';

export async function addSymptoms(symptoms) {
  try {
    const realm = await RealmObj.init();
    realm.write(() => {
      realm.create('Symptoms', symptoms, true);
    });
  } catch (err) {
    console.log('add symptoms to realm error: ', err);
  }
}

export async function getSymptoms(endDate, dateRange = 0) {
  const realm = await RealmObj.init();
  const allSymptoms = realm.objects('Symptoms');
  let startDate = new Date(endDate.valueOf());

  startDate.setDate(startDate.getDate() - dateRange);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  let symptoms = allSymptoms.filtered(
    'date >= $0 && date <= $1 SORT(date ASC)',
    startDate,
    endDate,
  );

  return symptoms;
}

export async function deleteSymptom(id) {
  try {
    const realm = await RealmObj.init();
    realm.write(() => {
      realm.delete(realm.objectForPrimaryKey('Symptoms', id));
    });
  } catch (err) {
    console.log('delete symptom error: ', err);
  }
}

export async function getDaysWithLog() {
  const realm = await RealmObj.init();
  const logs = realm.objects('Symptoms');
  let dates = [];
  logs.forEach(log => {
    const date = DateConverter.calendarFormat(new Date(log.ts));
    if (!dates.includes(date)) {
      dates.push(date);
    }
  });
  return dates;
}
