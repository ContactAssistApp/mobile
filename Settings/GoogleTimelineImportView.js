import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {requireNativeComponent} from 'react-native';

class GoogleTimelineImportView extends Component {
  _onReceivingPlacemarks = event => {
    if (!this.props.onReceivingPlacemarks) {
      return;
    }
    this.props.onReceivingPlacemarks(event.nativeEvent);
  };

  render() {
    return (
      <NativeGoogleTimelineImportView
        {...this.props}
        onReceivingPlacemarks={this._onReceivingPlacemarks}
      />
    );
  }
}

GoogleTimelineImportView.propTypes = {
  isVisible: PropTypes.bool,
  logWindow: PropTypes.number,
  onReceivingPlacemarks: PropTypes.func,
};

module.exports = GoogleTimelineImportView;

var NativeGoogleTimelineImportView = requireNativeComponent(
  'GoogleTimelineImportView',
  GoogleTimelineImportView,
);
