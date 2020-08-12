import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {strings} from '../../locales/i18n';
import PreferenceOptIn from './PreferenceOptIn';

class NotificationsOptIn extends Component {
  render() {
    return (
      <PreferenceOptIn
        image={require('../../assets/preference/preference_1.png')}
        title={strings('global.preference1_headline')}
        description={strings('global.preference1_description')}
        reminder={strings('global.preference1_reminder')}
        turn_on={strings('global.preference1_turn_on')}
        turned_on={strings('global.preference1_turned_on')}
        navigation={this.props.navigation}
      />
    );
  }
}

export default NotificationsOptIn;
