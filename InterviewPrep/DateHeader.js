import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import colors from 'assets/colors';
import DateConverter from 'utils/date';

class DateHeader extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.date}>
          {DateConverter.dateString(
            DateConverter.calendarToDate(this.props.date),
          )}
          {this.props.timeOfDay && (
            <Text style={styles.time}> {this.props.timeOfDay}</Text>
          )}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 19,
    paddingVertical: 11,
    borderBottomColor: colors.card_border,
    borderBottomWidth: 1,
  },
  date: {
    fontSize: 14,
    lineHeight: 18,
    textTransform: 'capitalize',
    fontWeight: '500',
    color: colors.secondary_body_copy,
  },
  time: {
    textTransform: 'uppercase',
  },
});

export default DateHeader;
