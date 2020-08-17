import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {strings} from '../../locales/i18n';
import PreferenceOptIn from './PreferenceOptIn';
import {GetStoreData, SetStoreData} from '../../utils/asyncStorage';
import LocationServices from '../../services/LocationServices';

class LocationOptIn extends Component {
  constructor(props) {
    super();
    this.state = {
      notification: false,
    };
  }

  componentDidMount() {
    this.getSetting('ENABLE_LOCATION').then(data => {
      this.setState({
        location: data,
      });
    });
  }

  getSetting = async key => {
    const data = await GetStoreData(key);
    return data === 'true' ? true : false;
  };

  updateSetting = async state => {
    if (state) {
      await LocationServices.enable();
      LocationServices.start();
      if (!(await LocationServices.isEnabled())) {
        return;
      }
    } else {
      LocationServices.stop();
    }

    SetStoreData('ENABLE_LOCATION', state);

    this.setState({
      location: state,
    });
  };

  nextScreen = () => {
    this.props.navigation.navigate('LocationHistoryOptIn');
  };

  render() {
    return (
      <PreferenceOptIn
        image={require('../../assets/preference/preference_2.png')}
        title={strings('global.preference2_headline')}
        description={strings('global.preference2_description')}
        reminder={strings('global.preference2_reminder')}
        turnOnButtonText={strings('global.preference2_turn_on')}
        turnedOnButtonText={strings('global.preference2_turned_on')}
        onEnable={() => this.updateSetting(!this.state.location)}
        isEnabled={this.state.location}
        onNextScreen={this.nextScreen}
      />
    );
  }
}

export default LocationOptIn;
