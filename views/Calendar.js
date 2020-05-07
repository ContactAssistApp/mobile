import React, {Component} from 'react';
import {WeekCalendar, CalendarList} from 'react-native-calendars';
import colors from '../assets/colors';

export default class Calendar extends Component {
  render() {
    const {markedDates, weekView} = this.props;
    console.log(markedDates);
    return (
      <>
        {weekView ? (
          <WeekCalendar
            markedDates={markedDates}
            allowShadow={false}
            hideDayNames={true}
            theme={{
              dayTextColor: colors.secondary_body_copy,
              todayTextColor: colors.secondary_body_copy,
              dotColor: '#ACACAC',
            }}
            onDayPress={day => {
              this.props.handleDayPress(day);
            }}
          />
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
