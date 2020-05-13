import React, {PureComponent} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import SymptomTracker from '../SymptomTracker/SymptomTracker';
import DateConverter from '../utils/date';
import {GetKeys} from '../utils/asyncStorage';
import CareTips from '../CareTips/CareTips';

class Symptoms extends PureComponent {
  constructor() {
    super();
    this.state = {
      date: new Date(),
      calendarExpand: false,
      markedDates: {},
    };
  }

  componentDidMount() {
    this.fetchDaysWithLog();
  }

  fetchDaysWithLog = async () => {
    const keys = await GetKeys('SYMPTOM_');
    if (keys && keys.length > 0) {
      const days = keys.map(key => {
        return key.split('_')[1];
      });
      let markedDates = {};
      days.forEach(day => {
        markedDates[day] = {marked: true};
      });
      this.setState({markedDates});
    }
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.date}>
            {DateConverter.dateString(this.state.date)}
          </Text>
        </View>
        <SymptomTracker date={this.state.date} navigate={this.props.navigate} />
        <CareTips />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 0,
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 16,
    lineHeight: 24,
    color: '#212121',
  },
});

export default Symptoms;
