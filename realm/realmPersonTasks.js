import DateConverter from '../utils/date';
import RealmObj from './realm';

export async function addPerson(person) {
  try {
    const realm = await RealmObj.init();
    realm.write(() => {
      realm.create('Person',
        {...person},
        true,
      );
    });
  } catch (err) {
    console.log('add Person to realm error: ', err);
  }
}

export async function getContactsByDate(endDateTime, timeRange) {
  const realm = await RealmObj.init();
  const allPersons = realm.objects('Person');
  let startDateTime = new Date(endDateTime.valueOf());

  startDateTime.setDate(startDateTime.getDate() - timeRange);
  startDateTime.setHours(0, 0, 0, 0);
  endDateTime.setHours(23, 59, 59, 999);

  let Persons = allPersons.filtered(
    'time >= $0 && time <= $1 SORT(time ASC)',
    startDateTime.getTime(),
    endDateTime.getTime(),
  );
  return Persons;
}

export async function updateContact(contact) {
  console.log('laallala updating contact', contact);
  const realm = await RealmObj.init();
  realm.write(() => {
    let { id, name, phone, notes, label } = contact;
    const person = realm.objects('Person');
    person[id].time = new Date(date.replace(/-/g, '/')).getTime();
    person[id].name = name;
    person[id].phone = phone;
    person[id].label = label;
    person[id].notes = notes;
  })
}