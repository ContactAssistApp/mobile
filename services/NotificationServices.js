import {Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

export default class NotificationServices {
  static start() {
    if (Platform.OS === 'ios') {
      PushNotification.configure({
        // (required) Called when a remote or local notification is opened or received
        onNotification: function(notification) {
        // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        },
        requestPermissions: true,
      });
    }
  }
}
