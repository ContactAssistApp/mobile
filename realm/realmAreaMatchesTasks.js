import RealmObj from './realm';

export async function addAreas(areas) {
  try {
    const realm = await RealmObj.init();
    realm.write(() => {
      areas.forEach(area => {
        realm.create('AreaMatches', {...area, isChecked: false}, true);
      });
    });
  } catch (err) {
    console.log('add area to realm error: ', err);
  }
}

export async function getAreas(currentTime) {
  const realm = await RealmObj.init();
  let areas = realm
    .objects('AreaMatches')
    .filtered('area.beginTime <= $0 SORT(area.beginTime ASC)', currentTime);
  return areas;
}
