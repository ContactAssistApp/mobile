import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors';
import Toggle from '../views/Toggle';
import {GetStoreData, SetStoreData} from '../utils/asyncStorage';
import LocationServices from '../Home/LocationServices';
import {
  GET_QUERY_SIZE_URL,
  GET_MESSAGE_IDS_URL,
  FETCH_MESSAGE_INFO_URL,
} from '../utils/endpoints';
import Notification from './Notification';
import {DEFAULT_NOTIFICATION} from '../utils/helper';
import {getLatestCoarseLocation} from '../utils/coarseLocation';

class Home extends Component {
  constructor() {
    super();

    this.state = {
      location: false,
      ble: false,
      notifications: [],
    };
  }

  componentDidMount() {
    this.processQueries();
    BackgroundFetch.configure(
      {minimumFetchInterval: 15}, // <-- minutes (15 is minimum allowed)
      async taskId => {
        console.log('[js] Received background-fetch event: ', taskId);
        this.processQueries();
        BackgroundFetch.finish(taskId);
      },
      error => {
        console.log('[js] RNBackgroundFetch failed to start');
        console.log(error);
      },
    );

    // Optional: Query the authorization status.
    BackgroundFetch.status(status => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log('BackgroundFetch restricted');
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log('BackgroundFetch denied');
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log('BackgroundFetch is enabled');
          break;
      }
    });

    if (NativeModules.BLE.logSub === undefined) {
      const bleEmitter = new NativeEventEmitter(NativeModules.BLE);
      NativeModules.BLE.logSub = bleEmitter.addListener(
        'onLifecycleEvent',
        (data) => console.log("log:" +data)
      );
    }

    NativeModules.BLE.init_module(
      '8cf0282e-d80f-4eb7-a197-e3e0f965848d', //service ID
      'd945590b-5b09-4144-ace7-4063f95bd0bb', //characteristic ID
      {
        "DebugLog": "yes",
        "FastDevScan": "no"
      }
    );

    this.getSetting('ENABLE_LOCATION').then(data => {
      this.setState({
        location: data,
      });
    });

    this.getSetting('ENABLE_BLE').then(data => {
      this.setState({
        ble: data,
      });
    });

    this.getNotifications().then(data => {
      if (data) {
        this.setState({
          notifications: data,
        });
      }
    });
  }

  getSetting = key => {
    return GetStoreData(key).then(data => {
      return data === 'true' ? true : false;
    });
  };

  getNotifications = () => {
    return GetStoreData('NOTIFICATIONS').then(data => {
      if (data) {
        return JSON.parse(data);
      }
      return;
    });
  };

  processQueries = async () => {
    const location = await getLatestCoarseLocation();
    let querySize = await this.fetchQuerySize(location);

    if (querySize < 1000) {
      const messageIDs = await this.fetchMessageID(location);
      const messages = await this.fetchMessages(messageIDs);
      let args = [];
      let msgs = [];

      messages.forEach(messageObj => {
        const {bluetoothMatches} = messageObj;

        bluetoothMatches.forEach(match => {
          const {userMessage, seeds} = match;
          msgs.push(userMessage);
          let timestamps = [];
          let seedsArray = [];
          seeds.forEach(seedObj => {
            timestamps.push(seedObj.sequenceStartTime);
            seedsArray.push(seedObj.seed);
          });

          args.push(seedsArray);
          args.push(timestamps);
        });
      });

      let notifications = await this.searchQuery(args, msgs);
      if (notifications && notifications.length > 0) {
        SetStoreData('NOTIFICATIONS', notifications);
      }
    } else {
      // TODO: adjust coarse location
    }
  }

  searchQuery = async (args, msgs) => {
    return NativeModules.BLE.runBleQuery(args).then(
      results => {
        let notifications = [];
        results.forEach((result, index) => {
          if (result === 1) {
            const msg = msgs[index] ? msgs[index] : DEFAULT_NOTIFICATION;
            notifications.push(msg);
          }
        });
        return notifications;
      },
      error => {
        console.log(error);
      },
    );
  };

  fetchQuerySize = location => {
    const url = `${GET_QUERY_SIZE_URL}?lat=${location.latitudePrefix}&lon=${location.longitudePrefix}&precision=${location.precision}&lastTimestamp=0`;

    return fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        const {sizeOfQueryResponse} = data;
        return sizeOfQueryResponse;
      })
      .catch(err => {
        console.error(err);
      });
  };

  fetchMessageID = location => {
    const url = `${GET_MESSAGE_IDS_URL}?lat=${location.latitudePrefix}&lon=${location.longitudePrefix}&precision=${location.precision}&lastTimestamp=0`;

    return fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        const {messageInfoes} = data;
        return messageInfoes;
      })
      .catch(err => {
        console.error(err);
      });
  };

  fetchMessages = messageIDs => {
    return fetch(FETCH_MESSAGE_INFO_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        "RequestedQueries": messageIDs
      }),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        console.error(err);
      });
  };

  updateSetting = state => {
    if (state) {
      SetStoreData('ENABLE_LOCATION', 'true');
      SetStoreData('ENABLE_BLE', 'true');

      this.setState({
        location: true,
        ble: true,
      });

      LocationServices.start();
      NativeModules.BLE.start_ble();
    } else {
      SetStoreData('ENABLE_LOCATION', 'false');
      SetStoreData('ENABLE_BLE', 'false');

      this.setState({
        location: false,
        ble: false,
      });
      LocationServices.stop();
      NativeModules.BLE.stop_ble();
    }
  };

  render() {
    return (
      <SafeAreaView>
        <View style={styles.status_container}>
          <View style={styles.status_header}>
            <View>
              <Text style={styles.title}>CovidSafe</Text>
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.replace('Preferences')}>
              <Icon name="settings-outline" color={'white'} size={28} />
            </TouchableOpacity>
          </View>
          <View style={styles.broadcast_container}>
            <View style={styles.broadcast}>
              <Icon
                name="wifi"
                style={styles.broadcast_icon}
                color={'green'}
                size={24}
              />
              <View style={styles.broadcast_content}>
                <Text style={styles.broadcast_title}>Broadcasting</Text>
                <Text style={styles.broadcast_description}>
                  Location sharing and bluetooth{'\n'}tracing are turned on.
                  <Text
                    style={styles.settings}
                    onPress={() => {
                      this.props.navigation.replace('Preferences');
                    }}>
                    Settings
                  </Text>
                </Text>
              </View>
            </View>
            <View>
              <Toggle
                handleToggle={selectedState => {
                  this.updateSetting(selectedState);
                }}
                value={this.state.location || this.state.ble}
              />
            </View>
          </View>
        </View>

        {this.state.notifications && this.state.notifications.length > 0 && (
          <Notification notifications={this.state.notifications} />
        )}

        <View style={styles.resources_container}>
          <Text style={styles.resources_header}>Resources</Text>
          <FlatList
            data={[
              {
                key: 'cdc',
                title: 'CDC Guidance',
                description: 'Odio tempor orci dapibus ultrices in iaculis nanc sed monsd',
              },
              {
                key: 'nyc',
                title: 'NYC Health Guidance',
                description: 'Odio tempor orci dapibus ultrices in iaculis nanc sed monsd',
              },
            ]}
            renderItem={({item}) => {
              return (
                <View style={styles.resource}>
                  <View style={styles.resource_content}>
                    <Image
                      style={styles.resource_logo}
                      source={require('../assets/resources/logo_cdc.png')}
                    />
                    <View>
                      <Text style={styles.resource_title}>{item.title}</Text>
                      <Text style={styles.resource_description}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  <Icon
                    style={styles.right_arrow}
                    name="chevron-right"
                    color={colors.GRAY_20}
                    size={20}
                  />
                </View>
              );
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  status_container: {
    backgroundColor: colors.PURPLE_50,
    padding: 15,
  },
  status_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: '500',
  },
  broadcast_container: {
    backgroundColor: 'white',
    borderRadius: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_10,
    paddingHorizontal: 15,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  broadcast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  broadcast_icon: {
    paddingRight: 10,
  },
  broadcast_title: {
    fontSize: 18,
    lineHeight: 25,
    color: colors.GRAY_90,
  },
  broadcast_description: {
    fontSize: 12,
    lineHeight: 17,
    color: '#919191',
  },
  settings: {
    color: colors.PURPLE_50,
    fontWeight: 'bold',
  },
  resources_container: {
    backgroundColor: 'white',
    height: '100%',
  },
  resources_header: {
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 22,
    padding: 15,
  },
  resource: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: colors.GRAY_5,
    borderBottomWidth: 1,
  },
  resource_logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  resource_content: {
    flexDirection: 'row',
    flex: 0.8,
  },
  resource_title: {
    fontSize: 17,
    lineHeight: 22,
  },
  resource_description: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.GRAY_50,
  },
});

export default Home;
