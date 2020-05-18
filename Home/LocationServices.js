import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import {Alert, Platform, Linking} from 'react-native';
import {addLocation} from '../realm/realmLocationTasks';
import Location from '../utils/location';
import DateConverter from '../utils/date';

let instanceCount = 0;

export default class LocationServices {
  static start() {
    const saveLocation = location => {
      const {latitude, longitude} = location;
      const time = DateConverter.getUTCUnixTime();

      Location.convertToAddress({latitude, longitude, time}).then(addresses => {
        const name =
          addresses[0][0] === '' ? 'Unknown Location' : addresses[0][0];
        const addressString = addresses[0][1];

        addLocation({
          latitude,
          longitude,
          time,
          address: addressString,
          name,
        });
      });
    };

    instanceCount += 1;

    if (instanceCount > 1) {
      BackgroundGeolocation.start();
      return;
    }

    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.MEDIUM_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 3500,
      debug: true, // when true, it beeps every time a loc is read
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,

      activityType: 'AutomotiveNavigation',
      pauseLocationUpdates: false,
      saveBatteryOnBackground: false,
    });

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
        saveLocation(location);
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
        saveLocation(stationaryLocation);
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
            'CovidSafe requires access to location information',
            'Would you like to open app settings?',
            [
              {
                text: 'Yes',
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
                text: 'No',
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
