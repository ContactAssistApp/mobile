import React, {Component} from 'react';
import TraceTool from './TraceTool';
import {GetStoreData, SetStoreData} from '../utils/asyncStorage';
import NotificationServices from '../services/NotificationServices';

class Notification extends Component {
  constructor(props) {
    super();
    this.state = {
      notification: false,
    };
  }

  componentDidMount() {
    this.getSetting('ENABLE_NOTIFICATION').then(data => {
      this.setState({
        notification: data,
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
      NotificationServices.start();
    }

    SetStoreData('ENABLE_NOTIFICATION', state);

    this.setState({
      notification: state,
    });
  };

  render() {
    return (
      <TraceTool
        iconName={'alert24'}
        title={'Notifications'}
        description={'Receive notifications for local alerts and updates.'}
        toggleValue={this.state.notification}
        handleToggle={this.updateSetting}
      />
    );
  }
}

export default Notification;
