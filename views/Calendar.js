import React, {Component} from 'react';
import {WeekCalendar, CalendarList} from 'react-native-calendars';
import {View, StyleSheet, Text} from 'react-native';
import colors from 'assets/colors';
import DateConverter from 'utils/date';
import moment from 'moment';

class Calendar extends Component {
  render() {
    let {markedDates, weekView, current} = this.props;
    let weekViewClass = this.props.children
      ? styles.week_view_with_border
      : styles.week_view_no_border;
    const maxDate = DateConverter.calendarFormat(new Date());

    Object.entries(markedDates).forEach(([key, options]) => {
      if (options.hasOwnProperty('selected')) {
        delete options.selected;
      }

      if (Object.keys(options).length === 0) {
        delete markedDates[key];
      }
    });

    if (markedDates.hasOwnProperty(current)) {
      markedDates[current].selected = true;
    } else {
      markedDates[current] = {selected: true};
    }

    return (
      <>
        {weekView ? (
          <>
            <View style={styles.day_container}>
              <Text style={styles.day}>{moment.weekdaysMin()[0]}</Text>
              <Text style={styles.day}>{moment.weekdaysMin()[1]}</Text>
              <Text style={styles.day}>{moment.weekdaysMin()[2]}</Text>
              <Text style={styles.day}>{moment.weekdaysMin()[3]}</Text>
              <Text style={styles.day}>{moment.weekdaysMin()[4]}</Text>
              <Text style={styles.day}>{moment.weekdaysMin()[5]}</Text>
              <Text style={styles.day}>{moment.weekdaysMin()[6]}</Text>
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
              style={weekViewClass}
            />
          </>
        ) : (
          <CalendarList
            pastScrollRange={12}
            markedDates={this.props.markedDates}
            futureScrollRange={0}
            maxDate={maxDate}
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
  week_view_with_border: {
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
  },
  week_view_no_border: {
    paddingBottom: 2,
  },
});

export default Calendar;
