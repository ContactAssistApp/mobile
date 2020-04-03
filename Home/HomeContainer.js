import React, {Component} from 'react';
import {Button, Text} from 'react-native';
import {connect} from 'react-redux';
import {startScan} from './actions.js';
import {bindActionCreators} from 'redux';
import {NativeModules, NativeEventEmitter} from 'react-native';
import LocationServices from './LocationServices';
import AsyncStorage from '@react-native-community/async-storage';

//active contact means we reached out and read the ID of device
const CONTACT_ACTIVE = 1;
//active contact means a device reached out to us and send their ID
const CONTACT_PASSIVE = 2;


class HomeContainer extends Component {
  constructor() {
    super();
    this.state = {
      record: 0,
      isBleEnabled: false
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

  trackGPS = () => {
    LocationServices.start();
  };

  stopTrackGPS = () => {
    LocationServices.stop();
  };

  exportGPS = () => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          console.log(JSON.parse(result[1]).length);
          this.setState({
            record: JSON.parse(result[1]).length,
          });
        });
      });
    });
  };

  clearAsyncStorage = async() => {
    AsyncStorage.clear();
  };

  componentWillUnmount() {
    this.subscriptions.forEach(e => e.remove());
  }

  startBle = () => {
    NativeModules.BLE.start_ble();
    this.setState({ isBleEnabled: true });
  }

  stopBle = () => {
    NativeModules.BLE.stop_ble();
    this.setState({ isBleEnabled: false });
  }

  countLogs = (kind) => {
    var count = 0;
    this.state.contactLogs.forEach(log => {
      if(kind == log.kind)
        ++count;
    });
    return count.toString();
  }

  render() {
    return (
      <>
        <Button title={'Start BLE'} onPress={this.startBle} />
        <Button title={'Stop BLE'} onPress={this.stopBle} />

        <Button title={'Track GPS'} onPress={this.trackGPS} />
        <Button title={'Stop Track GPS'} onPress={this.stopTrackGPS} />
        <Button title={'Export gps'} onPress={this.exportGPS} />
        <Button title={'clear storage'} onPress={this.clearAsyncStorage} />

        <Text>{this.state.record}</Text>
        <Text>Bluetooth: {this.state.isBleEnabled.toString()}</Text>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    bleData: state.homeReducer,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  startScan,
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContainer);
