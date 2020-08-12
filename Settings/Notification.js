import React, {Component} from 'react';
import TraceTool from './TraceTool';
import {GetStoreData, SetStoreData} from 'utils/asyncStorage';
import NotificationServices from 'services/NotificationServices';
import {strings} from 'locales/i18n';

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
        title={strings('global.perm1')}
        description={strings('global.perm1desc')}
        toggleValue={this.state.notification}
        handleToggle={this.updateSetting}
      />
    );
  }
}

export default Notification;
