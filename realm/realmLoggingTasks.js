import RealmObj from './realm';
import DateConverter from 'utils/date';

export async function addBackgroundLog(logLine) {
  var time = DateConverter.getUTCUnixTime();
  var bgTask = {
    taskId: logLine,
    localeTime: new Date(time).toLocaleString(),
    ts: time,
  };

  try {
    const realm = await RealmObj.init();
    realm.write(() => {
      realm.create('BackgroundTaskLog', bgTask);
    });
  } catch (err) {
    console.log('add bg task to realm error: ', err);
  }
}
