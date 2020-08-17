import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from 'assets/colors';
import CustomIcon from 'assets/icons/CustomIcon.js';
import {strings} from 'locales/i18n';

class Emergency extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.title_container}>
          <View style={styles.icon_wrapper}>
            <CustomIcon name={'warning24'} color={'white'} size={24} />
          </View>
          <Text style={styles.header}>{strings('emergency.header')}</Text>
        </View>
        <Text style={styles.description}>
          {strings('emergency.description')}
        </Text>
        <View style={styles.symptom_list}>
          <Text style={styles.symptom}>
            {`- ${strings('emergency.trouble_breathing')}`}
          </Text>
          <Text style={styles.symptom}>
            {`- ${strings('emergency.chest_pain')}`}
          </Text>
          <Text style={styles.symptom}>
            {`- ${strings('emergency.new_confusion')}`}
          </Text>
          <Text style={styles.symptom}>
            {`- ${strings('emergency.stay_awake')}`}
          </Text>
          <Text style={styles.symptom}>
            {`- ${strings('emergency.bluish_lips')}`}
          </Text>
        </View>
        <Text style={styles.note}>{strings('emergency.note')}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#FFF8DF',
    borderWidth: 1,
    borderColor: '#E6BE30',
  },
  title_container: {
    flexDirection: 'row',
  },
  icon_wrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#E6BE30',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginRight: 15,
  },
  header: {
    flex: 1,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
  },
  description: {
    paddingVertical: 15,
    fontSize: 14,
    lineHeight: 18,
    color: '#212121',
  },
  symptom_list: {
    paddingBottom: 13,
  },
  symptom: {
    paddingVertical: 3,
    paddingLeft: 5,
    fontSize: 14,
    lineHeight: 24,
    color: '#212121',
  },
  note: {
    fontSize: 12,
    lineHeight: 15,
    color: '#212121',
  },
});

export default Emergency;
