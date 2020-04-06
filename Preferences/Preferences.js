import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import colors from '../assets/colors';
import Toggle from '../views/Toggle';
import LocationServices from '../Home/LocationServices';

class Preferences extends Component {
  constructor(props) {
    super();
    this.state = {
      notification: false,
      location: false,
      ble: false,
    };
  }

  componentDidMount() {
    const bleEmitter = new NativeEventEmitter(NativeModules.BLE);

    this.subscriptions = []
    this.subscriptions.push(bleEmitter.addListener(
      'onLifecycleEvent',
      (data) => console.log("log:" +data)
    ));

    NativeModules.BLE.init_module(
      '8cf0282e-d80f-4eb7-a197-e3e0f965848d', //service ID
      'd945590b-5b09-4144-ace7-4063f95bd0bb' //characteristic ID
    );
  }

  updateSetting = (id, state) => {
    switch (id) {
      case 'notification':
        break;
      case 'location':
        if (state) {
          LocationServices.start();
        } else {
          LocationServices.stop();
        }
        break;
      case 'ble':
        if (state) {
          NativeModules.BLE.start_ble();
        } else {
          NativeModules.BLE.stop_ble();
        }
        break;
    }
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.intro_container}>
          <Text style={styles.intro_text}>
            Egestas tellus rutrum tellus pellentesque eu tincidunt. Odio tempor orci dapibus ultrices in iaculis nunc sed augue.
          </Text>
        </View>
        <View style={styles.settings}>
          <FlatList
            data={[
              {
                key: 'notification',
                title: 'Notifications',
                description: 'Recieve notifications for local alerts and updates',
              },
              {
                key: 'location',
                title: 'Location',
                description: 'Share your location information with healthcare providers.',
              },
              {
                key: 'ble',
                title: 'Bluetooth',
                description: 'Odio tempor orci dapibus ultrices in iaculis nunc sed augue.',
              },
            ]}
            renderItem={({item}) => {
              return (
                <View style={styles.setting}>
                  <View style={styles.setting_content}>
                    <Text style={styles.setting_title}>{item.title}</Text>
                    <Text style={styles.setting_description}>
                      {item.description}
                    </Text>
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
        <View>
          <TouchableOpacity
            style={styles.next_button}
            onPress={() => navigate('BottomNav')}
          >
            <Text style={styles.next_button_text}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  intro_container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  intro_text: {
    color: colors.GRAY_50,
  },
  settings: {
    marginHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  setting: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
    flexDirection: 'row',
  },
  setting_title: {
    fontSize: 16,
    lineHeight: 23,
  },
  setting_description: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.GRAY_50,
  },
  setting_content: {
    flex: 0.85,
  },
  switch_container: {
    flex: 0.15,
  },
  next_button: {
    marginHorizontal: 20,
    marginVertical: 30,
    borderRadius: 2,
    backgroundColor: colors.PURPLE_50,
    paddingVertical: 15,
    alignItems: 'center',
  },
  next_button_text: {
    color: 'white',
  }
});

export default Preferences;
