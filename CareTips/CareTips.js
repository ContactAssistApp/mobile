import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../assets/colors';
import Tip from './Tip';

class CareTips extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>What To Do When You Get Sick</Text>
        <Tip
          icon={'incognito24'}
          title={'Isolation order'}
          content={'Everyone who has tested positive for COVID-19 shall remain in isolation until no longer infectious. Do not leave your home or recovery facility, except to receive medical care.'}
        />
        <Tip
          icon={'activity24'}
          title={'Monitor You Symptoms'}
          content={'If you have symptoms like cough, fever, or other respiratory problems, contact your regular doctor first. Do not go to the emergency room. Emergency rooms need to be able to serve those with the most critical needs. If you have difficulty breathing, it doesn’t mean you have novel coronavirus, but you should call 911.'}
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
