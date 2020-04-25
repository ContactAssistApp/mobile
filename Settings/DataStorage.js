import React, {Component} from 'react';
import {DEFAULT_LOG_WINDOW} from '../utils/constants';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {GetStoreData, SetStoreData} from '../utils/asyncStorage';
import Ble from '../utils/ble';
import CustomIcon from '../assets/icons/CustomIcon.js';
import colors from '../assets/colors';

class DataStorage extends Component {
  constructor(props) {
    super();
    this.state = {
      log_window: '',
    };
  }

  componentDidMount() {
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

  getLogWindow = () => {
    return GetStoreData('LOG_WINDOW').then(data => {
      return data;
    });
  };

  render() {
    return (
      <View style={styles.row}>
        <CustomIcon
          name={'usage24'}
          color={colors.gray_icon}
          size={24}
          style={styles.icon}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{'Length of data storage'}</Text>
          <Text style={styles.description}>
            {'Number of days until local logs are automatically deleted'}
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
  }
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    flex: 1,
    paddingRight: 15,
  },
  content: {
    flex: 11,
  },
  log_window_input: {
    flex: 2,
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    textAlign: 'center',
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: colors.body_copy,
    paddingBottom: 5,
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.secondary_body_copy,
  },
});

export default DataStorage;
