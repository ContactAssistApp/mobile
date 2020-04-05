import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {Text} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

class Home extends Component {
  componentDidMount() {
    this.fetchQuery();
    BackgroundFetch.configure({
      minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
    }, async (taskId) => {
      console.log("[js] Received background-fetch event: ", taskId);
      console.log("==here is the bg task==");
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
    BackgroundFetch.status((status) => {
      switch(status) {
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
    const Tab = createBottomTabNavigator();
    return (
      <Text>Home</Text>
    );
  }
}

export default Home;
