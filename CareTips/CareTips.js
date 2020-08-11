import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {strings} from 'locales/i18n';
import Tip from './Tip';

class CareTips extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header_container}>
          <Text style={styles.header}>{strings('care_tips.header')}</Text>
        </View>
        <Tip
          icon={'home24'}
          title={strings('care_tips.stay_home_title')}
          content={strings('care_tips.stay_home_description')}
        />
        <Tip
          icon={'incognito24'}
          title={strings('care_tips.isolate_title')}
          content={strings('care_tips.isolate_description')}
        />
        <Tip
          icon={'activity24'}
          title={strings('care_tips.monitor_symptom_title')}
          content={strings('care_tips.monitor_symptom_description')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  header_container: {
    paddingVertical: 20,
  },
  header: {
    fontSize: 18,
    lineHeight: 22,
    textTransform: 'capitalize',
  },
});

export default CareTips;
