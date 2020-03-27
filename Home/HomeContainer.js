import React, {Component} from 'react';
import {Button, Alert} from 'react-native';
import {connect} from 'react-redux';
import {startScan} from './actions.js';
import {bindActionCreators} from 'redux';
import {NativeModules, NativeEventEmitter} from 'react-native';

class HomeContainer extends Component {

  //FIXME only register this once when the app starts
  commonBleInit = () => {
    if(this.logInitted != true) {
      const bleEmitter = new NativeEventEmitter(NativeModules.BLE);
      const subscription = bleEmitter.addListener(
        'onLifecycleEvent',
        (data) => console.log("log:" +data)
      );
      this.logInitted = true; 
    }

    NativeModules.BLE.init_module(
      '0000c019-0000-1000-8000-00805f9b34fb', //service ID
      'D61F4F27-3D6B-4B04-9E46-C9D2EA617F62' //characteristic ID
    );
  }

  trackBle = () => {
    // this.props.startScan();

    this.commonBleInit();
    NativeModules.BLE.startScanning();

  }

  callNative = () => {
    console.log("=====");
    NativeModules.Device.getDeviceName((err, name) => {
      console.log(name);
    });
  }

  bleBroadcast = () => {
    console.log("=====");

    // NativeModules.BeaconBroadcast.startSharedAdvertisingBeaconWithString('94eee192-6929-41a1-8da0-04066b00a3b0', 100, 1, '94eee192-6929-41a1-8da0-04066b00a3b0');

    this.commonBleInit();

    NativeModules.BLE.startAdvertising();
    //TODO use native module for scanning
    //NativeModules.BLE.startScanning()
  }

  stopBroadcast = () => {
    // NativeModules.BeaconBroadcast.stopSharedAdvertisingBeacon();
    NativeModules.BLE.stopAdvertising();
  }

  render() {
    return (
      <>
        <Button
          title={'Track BLE'}
          onPress={this.trackBle}
        />
        <Button title={'calling native'} onPress={this.callNative} />
        <Button title={'Broadcast'} onPress={this.bleBroadcast} />
        <Button title={'Stop Broadcast'} onPress={this.stopBroadcast} />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bleData: state.homeReducer,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  startScan,
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContainer);
