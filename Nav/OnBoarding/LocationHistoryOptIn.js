import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {strings} from '../../locales/i18n';
import PreferenceOptIn from './PreferenceOptIn';

class LocationHistoryOptIn extends Component {
  nextScreen = () => {
    this.props.navigation.navigate('AnalyticsOptIn');
  };

  render() {
    return (
      <PreferenceOptIn
        image={require('../../assets/preference/preference_3.png')}
        title={strings('global.preference3_headline')}
        description={strings('global.preference3_description')}
        reminder={strings('global.preference3_reminder')}
        turnOnButtonText={strings('global.preference3_turn_on')}
        turnedOnButtonText={strings('global.preference3_turned_on')}
        onNextScreen={this.nextScreen}
      />
    );
  }
}

export default LocationHistoryOptIn;
