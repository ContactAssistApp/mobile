import RealmObj from './realm';

export async function addPerson(person) {
  try {
    const realm = await RealmObj.init();
    realm.write(() => {
      realm.create('Person', {...person}, true);
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
  await addPerson(contact); // Because Realm auto updates if it's the same id
}

export async function deleteContact(contact) {
  try {
    const realm = await RealmObj.init();
    realm.write(() => {
      let person = realm.objectForPrimaryKey('Person', contact.id);
      realm.delete(person);
    });
  } catch (err) {
    console.log('delete person from realm error: ', err);
  }
}
