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

class Home extends Component {
  constructor() {
    super();

    this.state = {
      location: false,
      ble: false,
    };
  }
  componentDidMount() {
    this.fetchQuery();

    BackgroundFetch.configure({
      minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
    }, async (taskId) => {
      console.log("[js] Received background-fetch event: ", taskId);
      this.fetchQuery();
      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // or assign battery-blame for consuming too much background-time
      BackgroundFetch.finish(taskId);
    }, (error) => {
      console.log("[js] RNBackgroundFetch failed to start");
      console.log(error);
    });

    // Optional: Query the authorization status.
    BackgroundFetch.status(status => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log("BackgroundFetch restricted");
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log("BackgroundFetch denied");
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log("BackgroundFetch is enabled");
          break;
      }
    });

    const bleEmitter = new NativeEventEmitter(NativeModules.BLE);
    this.subscriptions = [];
    this.subscriptions.push(bleEmitter.addListener(
      'onLifecycleEvent',
      (data) => console.log("log:" +data)
    ));

    NativeModules.BLE.init_module(
      '8cf0282e-d80f-4eb7-a197-e3e0f965848d', //service ID
      'd945590b-5b09-4144-ace7-4063f95bd0bb', //characteristic ID
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
  }

  getSetting = key => {
    return GetStoreData(key).then(data => {
      return data === 'true' ? true : false;
    });
  };

  fetchQuery = () => {
    const queryURL = 'https://covidsafe.azure-api.net/api/Trace/Query?regionId=39%2c-74&lastTimestamp=0';

    fetch(queryURL, {
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': '27f9b131532b4dcc93f19ccfbc299793'
      },
    })
      .then(response => {
        if (!response.ok) {
          response.text().then((error) => {
            console.log(error);
            return;
          });
        } else {
          return response.json();
        }
      })
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(err => {
        console.log(err);
      });
  }

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
        ble: false
      });
      LocationServices.stop();
      NativeModules.BLE.stop_ble();
    }
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <SafeAreaView>
        <View style={styles.status_container}>
          <View style={styles.status_header}>
            <View>
              <Text style={styles.title}>
                CovidSafe
              </Text>
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
                      this.props.navigation.replace('Preferences')
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
  broadcast_text: {
    color: colors.PURPLE_50,
    fontSize: 18,
    lineHeight: 22,
    paddingLeft: 5,
    fontWeight: '500',
  },
  setting: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
  },
  setting_title: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
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
    borderBottomWidth: 1
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
