import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from 'assets/colors';
import {strings} from 'locales/i18n';

class Disclaimer extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{strings('disclaimer.title')}</Text>
        <Text style={styles.content}>{strings('disclaimer.content')}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 19,
  },
  title: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    color: colors.body_copy,
    paddingBottom: 5,
  },
  text: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.body_copy,
  },
});

export default Disclaimer;
