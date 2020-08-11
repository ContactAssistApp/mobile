import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Tip from './Tip';
import {strings} from '../locales/i18n';

class CareTips extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          {strings("what.to_do_if_you_are_sick")}
        </Text>
        <Tip
          icon={'incognito24'}
          title={strings('isolation.order')}
          content={strings('global.isolation1') + strings('global.isolation2')}
        />
        <Tip
          icon={'activity24'}
          title={strings('monitor.your_symptoms')}
          content={strings('global.monitor1') + strings('global.monitor2') + strings('global.monitor3')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
  },
  header: {
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.35,
  },
});

export default CareTips;
