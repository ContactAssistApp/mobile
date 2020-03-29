import React, {Component} from 'react';
import {Button, Alert} from 'react-native';
import {connect} from 'react-redux';
import {startScan} from './actions.js';
import {bindActionCreators} from 'redux';
import {NativeModules, NativeEventEmitter} from 'react-native';
import LocationServices from './LocationServices';

class HomeContainer extends Component {
  //FIXME only register this once when the app starts
  commonBleInit = () => {
    if (this.logInitted !== true) {
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

  scanBle = () => {
    // this.props.startScan();
    this.commonBleInit();
    NativeModules.BLE.startScanning();
  };

  bleBroadcast = () => {
    console.log("BLE start broadcasting...");
    this.commonBleInit();
    NativeModules.BLE.startAdvertising();
    //TODO use native module for scanning
    //NativeModules.BLE.startScanning()
  };

  stopBroadcast = () => {
    NativeModules.BLE.stopAdvertising();
  };

  trackGPS = () => {
    LocationServices.start();
  };

  stopTrackGPS = () => {
    LocationServices.stop();
  };

  render() {
    return (
      <>
        <Button title={'Scan BLE'} onPress={this.scanBle} />
        <Button title={'Broadcast BLE'} onPress={this.bleBroadcast} />
        <Button title={'Stop Broadcast BLE'} onPress={this.stopBroadcast} />
        <Button title={'Track GPS'} onPress={this.trackGPS} />
        <Button title={'Stop Track GPS'} onPress={this.stopTrackGPS} />
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
