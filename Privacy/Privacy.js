import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../assets/colors';

class Privacy extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          This information is stored in the app on your phone and remains private to you.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: colors.fill_off,
    marginHorizontal: 25,
    marginBottom: 40,
    padding: 15,
  },
  text: {
    fontSize: 13,
    lineHeight: 15,
    color: '#141414',
  },
});

export default Privacy;
