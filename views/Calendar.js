import React, {Component} from 'react';
import {WeekCalendar, CalendarList} from 'react-native-calendars';
import {View, StyleSheet, Text} from 'react-native';
import colors from '../assets/colors';

class Calendar extends Component {
  render() {
    const {markedDates, weekView, current} = this.props;

    return (
      <>
        {weekView ? (
          <>
            <View style={styles.day_container}>
              <Text style={styles.day}>S</Text>
              <Text style={styles.day}>M</Text>
              <Text style={styles.day}>T</Text>
              <Text style={styles.day}>W</Text>
              <Text style={styles.day}>T</Text>
              <Text style={styles.day}>F</Text>
              <Text style={styles.day}>S</Text>
            </View>
            <WeekCalendar
              current={current}
              markedDates={markedDates}
              allowShadow={false}
              hideDayNames={true}
              theme={{
                selectedDayTextColor: colors.primary_theme,
                selectedDayBackgroundColor: colors.fill_on,
                dayTextColor: colors.secondary_body_copy,
                todayTextColor: colors.secondary_body_copy,
                dotColor: '#ACACAC',
                selectedDotColor: colors.primary_theme,
              }}
              onDayPress={day => {
                this.props.handleDayPress(day);
              }}
              style={styles.week_calendar}
            />
          </>
        ) : (
          <CalendarList
            pastScrollRange={12}
            markedDates={this.props.markedDates}
            futureScrollRange={0}
            theme={{
              selectedDayTextColor: colors.primary_theme,
              selectedDayBackgroundColor: colors.fill_on,
              dayTextColor: colors.secondary_body_copy,
              todayTextColor: colors.secondary_body_copy,
              dotColor: '#ACACAC',
              selectedDotColor: colors.primary_theme,
            }}
            onDayPress={day => {
              this.props.handleDayPress(day);
            }}
          />
        )}
        {this.props.children}
      </>
    );
  }
}
const styles = StyleSheet.create({
  day_container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 5.5,
    justifyContent: 'space-evenly',
  },
  day: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    color: colors.body_copy,
  },
  week_calendar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
  },
});

export default Calendar;
