import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {strings} from '../../locales/i18n';
import PreferenceOptIn from './PreferenceOptIn';

class AnalyticsOptIn extends Component {
  nextScreen = () => {
    this.props.navigation.navigate('ThankYou');
  };

  render() {
    return (
      <PreferenceOptIn
        image={require('../../assets/preference/preference_4.png')}
        title={strings('global.preference4_headline')}
        description={strings('global.preference4_description')}
        reminder={strings('global.preference4_reminder')}
        turnOnButtonText={strings('global.preference4_turn_on')}
        turnedOnButtonText={strings('global.preference4_turned_on')}
        onNextScreen={this.nextScreen}
      />
    );
  }
}

export default AnalyticsOptIn;
