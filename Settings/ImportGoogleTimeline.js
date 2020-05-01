import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import {parseString} from 'react-native-xml2js';
import Modal from '../views/Modal';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../assets/colors';
import GoogleTimelineImportView from './GoogleTimelineImportView';

class ImportGoogleTimeline extends Component {
  constructor() {
    super();
    this.state = {
      googleSignInVisible: false,
      title: 'Sign-in to Google',
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
        latitude: lat,
        longitude: long,
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
    console.log(results);
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
          title={this.state.title}>
          <GoogleTimelineImportView
            style={styles.wrapper}
            onReceivingPlacemarks={this.processKMLResponse}
          />
        </Modal>
        <View style={styles.row}>
          <Icon
            name={'logo-google'}
            color={colors.gray_icon}
            size={24}
            style={styles.icon}
          />
          <View style={styles.content}>
            <Text style={styles.title}>Import Location History</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({googleSignInVisible: true})}>
            <Text style={styles.buttonTitle}>Import</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
  },
  icon: {
    flex: 1,
    paddingRight: 15,
    paddingLeft: 3,
  },
  content: {
    flex: 11,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: colors.body_copy,
  },
  button: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.primary_theme,
  },
  buttonTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  wrapper: {
    flex: 1,
  },
});

export default ImportGoogleTimeline;
