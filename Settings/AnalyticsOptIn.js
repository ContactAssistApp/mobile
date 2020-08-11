import React, {Component} from 'react';
import TraceTool from './TraceTool';
import Crashes from 'appcenter-crashes';
import Analytics from 'appcenter-analytics';
import {GetStoreData, SetStoreData} from '../utils/asyncStorage';
import {strings} from '../locales/i18n';

class AnalyticsOptIn extends Component {
  constructor(props) {
    super();
    this.state = {
      optIn: false,
    };
  }

  componentDidMount() {
    this.getSetting('ANALYTICS-OPTIN').then(data => {
      this.setState({optIn: data});
    });
  }

  getSetting = async key => {
    let data = await GetStoreData(key);
    return data === 'true' ? true : false;
  };

  updateSetting = state => {
    let changeIt = async() => {
      await Crashes.setEnabled(state);
      await Analytics.setEnabled(state);
      await SetStoreData('ANALYTICS-OPTIN', state);
    };

    changeIt().catch(reason => console.log(reason));

    this.setState({
      optIn: state,
    });
  };

  render() {
    return (
      <TraceTool
        iconName={'share24'}
        title={strings('analytics.title')}
        description={strings('analytics.description')}
        toggleValue={this.state.optIn}
        handleToggle={this.updateSetting}
      />
    );
  }
}

export default AnalyticsOptIn;
