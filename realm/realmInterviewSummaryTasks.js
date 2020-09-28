import RealmObj from './realm';

export async function addSummary(ts) {
  try {
    const realm = await RealmObj.init();
    realm.write(() => {
      realm.create('InterviewSummary', {time: ts}, true);
    });
  } catch (err) {
    console.log('add location to realm error: ', err);
  }
}
