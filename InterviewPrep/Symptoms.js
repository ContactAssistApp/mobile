import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import colors from '../assets/colors';
import SymptomsHalfDay from '../SymptomTracker/SymptomsHalfDay';
import {GetKeys, GetMulti} from '../utils/asyncStorage';
import SectionHeader from './SectionHeader';
import DateHeader from './DateHeader';

class Symptoms extends Component {
  constructor() {
    super();
    this.state = {
      logs: [],
    };
  }

  componentDidMount() {
    this.fetchSymptomsLog();
  }

  fetchSymptomsLog = async () => {
    const keys = await GetKeys('SYMPTOM_');
    let date = new Date();
    date.setDate(date.getDate() - 14);
    const keysInTwoWeeks = keys.filter(key => {
      const d = key.split('_')[1];
      return new Date(d) > date;
    });
    const logs = await GetMulti(keysInTwoWeeks);
    this.setState({
      logs,
    });
  };

  render() {
    return (
      <>
        <View style={styles.intro_container}>
          <View style={styles.header}>
            <Image
              style={styles.clipboard}
              source={require('../assets/health/clipboard.png')}
            />
            <Text style={styles.title}>
              Review which symptoms you{'\n'}would like to include.
            </Text>
          </View>
          <Text style={styles.description}>
            We’ve detected severe symptoms in your recent reports, and collected them below.
          </Text>
        </View>
        <SectionHeader header={'Symptoms'} />
        {this.state.logs.map((log, index) => {
          const key = Object.keys(log)[0];
          const keyArr = key.split('_');

          return (
            <>
              <View>
                <DateHeader date={keyArr[1]} timeOfDay={keyArr[2]}/>
              </View>
              <SymptomsHalfDay symptoms={log[key]} />
            </>
          )
        })}
      </>
    );
  }
}

const styles = StyleSheet.create({
  intro_container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  clipboard: {
    width: 60,
    height: 70,
  },
  title: {
    paddingLeft: 10,
    fontSize: 18,
    lineHeight: 25,
    color: colors.section_title,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.module_title,
    paddingHorizontal: 20,
  },
  section_title: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    textTransform: 'uppercase',
    color: colors.secondary_body_copy,
    padding: 20,
    backgroundColor: colors.card_border,
  },
});

export default Symptoms;
