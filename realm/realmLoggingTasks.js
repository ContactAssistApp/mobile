import RealmObj from './realm';

export async function addBackgroundLog(bgTask) {
  try {
    const realm = await RealmObj.init();
    realm.write(() => {
      realm.create('BackgroundTaskLog', bgTask);
    });
  } catch (err) {
    console.log('add bg task to realm error: ', err);
  }
}
