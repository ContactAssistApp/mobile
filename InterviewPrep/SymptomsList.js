import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {View} from 'react-native';
import SymptomsHalfDay from '../SymptomTracker/SymptomsHalfDay';
import SectionHeader from './SectionHeader';
import DateHeader from './DateHeader';
import {getSymptoms} from '../realm/realmSymptomsTasks';
import DateConverter from '../utils/date';

class SymptomsList extends Component {
  constructor() {
    super();
    this.state = {
      logs: [],
    };
  }

  componentDidMount() {
    this.fetchLog();
  }

  fetchLog = () => {
    const logs = getSymptoms(new Date(), 14).map(log => {
      let logObj = JSON.parse(JSON.stringify(log));
      logObj.date = DateConverter.calendarFormat(new Date(logObj.date));
      return logObj;
    });

    this.setState({
      logs,
    });
  };

  render() {
    return (
      <>
        <SectionHeader header={'Symptoms'} />
        {this.state.logs.map((log, index) => {
          const {date, timeOfDay} = log;
          return (
            <View key={index}>
              <DateHeader date={date} timeOfDay={timeOfDay} />
              <SymptomsHalfDay symptoms={log} />
            </View>
          );
        })}
      </>
    );
  }
}

export default SymptomsList;
