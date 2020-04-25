import React, {Component} from 'react';
import {GetStoreData, SetStoreData} from '../utils/asyncStorage';
import LocationServices from '../Home/LocationServices';
import TraceTool from './TraceTool';

class Location extends Component {
  constructor(props) {
    super();
    this.state = {
      location: false,
    };
  }

  componentDidMount() {
    this.getSetting('ENABLE_LOCATION').then(data => {
      this.setState({
        location: data,
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
      LocationServices.start();
    } else {
      LocationServices.stop();
    }

    SetStoreData('ENABLE_LOCATION', state);

    this.setState({
      location: state,
    });
  };

  render() {
    return (
      <TraceTool
        iconName={'location24'}
        title={'Location'}
        description={
          'Share your location information with healthcare providers.'
        }
        toggleValue={this.state.location}
        handleToggle={this.updateSetting}
      />
    );
  }
}

export default Location;
