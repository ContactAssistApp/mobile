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
} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors';
import Toggle from '../views/Toggle';

class Home extends Component {
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
  }

  fetchQuery = () => {
    const queryURL = 'https://covidsafe.azure-api.net/api/Trace/Query?regionId=39%2c-74&lastTimestamp=0';

    fetch(queryURL, {
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': '27f9b131532b4dcc93f19ccfbc299793'
      }
    })
      .then((response) => {
        if (!response.ok) {
          response.text().then((error) => {
            console.log(error);
            return;
          });
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.status_container}>
          <View style={styles.status_header}>
            <View>
              <Text style={styles.title}>
                CovidSafe
              </Text>
            </View>
            <TouchableOpacity onPress={()=>{}}>
              <Icon name="settings-outline" color={'white'} size={28} />
            </TouchableOpacity>
          </View>
          <View style={styles.broadcast_container}>
            <View style={styles.broadcast_header}>
              <Icon name="wifi" color={colors.PURPLE_50} size={20} />
              <Text style={styles.broadcast_text}>Broadcasting</Text>
            </View>
            <FlatList
              data={[
                {
                  key: 'location',
                  title: 'Location Tracking',
                },
                {
                  key: 'ble',
                  title: 'Bluetooth',
                },
              ]}
              renderItem={({item}) => {
                return (
                  <View style={styles.setting}>
                    <View style={styles.setting_content}>
                      <Text style={styles.setting_title}>{item.title}</Text>
                    </View>
                    <View style={styles.switch_container}>
                      <Toggle
                        handleToggle={(state) => {
                          this.updateSetting(item.key, state);
                        }}
                      />
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
        <View style={styles.resources_container}>
          <Text style={styles.resources_header}>
            Resources
          </Text>
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
                      <Text style={styles.resource_title}>
                        {item.title}
                      </Text>
                      <Text style={styles.resource_description}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  <Icon style={styles.right_arrow} name="chevron-right" color={colors.GRAY_20} size={20} />
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
    paddingVertical: 10
  },
  broadcast_text: {
    color: colors.PURPLE_50,
    fontSize: 18,
    lineHeight: 22,
    paddingLeft: 5,
    fontWeight: '500'
  },
  broadcast_header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_10,
    paddingHorizontal: 15,
    paddingBottom: 10,
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
  setting_content: {
    flex: 0.85,
  },
  switch_container: {
    flex: 0.15,
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
