import React, {Component} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {parseString} from 'react-native-xml2js';
import Modal from '../views/Modal';
import GoogleTimelineImportView from './GoogleTimelineImportView';
import {LocationData} from '../utils/LocationData';

class ImportGoogleTimeline extends Component {
  importFinished = (reason, notFailure) => {
    let title, description;
    reason = reason.toString();
    if (notFailure) {
      title = reason;
    } else {
      title = 'Failed to Import Location from Google';
      description = reason;
    }
    Alert.alert(title, description, [
      {
        onPress: this.props.handleModalClose,
      },
    ]);
  };

  processPlacemarks = placemarks => {
    let results = [];
    function push(coordinates, time) {
      let [long, lat] = coordinates.split(',');
      results.push({
        latitude: parseFloat(lat),
        longitude: parseFloat(long),
        time: time,
      });
    }
    for (const placemark of placemarks) {
      let timeStart = Date.parse(placemark.TimeSpan[0].begin[0]);
      let timeEnd = Date.parse(placemark.TimeSpan[0].end[0]);
      let point = placemark.Point;
      if (point) {
        let coordinates = point[0].coordinates[0];
        push(coordinates, timeStart);
        push(coordinates, timeEnd);
      } else {
        let allCoordinates = placemark.LineString[0].coordinates[0]
          .trim()
          .split(' ');
        let timeIncrement = (timeEnd - timeStart) / (allCoordinates.length - 1);
        let currentTime = timeStart;
        for (let coordinates of allCoordinates) {
          push(coordinates, Math.round(currentTime));
          currentTime += timeIncrement;
        }
      }
    }
    console.log(
      `Imported ${results.length} location points ` +
        `from ${placemarks.length} placemarks`,
    );
    LocationData.mergeInLocations(results);
    this.importFinished(
      'Successfully Imported Location History from Google',
      true,
    );
  };

  processKMLResponse = dict => {
    this.setState({title: 'Importing Location History'});
    if (dict.data) {
      parseString(dict.data, (error, result) => {
        if (result) {
          let placemarks = result.kml.Document[0].Placemark;
          if (placemarks && placemarks.length > 0) {
            this.processPlacemarks(placemarks);
          } else {
            this.importFinished(
              "You don't have any location history on Google.",
              true,
            );
          }
        } else {
          console.log("Failed to parse KML due to: " + JSON.stringify(error));
          this.importFinished("Failed to load your Google location history");
        }
      });
    } else {
      console.log("No KML data found due to: " + JSON.stringify(dict.error));
      this.importFinished("Could not load your Google location history");
    }
  };

  render() {
    return (
      <Modal
        visible={this.props.visible}
        handleModalClose={this.props.handleModalClose}
        useScrollView={false}
        title={'Sign-in to Google'}>
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
