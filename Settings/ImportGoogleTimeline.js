import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import {parseString} from 'react-native-xml2js';
import Modal from '../views/Modal';
import colors from '../assets/colors';
import GoogleTimelineImportView from './GoogleTimelineImportView';
import {LocationData} from '../utils/LocationData';
import CustomIcon from '../assets/icons/CustomIcon.js';

class ImportGoogleTimeline extends Component {
  constructor() {
    super();
    this.state = {
      googleSignInVisible: false,
    };
  }

  handleModalClose = () => {
    this.setState({googleSignInVisible: false});
  };

  importFinished = (reason, notFailure) => {
    let title, description;
    if (notFailure) {
      title = reason;
    } else {
      title = 'Failed to Import Location from Google';
      description = reason;
    }
    Alert.alert(title, description, [
      {
        onPress: this.handleModalClose,
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
          this.importFinished(error);
        }
      });
    } else {
      this.importFinished(dict.error);
    }
  };

  render() {
    return (
      <>
        <Modal
          visible={this.state.googleSignInVisible}
          handleModalClose={this.handleModalClose}
          useScrollView={false}
          title={'Sign-in to Google'}>
          <GoogleTimelineImportView
            style={styles.wrapper}
            onReceivingPlacemarks={this.processKMLResponse}
          />
        </Modal>

        <TouchableOpacity
          style={styles.row}
          onPress={() => this.setState({googleSignInVisible: true})}>
          <CustomIcon
            name={'import24'}
            color={colors.gray_icon}
            size={16}
            style={styles.icon}
          />
          <View style={styles.content}>
            <Text style={styles.title}>Import Location History</Text>
            <Text style={styles.description}>
              Sync your location history directly from Google by importing your timeline data.
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 19,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingRight: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: colors.body_copy,
    paddingBottom: 5,
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.secondary_body_copy,
  },
  wrapper: {
    flex: 1,
  },
});

export default ImportGoogleTimeline;
