import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {strings} from '../../locales/i18n';
import PreferenceOptIn from './PreferenceOptIn';
import {GetStoreData, SetStoreData} from '../../utils/asyncStorage';
import NotificationServices from '../../services/NotificationServices';

class NotificationsOptIn extends Component {
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

  getSetting = async key => {
    const data = await GetStoreData(key);
    return data === 'true' ? true : false;
  };

  updateSetting = async state => {
    if (state) {
      await NotificationServices.enable();
      NotificationServices.start();
      if (!(await NotificationServices.isEnabled())) {
        return;
      }
    }

    SetStoreData('ENABLE_NOTIFICATION', state);

    this.setState({
      notification: state,
    });
  };

  nextScreen = () => {
    this.props.navigation.navigate('LocationOptIn');
  };

  render() {
    return (
      <PreferenceOptIn
        image={require('../../assets/preference/preference_1.png')}
        title={strings('global.preference1_headline')}
        description={strings('global.preference1_description')}
        reminder={strings('global.preference1_reminder')}
        turnOnButtonText={strings('global.preference1_turn_on')}
        turnedOnButtonText={strings('global.preference1_turned_on')}
        onEnable={() => this.updateSetting(!this.state.notification)}
        isEnabled={this.state.notification}
        onNextScreen={this.nextScreen}
      />
    );
  }
}

export default NotificationsOptIn;
