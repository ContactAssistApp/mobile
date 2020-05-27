import 'react-native-gesture-handler';
import React, {Component} from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import LocationServices from '../Home/LocationServices';
import Notification from './Notification';
import Toggle from '../views/Toggle';
import colors from '../assets/colors';
import {
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import {GET_MESSAGE_LIST_URL, FETCH_MESSAGE_INFO_URL} from '../utils/endpoints';
import {DEFAULT_NOTIFICATION} from '../utils/constants';
import {GetStoreData, SetStoreData} from '../utils/asyncStorage';
import {getLatestCoarseLocation} from '../utils/coarseLocation';
import SymptomTracker from '../SymptomTracker/SymptomTracker';
import SettingsModal from '../Settings/SettingsModal';
import ResourcesComponent from '../ResourcesComponent/ResourcesComponent';
import {UW_URL} from '../utils/constants';
import Privacy from '../Privacy/Privacy';
import PushNotification from 'react-native-push-notification';
import {strings} from '../locales/i18n';

class Home extends Component {
  constructor() {
    super();

    this.state = {
      refreshing: false,
      location: false,
      enable_notification: false,
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

    this.getSetting('ENABLE_LOCATION').then(data => {
      if (data) {
        this.setState({
          location: data,
        });
        LocationServices.start();
      }
    });

    this.getSetting('ENABLE_NOTIFICATION').then(data => {
      this.setState({
        enable_notification: data,
      });
    });
  }

  getSetting = key => {
    return GetStoreData(key).then(data => {
      return data === 'true' ? true : false;
    });
  };

  processQueries = async () => {
    let location = await getLatestCoarseLocation();
    if (location) {
      const messageIDs = await this.fetchMessageID(location);
      if (messageIDs && messageIDs.length > 0) {
        // const messages = await this.fetchMessages(messageIDs);
        let notifications = await this.searchQuery();
        if (notifications && notifications.length > 0) {
          this.setState({notifications});

          if (this.state.enable_notification) {
            notifications.map(notification => {
              return PushNotification.localNotification({
                message: notification,
              });
            });
          }
        }
      }
    }
  };

  searchQuery = async () => {
    return [];
  };

  fetchMessageID = location => {
    const url = `${GET_MESSAGE_LIST_URL}?lat=${location.latitudePrefix}&lon=${location.longitudePrefix}&precision=${location.precision}&lastTimestamp=0`;

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

      this.setState({
        location: true,
      });

      LocationServices.start();
    } else {
      SetStoreData('ENABLE_LOCATION', 'false');

      this.setState({
        location: false,
      });
      LocationServices.stop();
    }
  };

  handleOnRefresh = () => {
    this.setState({
      refreshing: true,
    });

    this.processQueries().then(() => this.setState({refreshing: false}));
  };

  render() {
    const isBroadcasting = this.state.location;
    const broadcastStatus = isBroadcasting
      ? strings('broadcasting.on_text')
      : strings('broadcasting.off_text');
    const broadcastBg = isBroadcasting
      ? styles.broadcast_on
      : styles.broadcast_off;

    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleOnRefresh}
            />
          }>
          <View style={styles.status_container}>
            <View style={styles.status_header}>
              <View style={styles.title_container}>
                <Image
                  style={styles.logo}
                  source={require('../assets/home/logo.png')}
                />
                <Text style={styles.title}>{strings('app.name_one_line')}</Text>
              </View>
              <SettingsModal />
            </View>
            <View style={[styles.broadcast_container, broadcastBg]}>
              <View style={styles.broadcast}>
                <View style={styles.broadcast_content}>
                  <Text style={styles.broadcast_title}>
                    {`${broadcastStatus}`}
                  </Text>
                  <Text style={styles.broadcast_description}>
                    {isBroadcasting
                      ? strings('global.logging')
                      : strings('global.stopping')}
                    <Text
                      style={styles.lear_more_link}
                      onPress={() => Linking.openURL(UW_URL)}>
                      {strings('learn.more_link_text')}
                    </Text>
                  </Text>
                </View>
              </View>
              <Toggle
                handleToggle={selectedState => {
                  this.updateSetting(selectedState);
                }}
                value={this.state.location}
                style={styles.toggle}
              />
            </View>
          </View>

          {this.state.notifications && this.state.notifications.length > 0 && (
            <Notification notifications={this.state.notifications} />
          )}

          <SymptomTracker
            navigate={this.props.navigation.navigate}
            date={new Date()}
          />

          <ResourcesComponent />
          <Privacy />
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  status_bar: {
    backgroundColor: 'white',
  },
  status_container: {
    backgroundColor: 'white',
    padding: 10,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  title: {
    color: colors.section_title,
    fontSize: 24,
    fontWeight: '500',
  },
  title_container: {
    flexDirection: 'row',
  },
  status_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    alignItems: 'center',
  },
  broadcast_container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 16,
    marginHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  broadcast_on: {
    backgroundColor: colors.fill_on,
  },
  broadcast_off: {
    backgroundColor: colors.fill_off,
  },
  broadcast_title: {
    color: colors.module_title,
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.35,
    paddingBottom: 10,
  },
  broadcast_description: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.secondary_body_copy,
  },
  lear_more_link: {
    color: colors.primary_theme,
  },
  resources_container: {
    backgroundColor: 'white',
    height: '100%',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 10,
  },
  resources_header: {
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.35,
    color: colors.module_title,
  },
  resource: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: colors.module_title,
  },
  resource_logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  resource_title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.408,
    color: colors.module_title,
  },
  resource_description: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.secondary_body_copy,
  },
  broadcast: {
    flex: 1,
  },
});

export default Home;
