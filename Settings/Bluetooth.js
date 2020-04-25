import React, {Component} from 'react';
import {GetStoreData, SetStoreData} from '../utils/asyncStorage';
import TraceTool from './TraceTool';
import Ble from '../utils/ble';

class Bluetooth extends Component {
  constructor(props) {
    super();
    this.state = {
      ble: false,
    };
  }

  componentDidMount() {
    this.getSetting('ENABLE_BLE').then(data => {
      this.setState({
        ble: data,
      });
    });
  }

  getSetting = key => {
    return GetStoreData(key).then(data => {
      return data === 'true' ? true : false;
    });
  };

  updateSetting = state => {
    if (state) {
      Ble.start();
    } else {
      Ble.stop();
    }

    SetStoreData('ENABLE_BLE', state);
    this.setState({
      ble: state,
    });
  };

  render() {
    return (
      <TraceTool
        iconName={'bluetooth24'}
        title={'Bluetooth'}
        description={
          'Enables the detection of exposure risks within a close distance to you, anonymously.'
        }
        toggleValue={this.state.ble}
        handleToggle={this.updateSetting}
      />
    );
  }
}

export default Bluetooth;
