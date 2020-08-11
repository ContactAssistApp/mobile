import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import {Alert, Platform, Linking} from 'react-native';
import {addLocation} from 'realm/realmLocationTasks';
import Location from 'utils/location';
import DateConverter from 'utils/date';
import {strings} from 'locales/i18n';
import {getAreas} from 'realm/realmAreaMatchesTasks';
import PushNotification from 'react-native-push-notification';
import {GetStoreData} from 'utils/asyncStorage';
import {addBackgroundLog} from 'realm/realmLoggingTasks';

let instanceCount = 0;

export default class LocationServices {
  static start() {
    const checkAreaMatch = async ts => {
      const pastMessagesDB = getAreas(ts);
      let notifications = [];
      if (pastMessagesDB && pastMessagesDB.length > 0) {
        pastMessagesDB.forEach(match => {
          const {
            userMessage,
            area,
            area: {beginTime, endTime},
          } = match;
          // TODO: change isChecked to true
          if (Location.isAreaMatch(area) && userMessage.startsWith('{')) {
            notifications.push({
              ...JSON.parse(userMessage),
              beginTime,
              endTime,
            });
          }
        });

        if (notifications && notifications.length > 0) {
          const notificationEnabled = await GetStoreData('ENABLE_NOTIFICATION');
          if (notificationEnabled === 'true') {
            notifications.map(notification => {
              return PushNotification.localNotification({
                message: notification.description,
              });
            });
          }
        }
      }
    };
    const saveLocation = async (location, kind) => {
      const {
        latitude,
        longitude,
        accuracy,
        speed,
        altitude,
        provider,
        time,
      } = location;
      const logTime = DateConverter.getUTCUnixTime();
      addBackgroundLog('Location background log');

      // not available on iOS
      const source = provider === undefined ? 'device' : provider;

      checkAreaMatch(time);
      let addressObj = null;

      try {
        addressObj = await Location.convertToAddress({latitude, longitude});
        console.log('converted ' + latitude + ", " + longitude + " to: " +  JSON.stringify(addressObj));
      } catch (err) {
        console.log('reverse geoquery failed: ' + JSON.stringify(err));
        addressObj = {
          address: strings('location.unknown'),
          name: strings('location.unknown'),
        };
      }

      addLocation({
        latitude,
        longitude,
        accuracy,
        speed: speed ? speed : 0,
        altitude,
        kind,
        time,
        logTime,
        source,
        address: addressObj.address,
        name: addressObj.name,
      });
    };

    instanceCount += 1;

    if (instanceCount > 1) {
      BackgroundGeolocation.start();
      return;
    }

    let error_fun = (error) => {
      console.log('BGL error: ' + JSON.stringify(error));
    };

    let provider = Platform.OS === 'ios' ? BackgroundGeolocation.ACTIVITY_PROVIDER : BackgroundGeolocation.DISTANCE_FILTER_PROVIDER;

    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 30, // We can't distinguish two locations less than 50 meters apart
      distanceFilter: 1000, //We can't detect movement beyond this threshold. Reduce it to improve narrowcast accuracy
      debug: false, // when true, it beeps every time a loc is read
      stopOnTerminate: false,
      locationProvider: provider,

      activityType: 'OtherNavigation',
      pauseLocationUpdates: false,
      saveBatteryOnBackground: false,
    }, null, error_fun);

    // BackgroundGeolocation.getLogEntries(100, 0, 'DEBUG', newLogEntries => {
    //   newLogEntries.forEach(l => console.log(JSON.stringify(l)))
    // })

    BackgroundGeolocation.on('location', location => {
      // handle your locations here
      /* SAMPLE OF LOCATION DATA OBJECT
        {
          "accuracy": 20, "altitude": 5, "id": 114, "isFromMockProvider": false,
          "latitude": 37.4219983, "locationProvider": 1, "longitude": -122.084,
          "mockLocationsEnabled": false, "provider": "fused", "speed": 0,
          "time": 1583696413000
        }
      */
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        saveLocation(location, 'moving');
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', stationaryLocation => {
      // handle stationary locations here
      // Actions.sendLocation(stationaryLocation);
      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask

        // For capturing stationaryLocation. Note that it hasn't been
        // tested as I couldn't produce stationaryLocation callback in emulator
        // but since the plugin documentation mentions it, no reason to keep
        // it empty I believe.
        saveLocation(stationaryLocation, 'stationary');
        BackgroundGeolocation.endTask(taskKey);
      });
      console.log('[INFO] stationaryLocation:', stationaryLocation);
    });

    BackgroundGeolocation.on('error', error => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    let alertOnTheWay = false;
    var showLocationAlert = function() {
      if (alertOnTheWay) {
        return;
      }

      alertOnTheWay = true;
      // we need to set delay or otherwise alert may not be shown
      setTimeout(
        () =>
          Alert.alert(
            strings('location.permission_title'),
            strings('location.pemission_description'),
            [
              {
                text: strings('global.yes'),
                onPress: () => {
                  if (Platform.OS === 'android') {
                    // showLocationSettings() only works for android
                    BackgroundGeolocation.showLocationSettings();
                  } else {
                    Linking.openURL('App-Prefs:Privacy'); // Deeplinking method for iOS
                  }
                  alertOnTheWay = false;
                },
              },
              {
                text: strings('global.no'),
                onPress: () => {
                  alertOnTheWay = false;
                },
                style: 'cancel',
              },
            ],
          ),
        1000,
      );
    };

    BackgroundGeolocation.on('authorization', status => {
      console.log(
        '[INFO] BackgroundGeolocation authorization status: ' + status,
      );

      if (status !== BackgroundGeolocation.AUTHORIZED) {
        showLocationAlert();
      } else {
        BackgroundGeolocation.start(); //triggers start on start event

        // TODO: We reach this point on Android when location services are toggled off/on.
        //       When this fires, check if they are off and show a Notification in the tray
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.on('abort_requested', () => {
      console.log('[INFO] Server responded with 285 Updates Not Required');
      // Here we can decide whether we want stop the updates or not.
      // If you've configured the server to return 285, then it means the server does not require further update.
      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
      // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
    });

    BackgroundGeolocation.on('http_authorization', () => {
      console.log('[INFO] App needs to authorize the http requests');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] stop');
    });

    BackgroundGeolocation.on('stationary', () => {
      console.log('[INFO] stationary');
    });

    BackgroundGeolocation.checkStatus(status => {
      console.log(
        '[INFO] BackgroundGeolocation service is running',
        status.isRunning,
      );
      console.log(
        '[INFO] BackgroundGeolocation services enabled',
        status.locationServicesEnabled,
      );
      console.log(
        '[INFO] BackgroundGeolocation auth status: ' + status.authorization,
      );

      BackgroundGeolocation.start(); //triggers start on start event

      if (!status.locationServicesEnabled) {
        showLocationAlert();
      } else if (!status.authorization) {
        showLocationAlert();
      }
      // else if (!status.isRunning) {
      // } // commented as it was not being used
    });

    // you can also just start without checking for status
    // BackgroundGeolocation.start();
  }

  static stop(nav) {
    // unregister all event listeners
    BackgroundGeolocation.removeAllListeners();
    BackgroundGeolocation.stop();
    instanceCount -= 1;
  }
}
