import React, {Component} from 'react';
import {Settings} from 'react-native';
import TraceTool from './TraceTool';

class AnalyticsOptIn extends Component {
  constructor(props) {
    super();
    this.state = {
      optIn: !!Settings.get('analyticsOptIn'),
    };
  }

  updateSetting = state => {
    Settings.set({'analyticsOptIn': state});

    this.setState({
      optIn: state,
    });
  };

  render() {
    return (
      <TraceTool
        iconName={'share24'}
        title={'Analytics'}
        description={
          'Share analytics and crash data with CovidSafe developers.'
        }
        toggleValue={this.state.optIn}
        handleToggle={this.updateSetting}
      />
    );
  }
}

export default AnalyticsOptIn;
