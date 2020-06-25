import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import { WebView } from 'react-native-webview';
import CookieManager from '@react-native-community/cookies';

import {strings} from '../locales/i18n';

const SIGN_IN_URL = "https://accounts.google.com/signin";
const SIGNED_IN_HOST = "https://myaccount.google.com";
const useWebKit = true;

class GoogleTimelineImportView extends Component {
  constructor() {
    super();

    this.state = {
      downloadInProgess: false,
    };
  }

  onNavigationStateChange = newNavState => {
    const { url } = newNavState;

    if(!url.startsWith(SIGNED_IN_HOST))
      return;

    if(this.state.downloadInProgess) {
      console.log("import in progress, skip");
      return;
    }
    this.setState({ downloadInProgess: true })

    CookieManager.get('https://www.google.com', useWebKit).then(cookies => {
      let cookie_str = ""  
      for (const [key, value] of Object.entries(cookies)) {
        if(cookie_str != "")
          cookie_str += "; ";
        cookie_str += key + "=" + value.value;
      }

      var now = new Date();
      var begin = new Date(now.getTime() - 14 * 24 * 3600 * 1000);
  
      let download_url = `https://www.google.com/maps/timeline/kml?authuser=0&pb=!1m8!1m3!1i${begin.getFullYear()}!2i${begin.getMonth()+1}!3i${begin.getDate()}!2m3!1i${now.getFullYear()}!2i${now.getMonth()+1}!3i${now.getDate()}`; 

      console.log("dowloading: " + download_url);

      fetch(download_url, {
        headers: {
          'content-disposition': 'attachment',
          'Content-Type': 'application/vnd.google-earth.kml+xml',
          'Cookie': cookie_str,
        }})
        .then(response => response.text())
        .then(body => {
          console.log("download successfull");
          if(this.props.onReceivingPlacemarks)
            this.props.onReceivingPlacemarks({ 'data': body })
        })
        .catch(e => {
          console.log('Google Import failed: ' + e);
          if(this.props.onReceivingPlacemarks)
            this.props.onReceivingPlacemarks({ 'error': e })
        });
    });    
  }
    

  render() {
    if(this.state.downloadInProgess)
      return (
        <View><Text>{strings('google.downloadInProgress')}</Text></View>
      );
    else
      return (
        <WebView
          source = {{ uri: SIGN_IN_URL }}
          onNavigationStateChange = {this.onNavigationStateChange} />
      );
  }
}

GoogleTimelineImportView.propTypes = {
  isVisible: PropTypes.bool,
  logWindow: PropTypes.number,
  onReceivingPlacemarks: PropTypes.func,
};

module.exports = GoogleTimelineImportView;
