import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {GetStoreData, SetStoreData} from '../../utils/asyncStorage';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateFTUE} from '../actions';
import Ble from '../../ble/ble';
import CustomIcon from '../../assets/icons/CustomIcon.js';
import LocationServices from '../../Home/LocationServices';
import PropTypes from 'prop-types';
import Toggle from '../../views/Toggle';
import colors from '../../assets/colors';
import {DEFAULT_LOG_WINDOW} from '../../utils/constants';

class Preferences extends Component {
  constructor(props) {
    super();
    this.state = {
      notification: false,
      location: false,
      ble: false,
      log_window: '',
    };
  }

  componentDidMount() {
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

    this.getLogWindow().then(data => {
      if (data) {
        this.setState({
          log_window: data,
        });
      } else {
        this.setState({
          log_window: DEFAULT_LOG_WINDOW,
        });

        SetStoreData('LOG_WINDOW', DEFAULT_LOG_WINDOW);
        Ble.updateLogWindow(DEFAULT_LOG_WINDOW);
      }
    });
  }

  getSetting = key => {
    return GetStoreData(key).then(data => {
      return data === 'true' ? true : false;
    });
  };

  getLogWindow = () => {
    return GetStoreData('LOG_WINDOW').then(data => {
      return data;
    });
  };

  updateSetting = (id, state) => {
    const storageKey = {
      notification: 'ENABLE_NOTIFICATION',
      location: 'ENABLE_LOCATION',
      ble: 'ENABLE_BLE',
    };

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
          Ble.start();
        } else {
          Ble.stop();
        }
        break;
    }

    SetStoreData(storageKey[id], state);
    this.setState({
      [id]: state,
    });
  };

  completeFTUE = () => {
    this.props.updateFTUE({
      field: 'enableFTUE',
      value: 'false',
    });
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.intro_container}>
            <Text style={styles.intro_text}>
              For improved location accuracy and awareness, turn on location permissions.
            </Text>
          </View>
          <View style={styles.settings}>
            <FlatList
              scrollEnabled={'false'}
              data={[
                {
                  key: 'notification',
                  title: 'Notifications',
                  description: 'Recieve notifications for local alerts and updates',
                  iconName: 'alert24',
                },
                {
                  key: 'location',
                  title: 'Location',
                  description: 'Share your location information with healthcare providers.',
                  iconName: 'location24',
                },
                {
                  key: 'ble',
                  title: 'Bluetooth',
                  description: 'Enables the detection of exposure risks within a close distance to you, anonymously.',
                  iconName: 'bluetooth24',
                },
                {
                  key: 'log_window',
                  title: 'Length of data storage',
                  description: 'Number of days until local logs are automatically deleted',
                  iconName: 'usage24',
                },
              ]}
              renderItem={({item}) => {
                if (item.key === 'log_window') {
                  return (
                    <View style={styles.setting}>
                      <CustomIcon
                        name={item.iconName}
                        color={colors.gray_icon}
                        size={24}
                        style={styles.setting_icon}
                      />
                      <View style={styles.setting_content}>
                        <Text style={styles.setting_title}>{item.title}</Text>
                        <Text style={styles.setting_description}>
                          {item.description}
                        </Text>
                      </View>
                      <TextInput
                        style={styles.log_window_input}
                        keyboardType={'numeric'}
                        onChangeText={text => {
                          this.setState({log_window: text});
                        }}
                        value={this.state.log_window}
                        maxLength={2}
                        onEndEditing={() => {
                          SetStoreData('LOG_WINDOW', this.state.log_window);
                          Ble.updateLogWindow(this.state.log_window);
                        }}
                      />
                    </View>
                  );
                } else {
                  return (
                    <View style={styles.setting}>
                      <CustomIcon
                        name={item.iconName}
                        color={colors.gray_icon}
                        size={24}
                        style={styles.setting_icon}
                      />
                      <View style={styles.setting_content}>
                        <Text style={styles.setting_title}>{item.title}</Text>
                        <Text style={styles.setting_description}>
                          {item.description}
                        </Text>
                      </View>
                      <Toggle
                        handleToggle={selectedState => {
                          this.updateSetting(item.key, selectedState);
                        }}
                        value={this.state[item.key]}
                        style={styles.toggle}
                      />
                    </View>
                  );
                }
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.next_button}
            onPress={() => {
              this.completeFTUE();
              navigate('BottomNav');
            }}>
            <Text style={styles.next_button_text}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
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
    color: colors.secondary_body_copy,
  },
  settings: {
    marginHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  setting: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setting_icon: {
    flex: 1,
    paddingRight: 15,
  },
  setting_content: {
    flex: 11,
  },
  toggle: {
    flex: 1,
  },
  log_window_input: {
    flex: 2,
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    textAlign: 'center',
  },
  setting_title: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: colors.body_copy,
    paddingBottom: 5,
  },
  setting_description: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.secondary_body_copy,
  },
  next_button: {
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 8,
    backgroundColor: colors.primary_theme,
    paddingVertical: 15,
    alignItems: 'center',
  },
  next_button_text: {
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: 'white',
  },
});

Preferences.propTypes = {
  updateFTUE: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateFTUE,
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(Preferences);
