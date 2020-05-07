import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import colors from '../assets/colors';

class Import extends Component {
  render() {
    return (
      <>
        <Image
          source={require('../assets/health/map.png')}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({

});

export default Import;
