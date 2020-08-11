import 'react-native-gesture-handler';
import React, {Component} from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import LocationServices from 'services/LocationServices';
import Notification from './Notification';
import colors from 'assets/colors';
import Toggle from 'views/Toggle';
import Header from 'views/Header';
import {
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {GET_MESSAGE_LIST_URL, FETCH_MESSAGE_INFO_URL} from '../utils/endpoints';
import {GetStoreData, SetStoreData} from 'utils/asyncStorage';
import {getLatestCoarseLocation} from 'utils/coarseLocation';
import Location from 'utils/location';
import SymptomTracker from 'SymptomTracker/SymptomTracker';
import SettingsModal from 'Settings/SettingsModal';
import ResourcesComponent from 'ResourcesComponent/ResourcesComponent';
import PrepareInterviewComponent from 'InterviewPrep/PrepareInterviewComponent';
import Privacy from 'Privacy/Privacy';
import PushNotification from 'react-native-push-notification';
import {strings} from 'locales/i18n';
import {addAreas} from 'realm/realmAreaMatchesTasks';
import {addBackgroundLog} from 'realm/realmLoggingTasks';
import DateConverter from 'utils/date';
import CareTips from 'CareTips/CareTips';

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
        addBackgroundLog('Narrowcast background fetch');
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
    const ts = await this.getTs();
    let location = await getLatestCoarseLocation(ts);
    let currentTime = new Date().getTime();

    if (location) {
      const messageIDs = await this.fetchMessageID(location);
      let notifications = [];

      if (messageIDs && messageIDs.length > 0) {
        const {narrowcastMessages} = await this.fetchMessages(messageIDs);
        let pastMessages = [];
        let futureMessages = [];

        narrowcastMessages.forEach((message, i) => {
          const {
            area: {beginTime, endTime},
          } = message;

          if (endTime <= currentTime) {
            pastMessages.push(message);
          } else if (beginTime <= currentTime && currentTime <= endTime) {
            pastMessages.push(message);
            futureMessages.push(message);
          } else {
            futureMessages.push(message);
          }
        });

        if (futureMessages && futureMessages.length > 0) {
          addAreas(futureMessages);
        }
        pastMessages.forEach(match => {
          const {
            userMessage,
            area,
            area: {beginTime, endTime},
          } = match;

          if (Location.isAreaMatch(area) && userMessage.startsWith('{')) {
            notifications.push({
              ...JSON.parse(userMessage),
              beginTime,
              endTime,
            });
          }
        });
      }

      if (notifications && notifications.length > 0) {
        this.setState({notifications});

        if (this.state.enable_notification) {
          notifications.map(notification => {
            return PushNotification.localNotification({
              message: notification.description,
            });
          });
        }
      }
    }
  };

  fetchMessageID = async location => {
    const ts = await this.getTs();
    const url = `${GET_MESSAGE_LIST_URL}&lat=${location.latitudePrefix}&lon=${location.longitudePrefix}&precision=${location.precision}&lastTimestamp=${ts}`;

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
        SetStoreData('LAST_QUERY_TS', DateConverter.getRoundedTime(new Date()));
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

  getTs = async () => {
    const ts = await GetStoreData('LAST_QUERY_TS');
    if (ts) {
      return ts;
    }
    return DateConverter.getRoundedTime(new Date());
  };

  render() {
    const isBroadcasting = this.state.location;
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
              <Header title={strings('app.name_one_line')} />
              <SettingsModal />
            </View>
            <View style={[styles.broadcast_container, broadcastBg]}>
              <View style={styles.broadcast}>
                <View style={styles.broadcast_content}>
                  <Text style={styles.broadcast_title}>
                    {strings('broadcasting.location_logging')}
                  </Text>
                  <Text style={styles.broadcast_description}>
                    {isBroadcasting
                      ? strings('global.logging')
                      : strings('global.stopping')}
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

          <PrepareInterviewComponent />

          <SymptomTracker
            navigate={this.props.navigation.navigate}
            date={new Date()}
          />

          <CareTips
            header={strings('care_tips.header')}
            tips={[
              {
                icon: 'accessibility24',
                title: strings('care_tips.hygiene_title'),
                content: strings('care_tips.hygiene_description'),
              },
              {
                icon: 'mask24',
                title: strings('care_tips.mask_title'),
                content: strings('care_tips.mask_description'),
              },
              {
                icon: 'social_distancing24',
                title: strings('care_tips.social_distance_title'),
                content: strings('care_tips.social_distance_description'),
              },
            ]}
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
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  status_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  broadcast_container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 26,
    marginHorizontal: 20,
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
    fontSize: 20,
    lineHeight: 26,
    paddingBottom: 6,
  },
  broadcast_description: {
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
