import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {requireNativeComponent} from 'react-native';

class LocationHistoryImportView extends Component {
  _onReceivingPlacemarks = event => {
    if (!this.props.onReceivingPlacemarks) {
      return;
    }

    // process raw event...
    this.props.onReceivingPlacemarks(event.nativeEvent);
  };
  render() {
    return (
      <GoogleTimelineImportView
        {...this.props}
        onReceivingPlacemarks={this._onReceivingPlacemarks}
      />
    );
  }
}
LocationHistoryImportView.propTypes = {
  logWindow: PropTypes.number,
  onReceivingPlacemarks: PropTypes.func,
};

module.exports = LocationHistoryImportView;

var GoogleTimelineImportView = requireNativeComponent(
  'GoogleTimelineImportView',
  LocationHistoryImportView,
);
