import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import colors from '../assets/colors';

class Locations extends Component {
  componentDidMount() {
    const locations = [
      {
        latitude: 50.934430,
        longitude: -102.816690,
        time: 1587843741483,
      },
      {
        latitude: 50.934430,
        longitude: -102.816690,
        time: 1587843793871,
      },
      {
        latitude: 50.934430,
        longitude: -102.816690,
        time: 1587843806886,
      },
      {
        latitude: 40.742050,
        longitude: -73.993851,
        time: 1587843813376,
      }];

      // TODO: call get address method
  }
  render() {
    return (
      <>
        <Text>location</Text>
      </>
    );
  }
}

const styles = StyleSheet.create({

});

export default Locations;
