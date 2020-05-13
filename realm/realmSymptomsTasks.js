import realm from './realm';

export function addSymptoms(symptoms) {
  try {
    realm.write(() => {
      realm.create('Symptoms', symptoms, true);
    });
  } catch (err) {
    console.log('add symptoms to realm error: ', err);
  }
}

export function getSymptoms(endDate, dateRange = 0) {
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

export function deleteSymptom(id) {
  try {
    realm.write(() => {
      realm.delete(realm.objectForPrimaryKey('Symptoms', id));
    });
  } catch (err) {
    console.log('delete symptom error: ', err);
  }
}
