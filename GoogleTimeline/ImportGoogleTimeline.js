import React, {Component} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {parseString} from 'react-native-xml2js';
import Modal from '../views/Modal';
import GoogleTimelineImportView from './GoogleTimelineImportView';
import {addGoogleLocations} from '../realm/realmLocationTasks';
import {strings} from '../locales/i18n';
import {addBackgroundLog} from '../realm/realmLoggingTasks'

class ImportGoogleTimeline extends Component {
  importFinished = (reason, succeeded) => {
    let title, description;
    reason = reason.toString();

    if (succeeded) {
      title = reason;
    } else {
      title = strings('google.downloadFailed');
      description = reason;
    }
    Alert.alert(title, description, [
      {
        onPress: this.props.handleModalClose,
      },
    ]);
  };

  processPlacemarks = async placemarks => {
    const locations = placemarks.filter(placemark => {
      return placemark.Point && placemark.Point.length > 0;
    })
    .map(placemark => {
      const {
        name: nameArr,
        address: addressArr,
        Point: pointArr,
        TimeSpan,
      } = placemark;

      const {begin: beginArr, end: endArr} = TimeSpan[0];
      const coordinates = pointArr[0].coordinates[0].split(',');
      const lat = parseFloat(coordinates[1]);
      const lon = parseFloat(coordinates[0]);
      const altitude = coordinates.length > 2 ? parseFloat(coordinates[3]) : null;
      const timespan = `${beginArr[0]},${endArr[0]}`;
      const accuracy = 0;
      const speed = 0;
      const kind = 'stationary';

      return {
        name: nameArr[0],
        address: addressArr[0],
        latitude: lat,
        longitude: lon,
        accuracy,
        speed,
        altitude,
        kind,
        source: 'google',
        timespan,
        time: new Date(endArr[0]).getTime(),
      };
    });

    console.log(
      `Imported ${locations.length} location points ` +
        `from ${placemarks.length} placemarks`,
    );

    if (locations && locations.length > 0) {
      await addGoogleLocations(locations);
    }

    this.importFinished(
      strings('google.downloadSuccessful'),
      true,
    );
  };

  processKMLResponse = dict => {
    if (dict.data) {
      parseString(dict.data, (error, result) => {
        if (result) {
          let placemarks = result.kml.Document[0].Placemark;
          if (placemarks && placemarks.length > 0) {
            this.processPlacemarks(placemarks);
            addBackgroundLog('Google import successfull. found ' + placemarks.length + ' placemarks.');
          } else {
            addBackgroundLog('No google history found')
            this.importFinished(
              strings('google.noHistory'),
              true,
            );
          }
        } else {
          let errMsg = 'Failed to parse KML due to: ' + JSON.stringify(error);
          addBackgroundLog(errMsg);
          console.log(errMsg);
          this.importFinished(strings('google.parsingFailed'));
        }
      });
    } else {
      let errMsg = 'No KML data found due to: ' + JSON.stringify(dict.error);
      addBackgroundLog(errMsg);
      console.log(errMsg);
      this.importFinished(strings('google.noDataFound'));
    }
  };

  render() {
    return (
      <Modal
        visible={this.props.visible}
        handleModalClose={this.props.handleModalClose}
        useScrollView={false}
        title={strings('google.signin')}>
        <GoogleTimelineImportView
          style={styles.wrapper}
          onReceivingPlacemarks={this.processKMLResponse}
        />
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

export default ImportGoogleTimeline;
