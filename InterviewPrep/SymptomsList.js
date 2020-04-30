import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {View} from 'react-native';
import SymptomsHalfDay from '../SymptomTracker/SymptomsHalfDay';
import {GetKeys, GetMulti} from '../utils/asyncStorage';
import SectionHeader from './SectionHeader';
import DateHeader from './DateHeader';

class SymptomsList extends Component {
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
        <SectionHeader header={'Symptoms'} />
        {this.state.logs.map((log, index) => {
          const key = Object.keys(log)[0];
          const keyArr = key.split('_');

          return (
            <View key={key}>
              <DateHeader date={keyArr[1]} timeOfDay={keyArr[2]} />
              <SymptomsHalfDay symptoms={log[key]} />
            </View>
          );
        })}
      </>
    );
  }
}

export default SymptomsList;
