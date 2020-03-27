import React, {Component} from 'react';
import {Button, Alert} from 'react-native';
import {connect} from 'react-redux';
import {startScan} from './actions.js';
import {bindActionCreators} from 'redux';
import {NativeModules} from 'react-native';

class HomeContainer extends Component {
  trackBle = () => {
    this.props.startScan();
  };
  callNative = () => {
    console.log("=====");
    NativeModules.Device.getDeviceName((err, name) => {
      console.log(name);
    });
  }

  bleBroadcast = () => {
    console.log("=====");

    NativeModules.BeaconBroadcast.startSharedAdvertisingBeaconWithString('94eee192-6929-41a1-8da0-04066b00a3b0', 100, 1, '94eee192-6929-41a1-8da0-04066b00a3b0');
  }

  stopBroadcast = () => {
    NativeModules.BeaconBroadcast.stopSharedAdvertisingBeacon();
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
