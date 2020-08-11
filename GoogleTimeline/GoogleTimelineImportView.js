import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';
import {WebView} from 'react-native-webview';
import CookieManager from '@react-native-community/cookies';
import {strings} from 'locales/i18n';
import DateConverter from 'utils/date';

const SIGN_IN_URL = 'https://accounts.google.com/signin';
const SIGNED_IN_HOST = 'https://myaccount.google.com';
const useWebKit = true;

class GoogleTimelineImportView extends Component {
  constructor() {
    super();

    this.state = {
      downloadInProgess: false,
    };
  }

  onNavigationStateChange = newNavState => {
    const {url} = newNavState;
    const {endDateStr} = this.props;

    if (!url.startsWith(SIGNED_IN_HOST)) {
      return;
    }

    if (this.state.downloadInProgess) {
      console.log('import in progress, skip');
      return;
    }

    this.setState({downloadInProgess: true});

    CookieManager.get('https://www.google.com', useWebKit).then(cookies => {
      let cookie_str = `${cookies.SIDCC.name}=${cookies.SIDCC.value}`;
      const endDate = DateConverter.calendarToDate(endDateStr);

      let download_url = `https://www.google.com/maps/timeline/kml?authuser=0&pb=!1m8!1m3!1i${endDate.getFullYear()}!2i${endDate.getMonth()}!3i${endDate.getDate()}!2m3!1i${endDate.getFullYear()}!2i${endDate.getMonth()}!3i${endDate.getDate()}`;

      console.log('dowloading: ' + download_url);

      fetch(download_url, {
        credentials: 'include',
        headers: {
          'content-disposition': 'attachment',
          'Content-Type': 'application/vnd.google-earth.kml+xml',
          'Cookie': cookie_str,
        }})
        .then(response => response.text())
        .then(body => {
          if (this.props.onReceivingPlacemarks) {
            this.props.onReceivingPlacemarks({data: body});
          }
        })
        .catch(e => {
          console.log('Google Import failed: ' + e);
          if (this.props.onReceivingPlacemarks) {
            this.props.onReceivingPlacemarks({error: e});
          }
        });
    });
  };

  render() {
    if (this.state.downloadInProgess) {
      return (
        <View>
          <Text>{strings('google.downloadInProgress')}</Text>
        </View>
      );
    } else {
      return (
        <WebView
          source={{uri: SIGN_IN_URL}}
          onNavigationStateChange={this.onNavigationStateChange}
        />
      );
    }
  }
}

GoogleTimelineImportView.propTypes = {
  isVisible: PropTypes.bool,
  logWindow: PropTypes.number,
  onReceivingPlacemarks: PropTypes.func,
  endDateStr: PropTypes.string.isRequired,
  dateRange: PropTypes.number.isRequired,
};

module.exports = GoogleTimelineImportView;
